import React from 'react';
import type { CourtRecord, Person } from '../types';
import { FetchStatus } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';
import AlertMessage from './ui/AlertMessage';
import { MAX_COURT_RECORDS_DISPLAY } from '../constants';

interface DetailReportViewProps {
  selectedPerson: Person | null;
  courtRecords: CourtRecord[];
  geminiSummary: string | null;
  courtRecordsStatus: FetchStatus;
  geminiStatus: FetchStatus;
  courtRecordsError: string | null;
  geminiError: string | null;
}

const formatList = (values: (string | undefined)[]) => {
  return values.filter(Boolean).join(', ');
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  return value;
};

const renderCourtRecord = (record: CourtRecord) => {
  const courtStatute = record['Court Statute'] || record['Court Charge'] || 'Unknown Statute';
  const caseNumber = record['Case Number'] || record['Uniform Case Number'] || record.objectID;
  const caseStatus = record['Case Status'] || 'Status Unknown';

  return (
    <details key={record.objectID} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
      <summary className="cursor-pointer text-slate-100 font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>{caseNumber}</span>
        <span className="text-sm text-slate-400">{courtStatute}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">{caseStatus}</span>
      </summary>

      <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
        {Object.entries(record).map(([key, value]) => {
          if (key === 'objectID' || value === undefined || value === null || value === '') {
            return null;
          }
          return (
            <div key={key}>
              <dt className="font-medium text-slate-400">{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          );
        })}
      </dl>
    </details>
  );
};

const DetailReportView: React.FC<DetailReportViewProps> = ({
  selectedPerson,
  courtRecords,
  geminiSummary,
  courtRecordsStatus,
  geminiStatus,
  courtRecordsError,
  geminiError,
}) => {
  if (!selectedPerson) {
    return (
      <section className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 text-slate-400">
        <h2 className="text-xl font-semibold text-slate-200">Awaiting Subject Selection</h2>
        <p className="mt-2 text-sm">
          Choose a subject from the search results to generate a consolidated background report.
        </p>
      </section>
    );
  }

  const akaList = [selectedPerson.aka1fullname, selectedPerson.aka2fullname, selectedPerson.aka3fullname];
  const alternateDobs = [selectedPerson.alt1DOB, selectedPerson.alt2DOB, selectedPerson.alt3DOB];

  return (
    <section className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-6">
      <header className="border-b border-slate-700 pb-4">
        <h2 className="text-3xl font-bold text-slate-100">
          {[selectedPerson.firstname, selectedPerson.lastname].filter(Boolean).join(' ') || 'Subject Report'}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Report generated on {new Date().toLocaleString()}. Matched against Okaloosa County court filings and identity data.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Personal Identifiers</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
              <div>
                <dt className="text-slate-400">Primary Name</dt>
                <dd>{[selectedPerson.firstname, selectedPerson.middlename, selectedPerson.lastname, selectedPerson.name_suff].filter(Boolean).join(' ') || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Social Security Number</dt>
                <dd>{selectedPerson.ssn || 'Not on file'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Date of Birth</dt>
                <dd>{formatDate(selectedPerson.dob)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Alternate DOBs</dt>
                <dd>{alternateDobs.filter(Boolean).length > 0 ? formatList(alternateDobs) : '—'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-400">Known Aliases</dt>
                <dd>{formatList(akaList) || 'No known aliases'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Address &amp; Contact History</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
              <div>
                <dt className="text-slate-400">Primary Address</dt>
                <dd>
                  {[selectedPerson.address, selectedPerson.city, selectedPerson.st, selectedPerson.zip].filter(Boolean).join(', ') ||
                    'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">County</dt>
                <dd>{selectedPerson.county_name || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone Number</dt>
                <dd>{selectedPerson.phone1 || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <aside className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Investigative Summary</h3>
            {geminiStatus === FetchStatus.LOADING && <LoadingSpinner text="Generating insights…" />}
            {geminiStatus === FetchStatus.ERROR && geminiError && <AlertMessage message={geminiError} type="error" />}
            {geminiStatus === FetchStatus.SUCCESS && geminiSummary && (
              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{geminiSummary}</p>
            )}
            {geminiStatus === FetchStatus.IDLE && (
              <p className="text-sm text-slate-400">
                Select a record to produce a concise narrative connecting identifying information with public filings.
              </p>
            )}
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-800 pt-3">
            AI-generated content should be independently verified before being relied upon for investigative decisions.
          </div>
        </aside>
      </section>

      <section className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Okaloosa County Court Records</h3>
            <p className="text-sm text-slate-400">
              Cross-referenced using provided identifiers. Showing up to {MAX_COURT_RECORDS_DISPLAY} of the closest matches.
            </p>
          </div>
        </header>

        {courtRecordsStatus === FetchStatus.LOADING && <LoadingSpinner text="Linking court filings…" />}
        {courtRecordsStatus === FetchStatus.ERROR && courtRecordsError && (
          <AlertMessage message={courtRecordsError} type="error" />
        )}
        {courtRecordsStatus === FetchStatus.SUCCESS && courtRecords.length === 0 && (
          <AlertMessage message="No court records found matching the subject's identifiers." type="info" />
        )}
        {courtRecordsStatus === FetchStatus.SUCCESS && courtRecords.length > 0 && (
          <div className="space-y-4">
            {courtRecords.slice(0, MAX_COURT_RECORDS_DISPLAY).map(renderCourtRecord)}
          </div>
        )}
      </section>
    </section>
  );
};

export default DetailReportView;
