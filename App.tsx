
import React, { useState, useEffect, useCallback } from 'react';
import SearchForm from './components/SearchForm';
import PersonCard from './components/PersonCard';
import DetailReportView from './components/DetailReportView';
import LoadingSpinner from './components/ui/LoadingSpinner';
import AlertMessage from './components/ui/AlertMessage';
import { searchPersons, searchCourtRecords } from './services/algoliaService';
import { generateBackgroundSummary } from './services/geminiService';
import type { Person, CourtRecord } from './types';
import { FetchStatus } from './types';

const App: React.FC = () => {
  const [personSearchQuery, setPersonSearchQuery] = useState<string>('');
  const [personResults, setPersonResults] = useState<Person[]>([]);
  const [personSearchStatus, setPersonSearchStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [personSearchError, setPersonSearchError] = useState<string | null>(null);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  
  const [courtRecords, setCourtRecords] = useState<CourtRecord[]>([]);
  const [courtRecordsStatus, setCourtRecordsStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [courtRecordsError, setCourtRecordsError] = useState<string | null>(null);

  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [geminiStatus, setGeminiStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  const handlePersonSearch = useCallback(async (query: string) => {
    setPersonSearchQuery(query);
    setPersonSearchStatus(FetchStatus.LOADING);
    setPersonSearchError(null);
    setSelectedPerson(null); // Clear previous selection
    setCourtRecords([]);
    setGeminiSummary(null);
    setCourtRecordsStatus(FetchStatus.IDLE);
    setGeminiStatus(FetchStatus.IDLE);

    try {
      const results = await searchPersons(query);
      setPersonResults(results);
      setPersonSearchStatus(FetchStatus.SUCCESS);
      if (results.length === 0) {
         setPersonSearchError("No persons found matching your query.");
      }
    } catch (error) {
      console.error('Person search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during person search.';
      setPersonSearchError(errorMessage);
      setPersonSearchStatus(FetchStatus.ERROR);
      setPersonResults([]);
    }
  }, []);

  const handleSelectPerson = useCallback((person: Person) => {
    if (selectedPerson?.objectID === person.objectID) {
      // If already selected, deselect (optional behavior)
      // setSelectedPerson(null);
      // setCourtRecords([]);
      // setGeminiSummary(null);
      return; // Or do nothing if re-clicking doesn't change state
    }
    setSelectedPerson(person);
    setCourtRecordsStatus(FetchStatus.IDLE);
    setGeminiStatus(FetchStatus.IDLE);
    setCourtRecords([]); // Clear previous records
    setGeminiSummary(null); // Clear previous summary
  }, [selectedPerson]);

  // Effect to fetch court records when a person is selected
  useEffect(() => {
    if (!selectedPerson) {
      setCourtRecordsStatus(FetchStatus.IDLE);
      return;
    }

    const fetchCourtData = async () => {
      setCourtRecordsStatus(FetchStatus.LOADING);
      setCourtRecordsError(null);
      try {
        if (selectedPerson.firstname && selectedPerson.lastname) {
          const records = await searchCourtRecords(selectedPerson.firstname, selectedPerson.lastname, selectedPerson.dob);
          setCourtRecords(records);
          setCourtRecordsStatus(FetchStatus.SUCCESS);
        } else {
          throw new Error("Selected person is missing first or last name, cannot search court records.");
        }
      } catch (error) {
        console.error('Court records search error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching court records.';
        setCourtRecordsError(errorMessage);
        setCourtRecordsStatus(FetchStatus.ERROR);
        setCourtRecords([]);
      }
    };

    fetchCourtData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPerson]); // Runs when selectedPerson changes

  // Effect to generate Gemini summary when person and court records are available
  useEffect(() => {
    if (!selectedPerson || courtRecordsStatus !== FetchStatus.SUCCESS) {
      setGeminiStatus(FetchStatus.IDLE);
      return;
    }

    const generateSummary = async () => {
      setGeminiStatus(FetchStatus.LOADING);
      setGeminiError(null);
      try {
        const summary = await generateBackgroundSummary(selectedPerson, courtRecords);
        setGeminiSummary(summary);
        setGeminiStatus(FetchStatus.SUCCESS);
      } catch (error) {
        console.error('Gemini summary generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while generating summary.';
        setGeminiError(errorMessage);
        setGeminiStatus(FetchStatus.ERROR);
        setGeminiSummary(null);
      }
    };
    
    generateSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPerson, courtRecords, courtRecordsStatus]); // Runs when selectedPerson, courtRecords, or courtRecordsStatus change

  return (
    <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          Person Intel Nexus
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Identify persons of interest and build comprehensive background reports.
        </p>
      </header>

      <main className="space-y-8">
        <SearchForm onSearch={handlePersonSearch} isLoading={personSearchStatus === FetchStatus.LOADING} />

        {personSearchStatus === FetchStatus.LOADING && personResults.length === 0 && (
          <div className="flex justify-center mt-8">
            <LoadingSpinner text="Searching persons..." size="lg" />
          </div>
        )}
        
        {personSearchStatus === FetchStatus.ERROR && personSearchError && (
           <AlertMessage message={personSearchError} type="error" className="mt-6" />
        )}

        {personSearchStatus === FetchStatus.SUCCESS && personResults.length === 0 && personSearchError && (
            <AlertMessage message={personSearchError} type="info" className="mt-6" />
        )}


        {personResults.length > 0 && (
          <section className="bg-slate-800/70 backdrop-blur-sm shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">Search Results ({personResults.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-1">
              {personResults.map((person) => (
                <PersonCard
                  key={person.objectID}
                  person={person}
                  onSelectPerson={handleSelectPerson}
                  isSelected={selectedPerson?.objectID === person.objectID}
                />
              ))}
            </div>
          </section>
        )}

        <DetailReportView
          selectedPerson={selectedPerson}
          courtRecords={courtRecords}
          geminiSummary={geminiSummary}
          courtRecordsStatus={courtRecordsStatus}
          geminiStatus={geminiStatus}
          courtRecordsError={courtRecordsError}
          geminiError={geminiError}
        />
      </main>
      <footer className="text-center py-8 mt-12 border-t border-slate-700">
        <p className="text-sm text-slate-500">Person Intel Nexus &copy; {new Date().getFullYear()}. For illustrative purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
