import { FormEvent, useMemo, useState } from 'react';
import type { PersonSearchCriteria } from '../types';

interface SearchPageProps {
  onSearch: (criteria: PersonSearchCriteria) => Promise<void>;
  isSearching: boolean;
  error: string | null;
  lastCriteria: PersonSearchCriteria | null;
}

const INITIAL_CRITERIA: PersonSearchCriteria = {
  firstname: '',
  lastname: '',
  middlename: '',
  dob: '',
  city: '',
  st: '',
  zip: '',
  ssn: '',
};

export default function SearchPage({ onSearch, isSearching, error, lastCriteria }: SearchPageProps) {
  const [criteria, setCriteria] = useState<PersonSearchCriteria>(() => ({ ...INITIAL_CRITERIA, ...lastCriteria }));
  const [validationError, setValidationError] = useState<string | null>(null);

  const canSubmit = useMemo(() => Object.values(criteria).some((value) => value && value.trim().length > 0), [criteria]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setValidationError('Please enter at least one search field to begin a lookup.');
      return;
    }

    setValidationError(null);
    await onSearch(criteria);
  };

  const handleClear = () => {
    setCriteria({ ...INITIAL_CRITERIA });
    setValidationError(null);
  };

  const handleChange = (field: keyof PersonSearchCriteria) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setCriteria((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="card">
      <div className="section-title">
        <h2>Step 1: Search</h2>
        <span>Search the 32541-zip identity index</span>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Primary Identifiers</legend>
          <div className="form-grid">
            <div>
              <label htmlFor="firstname">First Name</label>
              <input id="firstname" value={criteria.firstname ?? ''} onChange={handleChange('firstname')} placeholder="Jane" />
            </div>
            <div>
              <label htmlFor="middlename">Middle</label>
              <input id="middlename" value={criteria.middlename ?? ''} onChange={handleChange('middlename')} placeholder="A." />
            </div>
            <div>
              <label htmlFor="lastname">Last Name</label>
              <input id="lastname" value={criteria.lastname ?? ''} onChange={handleChange('lastname')} placeholder="Doe" />
            </div>
            <div>
              <label htmlFor="dob">Date of Birth</label>
              <input id="dob" value={criteria.dob ?? ''} onChange={handleChange('dob')} placeholder="MM/DD/YYYY" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Location &amp; Contact</legend>
          <div className="form-grid">
            <div>
              <label htmlFor="city">City</label>
              <input id="city" value={criteria.city ?? ''} onChange={handleChange('city')} placeholder="Destin" />
            </div>
            <div>
              <label htmlFor="st">State</label>
              <input id="st" value={criteria.st ?? ''} onChange={handleChange('st')} placeholder="FL" maxLength={2} />
            </div>
            <div>
              <label htmlFor="zip">ZIP Code</label>
              <input id="zip" value={criteria.zip ?? ''} onChange={handleChange('zip')} placeholder="32541" />
            </div>
            <div>
              <label htmlFor="ssn">SSN (optional)</label>
              <input id="ssn" value={criteria.ssn ?? ''} onChange={handleChange('ssn')} placeholder="***-**-6789" />
            </div>
          </div>
        </fieldset>

        <div className="actions">
          <button type="button" onClick={handleClear} disabled={isSearching}>
            Clear
          </button>
          <button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {validationError && <div className="alert">{validationError}</div>}
      {error && <div className="alert">{error}</div>}
    </section>
  );
}
