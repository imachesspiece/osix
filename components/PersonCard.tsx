import React from 'react';
import type { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onSelectPerson: (person: Person) => void;
  isSelected?: boolean;
}

const maskSSN = (ssn?: string) => {
  if (!ssn) {
    return 'SSN unavailable';
  }

  const digits = ssn.replace(/[^0-9]/g, '');
  if (digits.length < 4) {
    return '***-**-' + digits.padStart(4, '*');
  }

  const lastFour = digits.slice(-4);
  return `***-**-${lastFour}`;
};

const getDisplayName = (person: Person) => {
  return [person.firstname, person.middlename, person.lastname, person.name_suff]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Unnamed Subject';
};

const PersonCard: React.FC<PersonCardProps> = ({ person, onSelectPerson, isSelected = false }) => {
  const displayName = getDisplayName(person);
  const address = [person.address, person.city, person.st, person.zip].filter(Boolean).join(', ');

  return (
    <article
      className={`rounded-xl border ${
        isSelected ? 'border-sky-400 shadow-[0_0_0_2px_rgba(56,189,248,0.4)]' : 'border-slate-700'
      } bg-slate-900/70 p-4 transition-transform hover:-translate-y-1 hover:shadow-2xl`}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{displayName}</h3>
          <p className="text-sm text-slate-400">DOB: {person.dob || 'Unknown'}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
          {person.county_name || 'No County'}
        </span>
      </header>

      <dl className="mt-4 space-y-2 text-sm text-slate-300">
        <div>
          <dt className="font-medium text-slate-400">Most Recent Address</dt>
          <dd>{address || 'Address not on file'}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-400">SSN</dt>
          <dd>{maskSSN(person.ssn)}</dd>
        </div>
        {person.phone1 && (
          <div>
            <dt className="font-medium text-slate-400">Phone</dt>
            <dd>{person.phone1}</dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={() => onSelectPerson(person)}
        className={`mt-4 w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
          isSelected ? 'bg-sky-400 text-slate-900' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
        }`}
      >
        {isSelected ? 'Selected' : 'View Full Report'}
      </button>
    </article>
  );
};

export default PersonCard;
