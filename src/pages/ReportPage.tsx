import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReport } from '../services/api';
import type { CourtRecord, PersonRecord, ReportResponse } from '../types';

interface ReportPageState {
  status: 'idle' | 'loading' | 'error' | 'ready';
  error: string | null;
  person: PersonRecord | null;
  courtRecords: CourtRecord[];
  queryDetails: ReportResponse['query'];
}

const INITIAL_STATE: ReportPageState = {
  status: 'idle',
  error: null,
  person: null,
  courtRecords: [],
  queryDetails: { nameFilters: [], dobFilters: [] },
};

function formatFullName(person: PersonRecord | null): string {
  if (!person) return '';
  return [person.firstname, person.middlename, person.lastname, person.name_suff].filter(Boolean).join(' ');
}

function formatAddress(person: PersonRecord | null): string {
  if (!person) return '';
  return [person.address, person.city, person.st, person.zip].filter(Boolean).join(', ');
}

function uniqueValues(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim().length > 0))));
}

function toDisplayRows(record: CourtRecord): Array<{ key: string; value: string }> {
  return Object.entries(record)
    .filter(([key]) => key !== 'objectID')
    .map(([key, value]) => ({ key, value: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }));
}

export default function ReportPage() {
  const { personId } = useParams<{ personId: string }>();
  const [state, setState] = useState<ReportPageState>(INITIAL_STATE);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) {
      setState((prev) => ({ ...prev, status: 'error', error: 'Missing person identifier in URL.' }));
      return;
    }

    let ignore = false;

    const loadReport = async () => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));
      try {
        const report = await fetchReport(personId);
        if (ignore) return;
        setState({
          status: 'ready',
          error: null,
          person: report.person,
          courtRecords: report.courtRecords,
          queryDetails: report.query,
        });
      } catch (err) {
        if (ignore) return;
        const message = err instanceof Error ? err.message : 'Unable to load report for the selected person.';
        setState({ ...INITIAL_STATE, status: 'error', error: message });
      }
    };

    loadReport();
    return () => {
      ignore = true;
    };
  }, [personId]);

  const aliasList = useMemo(
    () =>
      uniqueValues([
        state.person?.aka1fullname,
        state.person?.aka2fullname,
        state.person?.aka3fullname,
      ]),
    [state.person]
  );

  const dobList = useMemo(
    () =>
      uniqueValues([
        state.person?.dob,
        state.person?.alt1DOB,
        state.person?.alt2DOB,
        state.person?.alt3DOB,
      ]),
    [state.person]
  );

  return (
    <section className="card">
      <div className="section-title">
        <h2>Step 3: Report</h2>
        <span>Linked identity and Okaloosa County records</span>
      </div>

      {state.status === 'loading' && (
        <div className="placeholder-card">
          <span className="loader" style={{ marginBottom: '0.75rem' }} />
          <div>Generating consolidated report…</div>
        </div>
      )}

      {state.status === 'error' && state.error && <div className="alert">{state.error}</div>}

      {state.status === 'ready' && state.person && (
        <div className="report-grid">
          <article className="card" style={{ padding: '1.5rem' }}>
            <header style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '0.05em' }}>{formatFullName(state.person)}</h3>
              <div style={{ color: 'rgba(148, 163, 184, 0.75)' }}>Report generated {new Date().toLocaleString()}</div>
            </header>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <strong>Social Security Number</strong>
                <div>{state.person.ssn || 'Not available'}</div>
              </div>
              <div>
                <strong>Primary Date of Birth</strong>
                <div>{state.person.dob || 'Not available'}</div>
              </div>
              {dobList.length > 1 && (
                <div>
                  <strong>Alternate DOBs</strong>
                  <div>{dobList.filter((dob) => dob !== state.person?.dob).join(', ')}</div>
                </div>
              )}
              {aliasList.length > 0 && (
                <div>
                  <strong>Known Aliases</strong>
                  <div>{aliasList.join(' • ')}</div>
                </div>
              )}
            </div>
          </article>

          <article className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Address &amp; Contact</h3>
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div>
                <strong>Primary Address</strong>
                <div>{formatAddress(state.person) || 'Not available'}</div>
              </div>
              <div>
                <strong>County</strong>
                <div>{state.person.county_name || 'Not available'}</div>
              </div>
              <div>
                <strong>Phone</strong>
                <div>{state.person.phone1 || 'Not available'}</div>
              </div>
            </div>
          </article>

          <article className="card" style={{ gridColumn: '1 / -1', padding: '1.5rem' }}>
            <header className="section-title" style={{ marginBottom: '1.5rem' }}>
              <h2>Okaloosa County Court Records</h2>
              <span>{state.courtRecords.length} matches</span>
            </header>

            {state.courtRecords.length === 0 ? (
              <div className="placeholder-card">No court records found matching the subject's identifiers.</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {state.courtRecords.map((record) => {
                  const caseNumber = (record['Case Number'] as string) ?? 'Unknown case number';
                  const statute =
                    (record['Court Statute'] as string) || (record['Court Charge'] as string) || (record['Arrest Statute'] as string) || 'Statute unavailable';
                  const status = (record['Case Status'] as string) || 'Status unknown';

                  const isExpanded = expandedRecordId === record.objectID;

                  return (
                    <div key={record.objectID} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{caseNumber}</h3>
                          <div style={{ color: 'rgba(148, 163, 184, 0.75)' }}>{statute}</div>
                        </div>
                        <span className="badge">{status}</span>
                      </div>

                      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
                        <div>
                          <strong>Offense Date:</strong> {(record['Offense Date'] as string) || '—'}
                        </div>
                        <div>
                          <strong>Case Open Date:</strong> {(record['Case Open Date'] as string) || '—'}
                        </div>
                        <div>
                          <strong>Disposition:</strong> {(record['Disposition'] as string) || (record['Court Action'] as string) || '—'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedRecordId(isExpanded ? null : (record.objectID as string))}
                        style={{
                          marginTop: '1rem',
                          background: 'rgba(148, 163, 184, 0.2)',
                          color: '#e2e8f0',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {isExpanded ? 'Hide full record' : 'Show full record details'}
                      </button>

                      {isExpanded && (
                        <div style={{ marginTop: '1rem' }} className="table-wrapper">
                          <table className="table">
                            <tbody>
                              {toDisplayRows(record).map((row) => (
                                <tr key={row.key}>
                                  <th style={{ width: '30%' }}>{row.key}</th>
                                  <td>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.75)' }}>
              <div className="status-chip">Query Filters</div>
              <div>Names: {state.queryDetails.nameFilters.join(' • ') || 'None'}</div>
              <div>DOBs: {state.queryDetails.dobFilters.join(' • ') || 'None'}</div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
