import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import morgan from "morgan";
import { join } from "node:path";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Configure CORS
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(
  session({
    name: "search_session",
    secret:
      process.env.SESSION_SECRET ||
      (() => {
        throw new Error("SESSION_SECRET not set in environment variables");
      })(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Static docs path
const docsPath = join(__dirname, "docs", "html");
app.use(
  "/docs",
  express.static(docsPath, {
    index: "index.html",
    dotfiles: "deny",
    etag: true,
    lastModified: true,
    maxAge: process.env.NODE_ENV === "production" ? "1d" : "0",
    setHeaders: (res: Response, path: string) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      if (path.endsWith(".html")) res.setHeader("Content-Type", "text/html; charset=UTF-8");
      else if (path.endsWith(".css")) res.setHeader("Content-Type", "text/css; charset=UTF-8");
      else if (path.endsWith(".js")) res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      else if (path.endsWith(".json")) res.setHeader("Content-Type", "application/json; charset=UTF-8");
    },
  })
);

// COUNTRY MAPPING
const COUNTRY_MAPPING: { [key: string]: string } = {
  ghana: "Q117",
  nigeria: "Q1033",
  kenya: "Q114",
  "south_africa": "Q258",
  uganda: "Q1036",
  tanzania: "Q924",
  botswana: "Q963",
  zambia: "Q953",
  zimbabwe: "Q954",
  malawi: "Q1020",
  rwanda: "Q1037",
  ethiopia: "Q115",
  senegal: "Q1041",
  "ivory_coast": "Q1008",
  burkina_faso: "Q965",
  mali: "Q912",
  niger: "Q1032",
  chad: "Q657",
  cameroon: "Q1009",
  gabon: "Q1000",
  congo: "Q971",
  drc: "Q974",
  "central_african_republic": "Q929",
  sudan: "Q1049",
  "south_sudan": "Q958",
  egypt: "Q79",
  libya: "Q1016",
  tunisia: "Q948",
  algeria: "Q262",
  morocco: "Q1028",
  mauritania: "Q1025",
  gambia: "Q1005",
  "guinea_bissau": "Q1007",
  guinea: "Q1006",
  "sierra_leone": "Q1044",
  liberia: "Q1014",
  togo: "Q945",
  benin: "Q962",
  madagascar: "Q1019",
  mauritius: "Q1027",
  seychelles: "Q1042",
  comoros: "Q970",
  "cape_verde": "Q1011",
  "sao_tome_and_principe": "Q1039",
  "equatorial_guinea": "Q983",
  djibouti: "Q977",
  eritrea: "Q986",
  somalia: "Q1045",
  lesotho: "Q1013",
  swaziland: "Q1050",
  namibia: "Q1030",
  angola: "Q916",
  mozambique: "Q1029",
};

// COUNTRY CONFIG
const COUNTRY_CONFIG: Record<string, { courtId: string; countryId: string }> = {
  ghana: { courtId: "Q1513611", countryId: "Q117" },
  nigeria: { courtId: "Q16011598", countryId: "Q1033" },
  kenya: { courtId: "Q7653543", countryId: "Q114" },
  "south_africa": { courtId: "Q1360033", countryId: "Q258" },
};

// ✅ Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Supreme Court of Ghana Cases API",
    version: "1.0.0",
    description: "API for searching Supreme Court cases from African countries via Wikidata",
    endpoints: {
      health: `GET http://localhost:${PORT}/api/health`,
      search_all_cases: `GET http://localhost:${PORT}/search`,
      search_with_query: `GET http://localhost:${PORT}/search?q={query}`,
      translations: `GET http://localhost:${PORT}/api/translations`,
      case_translations: `GET http://localhost:${PORT}/api/translations/:caseId`,
    },
  });
});

// ✅ Countries endpoint
app.get("/api/countries", (_req, res) => {
  const countries = Object.keys(COUNTRY_MAPPING).map((key) => ({
    code: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
    wikidataId: COUNTRY_MAPPING[key],
  }));

  res.json({
    success: true,
    totalCountries: countries.length,
    countries: countries.sort((a, b) => a.name.localeCompare(b.name)),
  });
});

