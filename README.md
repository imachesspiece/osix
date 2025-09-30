# Insight – Identity & Background Investigation App

Insight is a three-step investigative workspace for connecting personal identifying information with Okaloosa County court
records. The project ships with a secure Express backend that proxies Algolia lookups and a Vite + React frontend that provides
an intuitive Search → Select → Report experience.

## Features

- **Secure Algolia orchestration** – backend-only API keys with rate limiting and validation.
- **Person search** – submit structured filters to the `32541-zip` index.
- **Linked court report** – automatically query the `okaloosa` court index using primary identifiers and aliases.
- **Single pane of glass** – consolidated report containing PII, address history, and expandable court case summaries.
- **Compliance reminder** – prominent Fair Credit Reporting Act disclaimer throughout the UI.

## Project Structure

```
.
├── server/            # Express server with Algolia orchestration
├── src/               # React application source
├── index.html         # Vite entry point
├── package.json
└── tsconfig.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the required Algolia credentials (the values below are the provided sample keys):

```
ALGOLIA_PERSON_APP_ID=OAMXW5KOPI
ALGOLIA_PERSON_API_KEY=54413b61fd201dd0e5217729b8e877a1
ALGOLIA_PERSON_INDEX=32541-zip
ALGOLIA_COURT_APP_ID=XETRL5GWC2
ALGOLIA_COURT_API_KEY=e641aeb79347262ebaa5fa2e743843e2
ALGOLIA_COURT_INDEX=okaloosa
PORT=4000
```

These keys remain on the server – they are **never** exposed to the browser bundle.

### 3. Run the backend

```bash
npm run server
```

The API will start on `http://localhost:4000` by default. You can customise CORS with the optional `CLIENT_ORIGIN`
variable.

### 4. Run the frontend

Open a second terminal and start Vite:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. The frontend expects the backend to be running locally and will
proxy requests to `/api/*`.

> **Tip:** When deploying the frontend separately from the API, set `VITE_API_BASE_URL` in an environment file so requests are
> directed to the hosted backend.

## API Endpoints

### `POST /api/search/person`

Searches the person index using all provided filters as a conjunction. Returns a paged list of candidate identities.

### `GET /api/report/:personId`

Retrieves a full subject report by fetching the selected person’s record and querying the court index with all known names and
dates of birth.

## Future Enhancements

- Export a report to PDF.
- Persist user sessions and search history.
- Add data visualisations (address timeline, case chronology).
- Plug in additional data sources via the backend orchestration layer.
