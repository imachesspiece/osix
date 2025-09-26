import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_MODEL_TEXT } from '../constants';
import type { CourtRecord, Person } from '../types';

let client: GoogleGenAI | null = null;

const getApiKey = () => {
  return (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || (import.meta.env.GEMINI_API_KEY as string | undefined);
};

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in your environment.');
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

const formatPersonForPrompt = (person: Person) => {
  const aliases = [person.aka1fullname, person.aka2fullname, person.aka3fullname].filter(Boolean);
  const alternateDobs = [person.alt1DOB, person.alt2DOB, person.alt3DOB].filter(Boolean);

  return `Primary name: ${[person.firstname, person.middlename, person.lastname, person.name_suff]
    .filter(Boolean)
    .join(' ')}\nDOB: ${person.dob ?? 'Unknown'}\nAlternate DOBs: ${alternateDobs.join(', ') || 'None'}\nAliases: ${aliases.join(
    ', ',
  ) || 'None'}\nAddress: ${[person.address, person.city, person.st, person.zip].filter(Boolean).join(', ') || 'Unknown'}\nCounty: ${
    person.county_name ?? 'Unknown'
  }\nPhone: ${person.phone1 ?? 'Unknown'}\nSSN: ${person.ssn ?? 'Unknown'}`;
};

const formatCourtRecordsForPrompt = (records: CourtRecord[]) => {
  if (records.length === 0) {
    return 'No court records were matched.';
  }

  return records
    .map((record, index) => {
      return `Record ${index + 1}: Case Number ${record['Case Number'] ?? record['Uniform Case Number'] ?? record.objectID}; ` +
        `Status: ${record['Case Status'] ?? 'Unknown'}; Offense Date: ${record['Offense Date'] ?? 'Unknown'}; ` +
        `Court Statute: ${record['Court Statute'] ?? record['Court Charge'] ?? 'Unknown'}; Disposition: ${
          record['Disposition'] ?? record['Court Action'] ?? 'Unknown'
        }.`;
    })
    .join('\n');
};

export const generateBackgroundSummary = async (person: Person, courtRecords: CourtRecord[]): Promise<string> => {
  const generativeClient = getClient();
  const model = generativeClient.getGenerativeModel({ model: GEMINI_API_MODEL_TEXT });

  const prompt = `You are an investigative analyst writing a concise background narrative. Use only the provided data.\n\n` +
    `Subject Details:\n${formatPersonForPrompt(person)}\n\n` +
    `Matched Court Records:\n${formatCourtRecordsForPrompt(courtRecords)}\n\n` +
    `Create 2-3 short paragraphs describing key identity attributes, any risk indicators, and notable legal history. ` +
    `Highlight data linkages between identifiers and the court filings.`;

  const response = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  const text = response.response.text();
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text.trim();
};
