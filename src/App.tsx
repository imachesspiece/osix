import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import ReportPage from './pages/ReportPage';
import { searchPersons } from './services/api';
import type { FetchState, PersonRecord, PersonSearchCriteria } from './types';

function AppRoutes() {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<FetchState>('idle');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PersonRecord[]>([]);
  const [lastCriteria, setLastCriteria] = useState<PersonSearchCriteria | null>(null);

  const performSearch = async (criteria: PersonSearchCriteria) => {
    setSearchState('loading');
    setSearchError(null);
    setLastCriteria(criteria);
    try {
      const response = await searchPersons(criteria);
      setSearchResults(response.results);
      setSearchState('success');
      navigate('/results');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to perform search at this time.';
      setSearchError(message);
      setSearchResults([]);
      setSearchState('error');
    }
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<SearchPage onSearch={performSearch} isSearching={searchState === 'loading'} error={searchError} lastCriteria={lastCriteria} />}
        />
        <Route
          path="/results"
          element={<ResultsPage results={searchResults} isSearching={searchState === 'loading'} error={searchError} />}
        />
        <Route path="/report/:personId" element={<ReportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
