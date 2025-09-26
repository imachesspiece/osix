import { algoliasearch, SearchIndex } from 'algoliasearch';
import {
  ALGOLIA_PERSON_SEARCH_APP_ID,
  ALGOLIA_PERSON_SEARCH_API_KEY,
  ALGOLIA_PERSON_SEARCH_INDEX_NAME,
  ALGOLIA_COURT_RECORDS_APP_ID,
  ALGOLIA_COURT_RECORDS_API_KEY,
  ALGOLIA_COURT_RECORDS_INDEX_NAME,
  MAX_COURT_RECORDS_DISPLAY,
} from '../constants';
import type { CourtRecord, Person, PersonSearchCriteria } from '../types';

const ensureCredentials = (appId?: string, apiKey?: string, indexName?: string) => {
  if (!appId || !apiKey || !indexName) {
    throw new Error('Algolia credentials are not configured correctly.');
  }
};

let personIndex: SearchIndex | null = null;
let courtIndex: SearchIndex | null = null;

const getPersonIndex = () => {
  if (!personIndex) {
    ensureCredentials(ALGOLIA_PERSON_SEARCH_APP_ID, ALGOLIA_PERSON_SEARCH_API_KEY, ALGOLIA_PERSON_SEARCH_INDEX_NAME);
    const client = algoliasearch(ALGOLIA_PERSON_SEARCH_APP_ID, ALGOLIA_PERSON_SEARCH_API_KEY);
    personIndex = client.initIndex(ALGOLIA_PERSON_SEARCH_INDEX_NAME);
  }
  return personIndex;
};

const getCourtIndex = () => {
  if (!courtIndex) {
    ensureCredentials(ALGOLIA_COURT_RECORDS_APP_ID, ALGOLIA_COURT_RECORDS_API_KEY, ALGOLIA_COURT_RECORDS_INDEX_NAME);
    const client = algoliasearch(ALGOLIA_COURT_RECORDS_APP_ID, ALGOLIA_COURT_RECORDS_API_KEY);
    courtIndex = client.initIndex(ALGOLIA_COURT_RECORDS_INDEX_NAME);
  }
  return courtIndex;
};

const normalize = (value?: string | null) => value?.toLowerCase().trim() ?? '';

const matchesCriteria = (person: Person, criteria: PersonSearchCriteria) => {
  const entries = Object.entries(criteria) as [keyof PersonSearchCriteria, string][];
  return entries.every(([key, value]) => {
    if (!value) {
      return true;
    }

    const normalizedValue = normalize(value);
    const personValue = normalize(person[key as keyof Person]);
    if (!personValue) {
      return false;
    }

    if (key === 'ssn') {
      return personValue.replace(/[^0-9]/g, '') === normalizedValue.replace(/[^0-9]/g, '');
    }

    return personValue.includes(normalizedValue);
  });
};

const buildPersonQuery = (criteria: PersonSearchCriteria) => {
  const queryParts: string[] = [];

  if (criteria.firstname || criteria.lastname) {
    queryParts.push([criteria.firstname, criteria.lastname].filter(Boolean).join(' '));
  }

  if (criteria.city) {
    queryParts.push(criteria.city);
  }

  if (criteria.zip) {
    queryParts.push(criteria.zip);
  }

  if (queryParts.length === 0) {
    return criteria.lastname || criteria.firstname || '';
  }

  return queryParts.join(' ');
};

export const searchPersons = async (criteria: PersonSearchCriteria): Promise<Person[]> => {
  if (!criteria.lastname && !criteria.firstname && !criteria.ssn) {
    throw new Error('Provide at least a last name, first name, or SSN to perform a search.');
  }

  const index = getPersonIndex();
  const query = buildPersonQuery(criteria);

  const response = await index.search<Person>(query, {
    hitsPerPage: 100,
  });

  const results = response.hits.filter((person) => matchesCriteria(person, criteria));
  return results;
};

const uniqueValues = (values: (string | undefined)[]) => {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim())))).map((value) =>
    value.trim(),
  );
};

const recordMatchesName = (record: CourtRecord, names: string[]) => {
  const recordFullName = normalize(record['Defendant'] || `${record['First Name'] ?? ''} ${record['Last Name'] ?? ''}`);
  return names.some((name) => recordFullName.includes(normalize(name)));
};

const recordMatchesDob = (record: CourtRecord, dobs: string[]) => {
  if (dobs.length === 0) {
    return true;
  }
  const recordDob = normalize(record['Date of Birth']);
  return dobs.some((dob) => normalize(dob) === recordDob);
};

export const searchCourtRecords = async (person: Person): Promise<CourtRecord[]> => {
  const index = getCourtIndex();

  const names = uniqueValues([
    [person.firstname, person.lastname].filter(Boolean).join(' '),
    person.aka1fullname,
    person.aka2fullname,
    person.aka3fullname,
  ]);

  const dobs = uniqueValues([person.dob, person.alt1DOB, person.alt2DOB, person.alt3DOB]);

  if (names.length === 0) {
    throw new Error('The selected person does not have any names to search court records with.');
  }

  const queries = names.map((name) => ({
    indexName: ALGOLIA_COURT_RECORDS_INDEX_NAME,
    query: name,
    params: {
      hitsPerPage: 50,
    },
  }));

  const response = await index.multipleQueries<CourtRecord>(queries);

  const combinedHits = response.results
    .flatMap((result) => result.hits ?? [])
    .reduce<Map<string, CourtRecord>>((acc, record) => {
      acc.set(record.objectID, record);
      return acc;
    }, new Map());

  const filtered = Array.from(combinedHits.values()).filter((record) => {
    return recordMatchesName(record, names) && recordMatchesDob(record, dobs);
  });

  return filtered.slice(0, MAX_COURT_RECORDS_DISPLAY * 2);
};
