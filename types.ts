
// Corresponds to the schema of '32541-zip' index
export interface Person {
  id: string; // Algolia objectID might be different, this 'id' is from schema
  objectID: string; // Algolia's unique ID for the record
  firstname?: string;
  lastname?: string;
  middlename?: string;
  name_suff?: string;
  dob?: string; // Date of Birth
  address?: string;
  city?: string;
  county_name?: string;
  st?: string; // State
  zip?: string;
  phone1?: string;
  aka1fullname?: string;
  aka2fullname?: string;
  aka3fullname?: string;
  StartDat?: string; // Start Date?
  alt1DOB?: string;
  alt2DOB?: string;
  alt3DOB?: string;
  ssn?: string; // Social Security Number (likely partial or masked)
  // Any other fields from the schema can be added here
}

export interface PersonSearchCriteria {
  firstname?: string;
  middlename?: string;
  lastname?: string;
  dob?: string;
  city?: string;
  st?: string;
  zip?: string;
  ssn?: string;
}

// Corresponds to the schema of 'okaloosa' court records index
export interface CourtRecord {
  objectID: string; // Algolia's unique ID
  "Case Number"?: string;
  "Uniform Case Number"?: string;
  "Court Type"?: string;
  "Case Type"?: string;
  "Case Status"?: string;
  "Case Open Date"?: string;
  "Case Close Date"?: string;
  "Reopen Date"?: string;
  "Disposition Date"?: string;
  "Disposition"?: string;
  "Defense Attorney"?: string;
  "Prosecutor"?: string;
  "Judge"?: string;
  "Total Assessed"?: string; // Note: numbers might be strings
  "Total Paid"?: string;
  "Balance"?: string;
  "Defendant Code"?: string;
  "Defendant"?: string; // Full name of defendant
  "OBTS Number"?: string;
  "Race"?: string;
  "Gender"?: string;
  "Date of Birth"?: string; // DOB of defendant in court record
  "Address"?: string;
  "City"?: string;
  "State"?: string;
  "Zip"?: string;
  "Offense Date"?: string;
  "Arrest Date"?: string;
  "Arresting Agency"?: string;
  "Jurisdiction"?: string;
  "Date Charge Filed"?: string;
  "Bond Hearing Date"?: string;
  "Arrest Charge Count"?: string;
  "Arrest Charge"?: string; // Statute number
  "Arrest Statute"?: string; // Description of statute
  "Prosecutor Charge Count"?: string;
  "Prosecutor Charge"?: string;
  "Prosecutor Statute"?: string;
  "Prosecutor Final Action"?: string;
  "Court Charge"?: string;
  "Court Statute"?: string;
  "Court Action"?: string; // e.g., "*Guilty"
  "Citation Number"?: string;
  // Other fields from example JSON can be added
  "First Name"?: string;
  "Middle Name"?: string;
  "Last Name"?: string;
}

// For Algolia's search response structure
export interface AlgoliaSearchResponse<T> {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
  processingTimeMS: number;
}

// Status for API calls
export enum FetchStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
