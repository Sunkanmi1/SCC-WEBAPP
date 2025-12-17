
# Case Data Sources and Licensing

This document provides a detailed explanation of how case data is sourced, processed, validated, served, and licensed within the backend system. It is intended to give **end users, developers, and reviewers** clear visibility into:

* Where the case data originates
* How the backend ingests, processes, validates, and exposes the data
* The legal licensing terms governing reuse of the data

This documentation aligns with the current backend implementation that queries Wikidata via SPARQL and exposes the results through REST API endpoints.

---

## 1. Data Origins

The case data served by this API originates from **Wikidata**, a free, open, and collaboratively maintained structured knowledge base operated by the **Wikimedia Foundation**.

### 1.1 Wikidata as a Source

* Wikidata stores information as a **knowledge graph**, where each concept (such as a legal case, court, judge, or jurisdiction) is represented by a unique **Q-ID** (e.g., `Q123456`).
* Legal cases are modeled using structured properties such as:

  * Case title
  * Court
  * Decision date
  * Judges
  * Citations
  * Related Wikipedia or external articles

Because the data is structured, it can be queried precisely and programmatically.

### 1.2 Access Method

The backend retrieves data from Wikidata using the **Wikidata Query Service (WDQS)**:

* WDQS exposes a public HTTP endpoint
* It accepts **SPARQL** queries
* It returns results in machine-readable formats such as **JSON**

This makes Wikidata suitable for reliable, automated data retrieval in production systems.

---

## 2. Backend Data Handling

The backend is implemented using **Node.js with Express and TypeScript**. It acts as a read‑only data access layer between client applications and Wikidata, enforcing consistent querying, transformation, filtering, and validation logic.

### 2.1 Technology Stack

* **Express.js** – HTTP server and routing
* **TypeScript** – Type safety and clearer API contracts
* **Axios** – HTTP client for Wikidata SPARQL requests
* **dotenv** – Environment variable management
* **CORS middleware** – Controlled cross‑origin access

Environment configuration includes:

* `PORT` – Server port (default: 9090)
* `CORS_ORIGIN` – Allowed frontend origin
* `NODE_ENV` – Runtime environment indicator

---

### 2.2 High‑Level Request Flow

```text
Client (Browser / Frontend App)
        |
        |  HTTP GET (/search or /browse)
        v
Express API Server
        |
        |  Axios HTTP Request
        v
Wikidata SPARQL Endpoint (WDQS)
        |
        |  JSON SPARQL Results
        v
Backend Processing & Filtering
        |
        v
JSON Response to Client
```

---

### 2.3 Data Ingestion (SPARQL)

The backend retrieves case data by dynamically executing **SPARQL queries** against the Wikidata Query Service.

#### Query Characteristics

* Queries explicitly target **Supreme Court of Ghana cases** using Wikidata identifiers and property paths
* Results are capped using `LIMIT 5000` to avoid excessive payloads
* Only English‑language judge labels are included
* Data is grouped using `GROUP_CONCAT` to aggregate judges per case

The SPARQL endpoint used is:

```text
https://query.wikidata.org/sparql
```

Each API request results in a **fresh read‑only query** to Wikidata; no local persistence or mutation of source data occurs.

---

### 2.4 Data Processing & Transformation

Once the SPARQL query executes successfully, Wikidata returns results in structured JSON format.

The backend then:

1. Parses the SPARQL `bindings` array
2. Extracts and normalizes relevant fields
3. Maps Wikidata URIs to simplified application‑friendly values

#### Normalized Case Object

Each record is transformed into the following shape before being returned to clients:

* `caseId` – Extracted from the Wikidata item URL (Q‑ID)
* `title` – Human‑readable case title
* `description` – Short Wikidata description
* `date` – ISO date truncated to `YYYY‑MM‑DD`
* `citation` – Legal citation identifier
* `court` – Court name label
* `judges` – Comma‑separated list of judges
* `majorityOpinion` – Majority opinion label (search endpoint only)
* `sourceLabel` – Source reference label
* `articleUrl` – Direct Wikidata item URL

This transformation layer ensures frontend applications remain completely decoupled from SPARQL semantics.

---

### 2.5 Validation & Filtering

The backend performs lightweight validation and filtering after data retrieval.

#### Validation Rules

* Records missing a case identifier or title are excluded
* Default fallback values are applied for optional or missing fields


#### Filtering Logic

Filtering is handled at two levels:

**Search Endpoint (`/search`)**

* Keyword filtering across:

  * Case title
  * Description
  * Judges
  * Citation
  * Court name
* Filtering occurs in‑memory after retrieval

**Browse Endpoint (`/browse`)**

Optional query parameters:

* `year` – Filters cases by decision year
* `judge` – Filters cases by judge name
* `country` – Filters cases by court text match

These filters are applied safely without modifying the underlying Wikidata data.

---

## 3. API Endpoints & Data Serving

### 3.1 Health & Metadata Endpoints

* `GET /api/health`

  * Confirms server availability
  * Returns uptime, timestamp, and environment

* `GET /`

  * Provides API metadata
  * Lists available endpoints and example usage

These endpoints are intended for monitoring, deployment validation, and developer discovery.

---

### 3.2 Case Data Endpoints

#### `GET /search`

* Returns all cases if no query is provided
* Accepts optional query parameter:

  * `q` – Keyword search string

Search is case‑insensitive and performed across multiple fields.

#### `GET /browse`

* Returns a browsable list of cases
* Supports optional filters:

  * `year`
  * `judge`
  * `country`

---

### 3.3 Response Format

All endpoints return JSON responses with a consistent structure:

```json
{
  "success": true,
  "results": []
}
```

Error responses return:

```json
{
  "success": false,
  "error": "Error message"
}
```

The API is strictly **read‑only** and does not cache, persist, or alter source data.

---

## 4. Licensing and Reuse Rights

### 4.1 Source License (CC0)

All structured data in Wikidata’s main and property namespaces is released under the **Creative Commons Zero (CC0) Public Domain Dedication**.

This means:

* The data is placed in the public domain
* Anyone may use, copy, modify, and redistribute the data
* No permission is required
* No legal attribution is required

The backend does not impose additional licensing restrictions beyond those of the original data source.

Wikidata’s licensing policy states all structured data in its main and property namespaces is available under CC0, effectively placing the data in the public domain.

---

### 4.2 Attribution (Optional but Recommended)

Although CC0 does **not** require attribution, providing attribution is considered a **best practice** for transparency and data provenance.

**Suggested attribution**

> “Case data provided using data from Wikidata (CC0 public domain).”

This helps end users understand where the data originates and reassures them of its open reuse rights.

---

### 4.3 Limitations and Considerations

* Wikidata data is community-maintained and may contain inaccuracies or incomplete records
* Structured data is CC0, but:

  * Linked external articles
  * Long-form text descriptions

may be subject to **separate licenses**

API consumers are responsible for reviewing downstream usage requirements if combining this data with other proprietary or restricted content.

---

## 5. Summary

* **Source:** Wikidata (via SPARQL)
* **License:** CC0 Public Domain Dedication
* **Backend Role:** Query, normalize, validate, and serve data
* **Reuse:** Unrestricted, with optional attribution for clarity

This architecture ensures legal safety, transparency, and long-term maintainability for applications built on top of the case data API.

