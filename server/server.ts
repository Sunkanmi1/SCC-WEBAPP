import express from "express";
import axios from "axios";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Request, Response } from "express"; // ✅ only types


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5174";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const isProd = process.env.NODE_ENV === "production";

// --------------------
// Middleware
// --------------------

const allowedOrigins = [
  CORS_ORIGIN,
  "https://sccghana.toolforge.org",
  "http://sccghana.toolforge.org",
  "https://ghanasupremecases.toolforge.org",
  "http://ghanasupremecases.toolforge.org",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use(
  session({
    name: "search_session",
    secret: "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

// Serve frontend files from the client/dist directory
if (isProd) {
  const clientDistPath = join(__dirname, "../../client/dist");
  app.use(express.static(clientDistPath));
}

// --------------------
// Static docs
// --------------------
const docsPath = join(__dirname, "../docs/html");
app.use(
  "/docs",
  express.static(docsPath, {
    index: "index.html",
    dotfiles: "deny",
    etag: true,
    lastModified: true,
    maxAge: isProd ? "1d" : "0",
    setHeaders: (res: Response, path: string) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-XSS-Protection", "1; mode=block");
    },
  })
);

// --------------------
// Country config
// --------------------
const COUNTRY_CONFIG: Record<string, { courtId: string; countryId: string }> = {
  ghana: { courtId: "Q1513611", countryId: "Q117" },
  nigeria: { courtId: "Q16011598", countryId: "Q1033" },
  kenya: { courtId: "Q7653543", countryId: "Q114" },
  south_africa: { courtId: "Q1360033", countryId: "Q258" },
};

// --------------------
// Health check
// --------------------
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// --------------------
// Root
// --------------------
app.get("/", (_req, res) => {
  res.json({
    message: "Supreme Court Cases API",
    version: "1.0.0",
    endpoints: {
      health: `GET ${BASE_URL}/api/health`,
      search_all_cases: `GET ${BASE_URL}/search`,
      search_with_query: `GET ${BASE_URL}/search?q={query}`,
      translations_all: `GET ${BASE_URL}/api/translations`,
      translations_case: `GET ${BASE_URL}/api/translations/{caseId}`,
    },
  });
});

// --------------------
// Countries
// --------------------
app.get("/api/countries", (_req, res) => {
  const countries = Object.keys(COUNTRY_CONFIG).map((key) => ({
    code: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
    wikidataId: COUNTRY_CONFIG[key].countryId,
  }));
  res.json({ success: true, totalCountries: countries.length, countries });
});

// --------------------
// Search
// --------------------
interface CaseResult {
  caseId: string;
  title: string;
  description: string;
  date: string;
  citation: string;
  court: string;
  majorityOpinion: string;
  sourceLabel: string;
  judges: string;
  articleUrl: string;
  country: string;
}

app.get("/search", async (req: Request, res: Response) => {
  const userQuery = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
  const countryParam = typeof req.query.country === "string" ? req.query.country.trim().toLowerCase() : "ghana";

  const countryConfig = COUNTRY_CONFIG[countryParam];
  if (!countryConfig)
    return res.status(400).json({ success: false, error: `Unsupported country: ${countryParam}` });

  const { countryId, courtId } = countryConfig;

  const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; SEPARATOR = ", ") AS ?judges) WHERE {
  {
    SELECT DISTINCT * WHERE {
      ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
        (wdt:P17/(wdt:P279*)) wd:Q117;
        (wdt:P1001/(wdt:P279*)) wd:Q117;
        (wdt:P793/(wdt:P279*)) wd:Q7099379;
        wdt:P4884 ?court.
      ?court (wdt:P279*) wd:Q1513611.
    }
    LIMIT 5000
  }
  ?item wdt:P577 ?date;
    wdt:P1031 ?legal_citation;
    wdt:P1433 ?source;
    wdt:P1594 _:b3.
  _:b3 rdfs:label ?judge.
  FILTER((LANG(?judge)) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
}
GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel
ORDER BY (?date)
  `;

  try {
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
    const { data } = await axios.get(url, { timeout: 10000 });

    const cases: CaseResult[] = (data as any).results.bindings.map((item: any) => ({
      caseId: item.item?.value.split("/").pop() || "Not Available",
      title: item.itemLabel?.value || "Not Available",
      description: item.itemDescription?.value || "No description available",
      date: item.date?.value?.split("T")[0] || "Date not recorded",
      citation: item.legal_citation?.value || "Citation unavailable",
      court: item.courtLabel?.value || "Court not specified",
      majorityOpinion: item.majority_opinionLabel?.value || "Majority opinion unavailable",
      sourceLabel: item.sourceLabel?.value || "Source unavailable",
      judges: item.judges?.value || "Judges unavailable",
      articleUrl: item.item?.value || "",
      country: countryParam.charAt(0).toUpperCase() + countryParam.slice(1).replace(/_/g, " "),
    })).filter((c: CaseResult) =>
      !userQuery || [c.title, c.description, c.court, c.citation, c.judges].some(f => f.toLowerCase().includes(userQuery))
    );

    res.json({ success: true, results: cases, totalResults: cases.length });
  } catch (error) {
    console.error("❌ Search API Error:", error);
    res.status(500).json({ success: false, error: "Search request failed." });
  }
});

// --------------------
// Translations
// --------------------
app.get("/api/translations", async (req, res) => {
  const countryParam = typeof req.query.country === "string" ? req.query.country.trim().toLowerCase() : "ghana";
  await handleTranslations(undefined, countryParam, res);
});

app.get("/api/translations/:caseId", async (req, res) => {
  const countryParam = typeof req.query.country === "string" ? req.query.country.trim().toLowerCase() : "ghana";
  await handleTranslations(req.params.caseId, countryParam, res);
});

async function handleTranslations(caseId: string | undefined, country: string, res: Response) {
  const countryConfig = COUNTRY_CONFIG[country];
  if (!countryConfig) return res.status(400).json({ success: false, error: `Unsupported country: ${country}` });
  const { countryId, courtId } = countryConfig;

  try {
    const baseQuery = `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; SEPARATOR = ", ") AS ?judges) WHERE {
  {
    SELECT DISTINCT * WHERE {
      ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
        (wdt:P17/(wdt:P279*)) wd:Q117;
        (wdt:P1001/(wdt:P279*)) wd:Q117;
        (wdt:P793/(wdt:P279*)) wd:Q7099379;
        wdt:P4884 ?court.
      ?court (wdt:P279*) wd:Q1513611.
    }
    LIMIT 5000
  }
  ?item wdt:P577 ?date;
    wdt:P1031 ?legal_citation;
    wdt:P1433 ?source;
    wdt:P1594 _:b3.
  _:b3 rdfs:label ?judge.
  FILTER((LANG(?judge)) = "en")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
}
GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel
ORDER BY (?date)
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(baseQuery)}&format=json`;
    const { data } = await axios.get(url, { timeout: 20000 });
    const bindings = (data as any).results.bindings;

    if (caseId && bindings.length === 0) return res.status(404).json({ success: false, error: `Case not found: ${caseId}` });

    const translationsMap = new Map<string, any>();
    bindings.forEach((item: any) => {
      const cId = item.item?.value.split("/").pop() || "Unknown";
      const caseTitle = item.itemLabel?.value || "Unknown Case";
      const langCode = item.language?.value?.split("/").pop() || "en";
      const langLabel = item.languageLabel?.value || "English";

      if (!translationsMap.has(cId)) translationsMap.set(cId, { caseId: cId, caseTitle, availableLanguages: [] });
      const caseData = translationsMap.get(cId);
      if (!caseData.availableLanguages.find((l: any) => l.languageCode === langCode)) {
        caseData.availableLanguages.push({
          languageCode: langCode,
          languageLabel: langLabel,
          wikidataUrl: item.item?.value,
          source: "Wikidata",
        });
      }
    });

    translationsMap.forEach((caseData) => {
      if (caseData.availableLanguages.length === 0) {
        caseData.availableLanguages.push({
          languageCode: "en",
          languageLabel: "English",
          wikidataUrl: `https://www.wikidata.org/entity/${caseData.caseId}`,
          source: "Wikidata (Default)",
        });
      }
    });

    res.json({ success: true, totalCases: translationsMap.size, results: Array.from(translationsMap.values()) });
  } catch (error) {
    console.error("❌ Translation API Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch translation data." });
  }
}

// All other GET requests not handled before will return the React app
if (isProd) {
  const clientDistPath = join(__dirname, "../../client/dist");
  app.get(/.*/, (_req, res) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
