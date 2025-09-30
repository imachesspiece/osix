import type {
  PersonSearchCriteria,
  PersonSearchResponse,
  ReportResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function searchPersons(criteria: PersonSearchCriteria): Promise<PersonSearchResponse> {
  const payload: Record<string, string> = {};
  Object.entries(criteria).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      payload[key] = value.trim();
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/search/person`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<PersonSearchResponse>(response);
}

export async function fetchReport(personId: string): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE_URL}/api/report/${encodeURIComponent(personId)}`);
  return handleResponse<ReportResponse>(response);
}
