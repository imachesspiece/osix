import { Link } from 'react-router-dom';
import type { PersonRecord } from '../types';

interface ResultsPageProps {
  results: PersonRecord[];
  isSearching: boolean;
  error: string | null;
}

function maskSSN(ssn?: string): string {
  if (!ssn) return '—';
  const digits = ssn.replace(/[^0-9]/g, '');
  if (digits.length < 4) {
    return '***-**-' + digits.padStart(4, '*');
  }
  return `***-**-${digits.slice(-4)}`;
}

export default function ResultsPage({ results, isSearching, error }: ResultsPageProps) {
  return (
    <section className="card">
      <div className="section-title">
        <h2>Step 2: Select</h2>
        <span>Choose the correct individual</span>
      </div>

      {isSearching && (
        <div className="placeholder-card">
          <span className="loader" style={{ marginBottom: '0.75rem' }} />
          <div>Searching people records…</div>
        </div>
      )}

      {!isSearching && error && <div className="alert">{error}</div>}

      {!isSearching && !error && results.length === 0 && (
        <div className="placeholder-card">No records were returned for the requested filters.</div>
      )}

      {!isSearching && !error && results.length > 0 && (
        <div className="list-grid">
          {results.map((person) => {
            const fullName = [person.firstname, person.middlename, person.lastname, person.name_suff]
              .filter(Boolean)
              .join(' ');
            const primaryAddress = [person.address, person.city, person.st, person.zip].filter(Boolean).join(', ');

            return (
              <article key={person.objectID} className="card" style={{ padding: '1.25rem' }}>
                <header style={{ marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{fullName || 'Name unavailable'}</h3>
                  {person.dob && <div style={{ color: 'rgba(148, 163, 184, 0.8)' }}>DOB: {person.dob}</div>}
                </header>
                <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  <div>
                    <strong>Address:</strong> {primaryAddress || 'Not available'}
                  </div>
                  <div>
                    <strong>SSN:</strong> {maskSSN(person.ssn)}
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <Link
                    to={`/report/${encodeURIComponent(person.objectID)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                      color: '#0f172a',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textDecoration: 'none',
                    }}
                  >
                    View Full Report
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
