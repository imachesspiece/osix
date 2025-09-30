export interface PersonSearchCriteria {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  dob?: string;
  city?: string;
  st?: string;
  zip?: string;
  ssn?: string;
}

export interface PersonRecord {
  objectID: string;
  id?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  name_suff?: string;
  dob?: string;
  alt1DOB?: string;
  alt2DOB?: string;
  alt3DOB?: string;
  ssn?: string;
  address?: string;
  city?: string;
  st?: string;
  zip?: string;
  county_name?: string;
  phone1?: string;
  aka1fullname?: string;
  aka2fullname?: string;
  aka3fullname?: string;
  [key: string]: unknown;
}

export interface CourtRecord {
  objectID: string;
  [key: string]: unknown;
}

export interface PersonSearchResponse {
  results: PersonRecord[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReportResponse {
  person: PersonRecord;
  courtRecords: CourtRecord[];
  query: {
    nameFilters: string[];
    dobFilters: string[];
  };
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
