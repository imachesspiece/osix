import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

const DISCLAIMER_TEXT = `This service provides data from public records and other sources. The data may not be 100% accurate or complete. This service is not a consumer reporting agency as defined by the Fair Credit Reporting Act (FCRA). You may not use this service for purposes of determining an individual's eligibility for credit, insurance, employment, housing, or any other purpose covered by the FCRA.`;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>Insight</h1>
          <p>
            Conduct precise background and identity investigations by linking personal identifiers with Okaloosa County court
            records. Search, review, and report — all from a single, streamlined workspace.
          </p>
          <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
              Start a new search
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          {children}
          <small className="disclaimer">{DISCLAIMER_TEXT}</small>
        </div>
      </main>
    </div>
  );
}