// ✅ Search endpoint
app.get("/search", async (req: Request, res: Response) => {
  const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";
  const countryParam = ((req.query.country as string)?.trim().toLowerCase() || "ghana") as string;

  const countryEntityId = COUNTRY_MAPPING[countryParam];
  if (!countryEntityId)
    return res.status(400).json({
      success: false,
      error: `Unsupported country: ${countryParam}. Supported countries: ${Object.keys(COUNTRY_MAPPING).join(", ")}`,
    });

  const config = COUNTRY_CONFIG[countryParam] || COUNTRY_CONFIG["ghana"];

  const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; SEPARATOR = ", ") AS ?judges) WHERE {
      {
        SELECT DISTINCT * WHERE {
          ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
                (wdt:P17/(wdt:P279*)) wd:${countryEntityId};
                (wdt:P1001/(wdt:P279*)) wd:${countryEntityId};
                (wdt:P793/(wdt:P279*)) wd:Q7099379;
                wdt:P4884 ?court.
          ?court (wdt:P279*) wd:${config.courtId}.
        } LIMIT 5000
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

    const cases = (data as any).results.bindings
      .map((item: any) => ({
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
      }))
      .filter((c: any) => {
        if (!userQuery) return true;
        return (
          c.title.toLowerCase().includes(userQuery) ||
          (c.description && c.description.toLowerCase().includes(userQuery)) ||
          (c.judges && c.judges.toLowerCase().includes(userQuery)) ||
          (c.citation && c.citation.toLowerCase().includes(userQuery)) ||
          (c.court && c.court.toLowerCase().includes(userQuery))
        );
      });

    res.json({ success: true, results: cases, totalResults: cases.length, country: countryParam });
  } catch (error) {
    console.error("❌ Search API Error:", error);
    res.status(500).json({ success: false, error: "Search request failed. Check your internet connection." });
  }
});
// ✅ Translations endpoint (all cases or specific case)
app.get("/api/translations/:caseId?", async (req: Request, res: Response) => {
  const { caseId } = req.params;

  // Base SPARQL query parts
  const baseQuery = `
    SELECT DISTINCT ?item ?itemLabel ?language ?languageLabel WHERE {
      ${caseId ? `VALUES ?item { wd:${caseId} }` : `
        ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
              (wdt:P17/(wdt:P279*)) wd:Q117;
              (wdt:P1001/(wdt:P279*)) wd:Q117;
              (wdt:P793/(wdt:P279*)) wd:Q7099379;
              wdt:P4884 ?court.
        ?court (wdt:P279*) wd:Q1513611.
      `}
      OPTIONAL { ?item wdt:P407 ?language. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
    }
    ${caseId ? "" : "LIMIT 50"}
  `;

  try {
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(baseQuery)}&format=json`;
    const { data } = await axios.get(url, { timeout: 20000 });

    const bindings = (data as any).results.bindings;
    if (caseId && bindings.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Case not found with ID: ${caseId}`,
      });
    }

    // Map caseId to translations
    const translationsMap = new Map<string, any>();

    bindings.forEach((item: any) => {
      const cId = item.item?.value.split("/").pop() || "Unknown";
      const caseTitle = item.itemLabel?.value || "Unknown Case";
      const langCode = item.language?.value?.split("/").pop() || "en";
      const langLabel = item.languageLabel?.value || "English";

      if (!translationsMap.has(cId)) {
        translationsMap.set(cId, {
          caseId: cId,
          caseTitle,
          availableLanguages: [],
        });
      }

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

    // Ensure every case has at least English
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

    const results = Array.from(translationsMap.values()).sort((a, b) =>
      a.caseTitle.localeCompare(b.caseTitle)
    );

    res.json({
      success: true,
      totalCases: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Translation API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch translation data. Check your internet connection!",
    });
  }
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
