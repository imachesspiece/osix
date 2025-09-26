import React, { useMemo } from 'react';
import type { PersonSearchCriteria } from '../types';

interface SearchFormProps {
  onSearch: (criteria: PersonSearchCriteria) => void;
  isLoading?: boolean;
}

const initialValues: PersonSearchCriteria = {
  firstname: '',
  middlename: '',
  lastname: '',
  dob: '',
  city: '',
  st: '',
  zip: '',
  ssn: '',
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [formValues, setFormValues] = React.useState<PersonSearchCriteria>(initialValues);

  const isEmpty = useMemo(() => {
    return Object.values(formValues).every((value) => !value || value.trim().length === 0);
  }, [formValues]);

  const handleInputChange = (field: keyof PersonSearchCriteria) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValues: PersonSearchCriteria = Object.entries(formValues).reduce((acc, [key, value]) => {
      const trimmedValue = value?.trim();
      if (trimmedValue) {
        acc[key as keyof PersonSearchCriteria] = trimmedValue;
      }
      return acc;
    }, {} as PersonSearchCriteria);

    onSearch(trimmedValues);
  };

  const handleClear = () => {
    setFormValues(initialValues);
  };

  return (
    <section className="bg-slate-900/80 backdrop-blur rounded-xl border border-slate-700/60 shadow-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Identity &amp; Background Search</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Enter the strongest identifiers you have to locate a subject in the person database.
          </p>
        </div>
        <div className="text-xs text-slate-500 italic max-w-xs">
          All fields are optional, but more information will produce a narrower and more precise match.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-slate-300 text-sm font-medium mb-1">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={formValues.firstname}
              onChange={handleInputChange('firstname')}
              placeholder="e.g. John"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="given-name"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="middlename" className="text-slate-300 text-sm font-medium mb-1">
              Middle Name / Initial
            </label>
            <input
              id="middlename"
              name="middlename"
              type="text"
              value={formValues.middlename}
              onChange={handleInputChange('middlename')}
              placeholder="e.g. A or Allen"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-slate-300 text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={formValues.lastname}
              onChange={handleInputChange('lastname')}
              placeholder="e.g. Doe"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoComplete="family-name"
              required={isEmpty}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dob" className="text-slate-300 text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="text"
              inputMode="numeric"
              placeholder="MM/DD/YYYY"
              value={formValues.dob}
              onChange={handleInputChange('dob')}
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="city" className="text-slate-300 text-sm font-medium mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formValues.city}
              onChange={handleInputChange('city')}
              placeholder="e.g. Crestview"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="st" className="text-slate-300 text-sm font-medium mb-1">
              State
            </label>
            <input
              id="st"
              name="st"
              type="text"
              value={formValues.st}
              onChange={handleInputChange('st')}
              placeholder="e.g. FL"
              maxLength={2}
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 uppercase text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="zip" className="text-slate-300 text-sm font-medium mb-1">
              ZIP Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              inputMode="numeric"
              value={formValues.zip}
              onChange={handleInputChange('zip')}
              placeholder="e.g. 32541"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="ssn" className="text-slate-300 text-sm font-medium mb-1">
              SSN (Exact Match)
            </label>
            <input
              id="ssn"
              name="ssn"
              type="text"
              inputMode="numeric"
              value={formValues.ssn}
              onChange={handleInputChange('ssn')}
              placeholder="Optional"
              className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            This service provides data from public records and other sources. The data may not be 100% accurate or complete.
            This service is not a consumer reporting agency as defined by the Fair Credit Reporting Act (FCRA). You may not use
            this service for purposes of determining an individual's eligibility for credit, insurance, employment, housing, or
            any other purpose covered by the FCRA.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading || isEmpty}
              className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold shadow-lg disabled:bg-slate-600 disabled:text-slate-300"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SearchForm;
