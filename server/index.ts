import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { z } from 'zod';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const PERSON_APP_ID = requireEnv('ALGOLIA_PERSON_APP_ID');
const PERSON_API_KEY = requireEnv('ALGOLIA_PERSON_API_KEY');
const PERSON_INDEX_NAME = requireEnv('ALGOLIA_PERSON_INDEX');

const COURT_APP_ID = requireEnv('ALGOLIA_COURT_APP_ID');
const COURT_API_KEY = requireEnv('ALGOLIA_COURT_API_KEY');
const COURT_INDEX_NAME = requireEnv('ALGOLIA_COURT_INDEX');

interface AlgoliaPersonRecord {
  objectID: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  name_suff?: string;
  dob?: string;
  alt1DOB?: string;
  alt2DOB?: string;
  alt3DOB?: string;
  aka1fullname?: string;
  aka2fullname?: string;
  aka3fullname?: string;
  [key: string]: unknown;
}

interface AlgoliaCourtRecord {
  objectID: string;
  [key: string]: unknown;
}

const searchClientPerson: SearchClient = algoliasearch(PERSON_APP_ID, PERSON_API_KEY);
const personIndex: SearchIndex = searchClientPerson.initIndex(PERSON_INDEX_NAME);

const searchClientCourt: SearchClient = algoliasearch(COURT_APP_ID, COURT_API_KEY);
const courtIndex: SearchIndex = searchClientCourt.initIndex(COURT_INDEX_NAME);

type PersonSearchFilters = Partial<
  Record<'firstname' | 'lastname' | 'middlename' | 'dob' | 'city' | 'st' | 'zip' | 'ssn', string>
>;

const searchSchema = z
  .object({
    firstname: z.string().trim().optional(),
    lastname: z.string().trim().optional(),
    middlename: z.string().trim().optional(),
    dob: z.string().trim().optional(),
    city: z.string().trim().optional(),
    st: z.string().trim().optional(),
    zip: z.string().trim().optional(),
    ssn: z.string().trim().optional(),
  })
  .transform((data) => {
    const cleaned: PersonSearchFilters = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value && value.length > 0) {
        cleaned[key as keyof PersonSearchFilters] = value;
      }
    });
    return cleaned;
  });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_ORIGIN ? [CLIENT_ORIGIN] : true,
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

function buildFilterExpression(filters: PersonSearchFilters): string | undefined {
  const parts: string[] = [];
  Object.entries(filters).forEach(([attribute, value]) => {
    if (!value) return;
    const sanitizedValue = value.replace(/"/g, '\\"');
    parts.push(`${attribute}:"${sanitizedValue}"`);
  });
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(' AND ');
}

function collectIdentifiers(person: AlgoliaPersonRecord) {
  const names = new Set<string>();
  const firstName = typeof person.firstname === 'string' ? person.firstname : undefined;
  const lastName = typeof person.lastname === 'string' ? person.lastname : undefined;
  if (firstName && lastName) {
    names.add(`${firstName} ${lastName}`);
  }
  [person.aka1fullname, person.aka2fullname, person.aka3fullname].forEach((aka) => {
    if (typeof aka === 'string' && aka.trim().length > 0) {
      names.add(aka.trim());
    }
  });

  const dobs = new Set<string>();
  [person.dob, person.alt1DOB, person.alt2DOB, person.alt3DOB].forEach((dob) => {
    if (typeof dob === 'string' && dob.trim().length > 0) {
      dobs.add(dob.trim());
    }
  });

  return { names: Array.from(names), dobs: Array.from(dobs), firstName, lastName };
}

function buildCourtFilters(identifiers: ReturnType<typeof collectIdentifiers>): string | undefined {
  const nameFilters: string[] = [];
  if (identifiers.firstName && identifiers.lastName) {
    const first = identifiers.firstName.replace(/"/g, '\\"');
    const last = identifiers.lastName.replace(/"/g, '\\"');
    nameFilters.push(`("First Name":"${first}" AND "Last Name":"${last}")`);
  }
  identifiers.names
    .filter((name) => name !== `${identifiers.firstName ?? ''} ${identifiers.lastName ?? ''}`.trim())
    .forEach((alias) => {
      const sanitized = alias.replace(/"/g, '\\"');
      nameFilters.push(`("Defendant":"${sanitized}")`);
    });

  const dobFilters = identifiers.dobs.map((dob) => `("Date of Birth":"${dob.replace(/"/g, '\\"')}")`);

  if (nameFilters.length === 0) {
    return undefined;
  }
  if (dobFilters.length === 0) {
    return `(${nameFilters.join(' OR ')})`;
  }
  return `(${nameFilters.join(' OR ')}) AND (${dobFilters.join(' OR ')})`;
}

app.post('/api/search/person', async (req, res) => {
  try {
    const filters = searchSchema.parse(req.body ?? {});
    const filterExpression = buildFilterExpression(filters);
    const query = [filters.firstname, filters.lastname, filters.city].filter(Boolean).join(' ');

    const searchResponse = await personIndex.search<AlgoliaPersonRecord>(query, {
      hitsPerPage: 50,
      filters: filterExpression,
    });

    res.json({
      results: searchResponse.hits,
      total: searchResponse.nbHits,
      page: searchResponse.page,
      totalPages: searchResponse.nbPages,
    });
  } catch (error) {
    console.error('Person search failed', error);
    if (error instanceof z.ZodError) {
      res.status(400).send('Invalid search payload.');
      return;
    }
    res.status(500).send('Unable to complete person search.');
  }
});

app.get('/api/report/:personId', async (req, res) => {
  const { personId } = req.params;
  if (!personId) {
    res.status(400).send('Missing person identifier.');
    return;
  }

  try {
    const person = await personIndex.getObject<AlgoliaPersonRecord>(personId);
    const identifiers = collectIdentifiers(person);
    const courtFilters = buildCourtFilters(identifiers);

    let courtRecords: AlgoliaCourtRecord[] = [];
    if (courtFilters) {
      const courtResponse = await courtIndex.search<AlgoliaCourtRecord>('', {
        filters: courtFilters,
        hitsPerPage: 100,
      });
      courtRecords = courtResponse.hits;
    }

    res.json({
      person,
      courtRecords,
      query: {
        nameFilters: identifiers.names,
        dobFilters: identifiers.dobs,
      },
    });
  } catch (error) {
    console.error('Report generation failed', error);
    res.status(500).send('Unable to generate report for the selected person.');
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Insight API listening on http://localhost:${PORT}`);
});
