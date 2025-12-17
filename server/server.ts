import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { storeSearch } from "./utils";
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
	}),
);
app.use(express.json());
app.use(
	session({
		name: "search_session",
		secret: process.env.SESSION_SECRET
			? process.env.SESSION_SECRET
			: (() => {
					throw new Error("SESSION_SECRET not set in environment variables");
				})(),
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		},
	}),
);

const docsPath = join(__dirname, "docs", "html");

// Static middleware for serving documentation assets
app.use(
	"/docs",
	express.static(docsPath, {
		index: "index.html",
		dotfiles: "deny",
		etag: true,
		lastModified: true,
		maxAge: process.env.NODE_ENV === "production" ? "1d" : "0",
		setHeaders: (res: Response, path: string) => {
			// Security headers for documentation
			res.setHeader("X-Content-Type-Options", "nosniff");
			res.setHeader("X-Frame-Options", "SAMEORIGIN");
			res.setHeader("X-XSS-Protection", "1; mode=block");

			if (path.endsWith(".html")) {
				res.setHeader("Content-Type", "text/html; charset=UTF-8");
			} else if (path.endsWith(".css")) {
				res.setHeader("Content-Type", "text/css; charset=UTF-8");
			} else if (path.endsWith(".js")) {
				res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
			} else if (path.endsWith(".json")) {
				res.setHeader("Content-Type", "application/json; charset=UTF-8");
			}
		},
	}),
);

// ✅ Health check endpoint (required for deployment)
app.get("/api/health", (req: Request, res: Response) => {
	res.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || "development",
	});
});

// ✅ Available countries endpoint
app.get("/api/countries", (req: Request, res: Response) => {
    const countries = Object.keys(COUNTRY_MAPPING).map(key => ({
        code: key,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        wikidataId: COUNTRY_MAPPING[key]
    }));

    res.json({
        success: true,
        totalCountries: countries.length,
        countries: countries.sort((a, b) => a.name.localeCompare(b.name))
    });
});

// ✅ Root endpoint
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Supreme Court of Ghana Cases API",
        version: "1.0.0",
        description: "API for searching Supreme Court cases from African countries via Wikidata",
        endpoints: {
            health: "GET /api/health",
            search_all_cases: "GET /search",
            search_with_query: "GET /search?q={query}",
            translations: "GET /api/translations",
            case_translations: "GET /api/translations/:caseId",
            examples: [
                "http://localhost:9090/api/health",
                "http://localhost:9090/search",
                "http://localhost:9090/search?q=human+rights",
                "http://localhost:9090/api/translations",
                "http://localhost:9090/api/translations/Q123456"
            ]
        },
        documentation: "Use /search endpoint to get case data, /api/translations for available translations"
    });
});

// Country mapping for Wikidata entity IDs
const COUNTRY_MAPPING: { [key: string]: string } = {
    "ghana": "Q117",
    "nigeria": "Q1033",
    "kenya": "Q114",
    "south_africa": "Q258",
    "uganda": "Q1036",
    "tanzania": "Q924",
    "botswana": "Q963",
    "zambia": "Q953",
    "zimbabwe": "Q954",
    "malawi": "Q1020",
    "rwanda": "Q1037",
    "ethiopia": "Q115",
    "senegal": "Q1041",
    "ivory_coast": "Q1008",
    "burkina_faso": "Q965",
    "mali": "Q912",
    "niger": "Q1032",
    "chad": "Q657",
    "cameroon": "Q1009",
    "gabon": "Q1000",
    "congo": "Q971",
    "drc": "Q974", // Democratic Republic of Congo
    "central_african_republic": "Q929",
    "sudan": "Q1049",
    "south_sudan": "Q958",
    "egypt": "Q79",
    "libya": "Q1016",
    "tunisia": "Q948",
    "algeria": "Q262",
    "morocco": "Q1028",
    "mauritania": "Q1025",
    "gambia": "Q1005",
    "guinea_bissau": "Q1007",
    "guinea": "Q1006",
    "sierra_leone": "Q1044",
    "liberia": "Q1014",
    "togo": "Q945",
    "benin": "Q962",
    "madagascar": "Q1019",
    "mauritius": "Q1027",
    "seychelles": "Q1042",
    "comoros": "Q970",
    "cape_verde": "Q1011",
    "sao_tome_and_principe": "Q1039",
    "equatorial_guinea": "Q983",
    "djibouti": "Q977",
    "eritrea": "Q986",
    "somalia": "Q1045",
    "lesotho": "Q1013",
    "swaziland": "Q1050", // Eswatini
    "namibia": "Q1030",
    "angola": "Q916",
    "mozambique": "Q1029"
};

// Country-specific court configurations
const COUNTRY_CONFIG: Record<string, { courtId: string; countryId: string }> = {
    'ghana': { 
        courtId: 'Q1513611',  // Supreme Court of Ghana (parent class)
        countryId: 'Q117'     // Ghana
    },
    'nigeria': { 
        courtId: 'Q16011598', // Supreme Court of Nigeria
        countryId: 'Q1033'    // Nigeria
    },
    'kenya': { 
        courtId: 'Q7653543',  // Supreme Court of Kenya
        countryId: 'Q114'     // Kenya
    },
    'south_africa': { 
        courtId: 'Q1360033',  // Constitutional Court of South Africa
        countryId: 'Q258'     // South Africa
    }
};

// ✅ Search endpoint with multi-country support
app.get("/search", async (req: Request, res: Response) => {
    const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";
    const countryParam = (req.query.country as string)?.trim().toLowerCase() || "ghana";
    
    // Get Wikidata entity ID for the country
    const countryEntityId = COUNTRY_MAPPING[countryParam];
    
    if (!countryEntityId) {
        return res.status(400).json({
            success: false,
            error: `Unsupported country: ${countryParam}. Supported countries: ${Object.keys(COUNTRY_MAPPING).join(", ")}`,
            availableCountries: Object.keys(COUNTRY_MAPPING)
        });
    }
    
    // Get the config for the selected country (fallback to Ghana if not configured)
    const config = COUNTRY_CONFIG[countryParam] || COUNTRY_CONFIG['ghana'];

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
    ORDER BY (?date)`;

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
                country: countryParam.charAt(0).toUpperCase() + countryParam.slice(1).replace(/_/g, ' ')
            }))
            .filter((caseData: any) => {
                if (!userQuery) return true; // Return all if no query
                
                return (
                    caseData.title.toLowerCase().includes(userQuery) ||
                    (caseData.description && caseData.description.toLowerCase().includes(userQuery)) ||
                    (caseData.judges && caseData.judges.toLowerCase().includes(userQuery)) ||
                    (caseData.citation && caseData.citation.toLowerCase().includes(userQuery)) ||
                    (caseData.court && caseData.court.toLowerCase().includes(userQuery))
                );
            });

        res.json({ 
            success: true, 
            results: cases,
            country: countryParam.charAt(0).toUpperCase() + countryParam.slice(1).replace(/_/g, ' '),
            totalResults: cases.length
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ success: false, error: "Please check your internet connection!" });
    }

    if (judge) {
      cases = cases.filter((c) =>
        c.judges.toLowerCase().includes(judge.toLowerCase())
      );
    }

    if (country) {
      cases = cases.filter((c) =>
        c.court.toLowerCase().includes(country.toLowerCase())
      );
    }

    res.json({
      success: true,
      mode: "browse",
      filters: { year, judge, country },
      results: cases,
    });
  } catch (error) {
    console.error("Browse API Error:", error);
    res.status(500).json({ success: false, error: "Browse request failed" });
  }
});

// ✅ Translation availability endpoint - Get all available translations for cases
app.get("/api/translations", async (req: Request, res: Response) => {
    // Simplified query to get cases and their language information
    const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?language ?languageLabel WHERE {
      ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
        (wdt:P17/(wdt:P279*)) wd:Q117;
        (wdt:P1001/(wdt:P279*)) wd:Q117;
        (wdt:P793/(wdt:P279*)) wd:Q7099379;
        wdt:P4884 ?court.
      ?court (wdt:P279*) wd:Q1513611.
      
      # Get language information - either direct language or from translations
      OPTIONAL { ?item wdt:P407 ?language. }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". 
      }
    }
    LIMIT 50`;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const { data } = await axios.get(url, { timeout: 20000 });

        const translationsMap = new Map();

        (data as any).results.bindings.forEach((item: any) => {
            const caseId = item.item?.value.split("/").pop() || "Unknown";
            const caseTitle = item.itemLabel?.value || "Unknown Case";
            const languageCode = item.language?.value?.split("/").pop() || "en";
            const languageLabel = item.languageLabel?.value || "English";

            if (!translationsMap.has(caseId)) {
                translationsMap.set(caseId, {
                    caseId,
                    caseTitle,
                    availableLanguages: []
                });
            }

            const caseData = translationsMap.get(caseId);
            const existingLang = caseData.availableLanguages.find((lang: any) => lang.languageCode === languageCode);
            
            if (!existingLang && languageCode) {
                caseData.availableLanguages.push({
                    languageCode,
                    languageLabel,
                    wikidataUrl: item.item?.value,
                    source: "Wikidata"
                });
            }
        });

        // Add default English for cases without explicit language info
        translationsMap.forEach((caseData) => {
            if (caseData.availableLanguages.length === 0) {
                caseData.availableLanguages.push({
                    languageCode: "en",
                    languageLabel: "English",
                    wikidataUrl: `https://www.wikidata.org/entity/${caseData.caseId}`,
                    source: "Wikidata (Default)"
                });
            }
        });

        const results = Array.from(translationsMap.values())
            .sort((a, b) => a.caseTitle.localeCompare(b.caseTitle));

        res.json({
            success: true,
            totalCases: results.length,
            results
        });

    } catch (error) {
        console.error("❌ Translation API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch translation data. Please check your internet connection!" 
        });
    }
});

// ✅ Get translations for a specific case
app.get("/api/translations/:caseId", async (req: Request, res: Response) => {
    const { caseId } = req.params;
    
    if (!caseId || caseId.trim() === "") {
        return res.status(400).json({
            success: false,
            error: "Case ID is required"
        });
    }

    const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?language ?languageLabel WHERE {
      VALUES ?item { wd:${caseId} }
      
      # Get language information for the specific case
      OPTIONAL { ?item wdt:P407 ?language. }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". 
      }
    }`;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const { data } = await axios.get(url, { timeout: 10000 });

        const bindings = (data as any).results.bindings;
        
        if (bindings.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Case not found with ID: ${caseId}. Please verify the case ID exists in Wikidata.`
            });
        }

        const caseTitle = bindings[0]?.itemLabel?.value || "Unknown Case";
        
        // Extract unique languages
        const languagesSet = new Set();
        const availableLanguages: any[] = [];

        bindings.forEach((item: any) => {
            const languageCode = item.language?.value?.split("/").pop();
            const languageLabel = item.languageLabel?.value;
            
            if (languageCode && !languagesSet.has(languageCode)) {
                languagesSet.add(languageCode);
                availableLanguages.push({
                    languageCode,
                    languageLabel: languageLabel || "Unknown Language",
                    wikidataUrl: `https://www.wikidata.org/entity/${caseId}`,
                    source: "Wikidata"
                });
            }
        });

        // If no languages found, add English as default
        if (availableLanguages.length === 0) {
            availableLanguages.push({
                languageCode: "en",
                languageLabel: "English",
                wikidataUrl: `https://www.wikidata.org/entity/${caseId}`,
                source: "Wikidata (Default)"
            });
        }

        res.json({
            success: true,
            caseId,
            caseTitle,
            totalLanguages: availableLanguages.length,
            availableLanguages
        });

    } catch (error) {
        console.error("❌ Case Translation API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch case translation data. Please check your internet connection!" 
        });
    }
});

// ✅ Translation availability endpoint - Get all available translations for cases
app.get("/api/translations", async (req: Request, res: Response) => {
    // Simplified query to get cases and their language information
    const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?language ?languageLabel WHERE {
      ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
        (wdt:P17/(wdt:P279*)) wd:Q117;
        (wdt:P1001/(wdt:P279*)) wd:Q117;
        (wdt:P793/(wdt:P279*)) wd:Q7099379;
        wdt:P4884 ?court.
      ?court (wdt:P279*) wd:Q1513611.
      
      # Get language information - either direct language or from translations
      OPTIONAL { ?item wdt:P407 ?language. }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". 
      }
    }
    LIMIT 50`;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const { data } = await axios.get(url, { timeout: 20000 });

        const translationsMap = new Map();

        (data as any).results.bindings.forEach((item: any) => {
            const caseId = item.item?.value.split("/").pop() || "Unknown";
            const caseTitle = item.itemLabel?.value || "Unknown Case";
            const languageCode = item.language?.value?.split("/").pop() || "en";
            const languageLabel = item.languageLabel?.value || "English";

            if (!translationsMap.has(caseId)) {
                translationsMap.set(caseId, {
                    caseId,
                    caseTitle,
                    availableLanguages: []
                });
            }

            const caseData = translationsMap.get(caseId);
            const existingLang = caseData.availableLanguages.find((lang: any) => lang.languageCode === languageCode);
            
            if (!existingLang && languageCode) {
                caseData.availableLanguages.push({
                    languageCode,
                    languageLabel,
                    wikidataUrl: item.item?.value,
                    source: "Wikidata"
                });
            }
        });

        // Add default English for cases without explicit language info
        translationsMap.forEach((caseData) => {
            if (caseData.availableLanguages.length === 0) {
                caseData.availableLanguages.push({
                    languageCode: "en",
                    languageLabel: "English",
                    wikidataUrl: `https://www.wikidata.org/entity/${caseData.caseId}`,
                    source: "Wikidata (Default)"
                });
            }
        });

        const results = Array.from(translationsMap.values())
            .sort((a, b) => a.caseTitle.localeCompare(b.caseTitle));

        res.json({
            success: true,
            totalCases: results.length,
            results
        });

    } catch (error) {
        console.error("❌ Translation API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch translation data. Please check your internet connection!" 
        });
    }
});

// ✅ Get translations for a specific case
app.get("/api/translations/:caseId", async (req: Request, res: Response) => {
    const { caseId } = req.params;
    
    if (!caseId || caseId.trim() === "") {
        return res.status(400).json({
            success: false,
            error: "Case ID is required"
        });
    }

    const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?language ?languageLabel WHERE {
      VALUES ?item { wd:${caseId} }
      
      # Get language information for the specific case
      OPTIONAL { ?item wdt:P407 ?language. }
      
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". 
      }
    }`;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const { data } = await axios.get(url, { timeout: 10000 });

        const bindings = (data as any).results.bindings;
        
        if (bindings.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Case not found with ID: ${caseId}. Please verify the case ID exists in Wikidata.`
            });
        }

        const caseTitle = bindings[0]?.itemLabel?.value || "Unknown Case";
        
        // Extract unique languages
        const languagesSet = new Set();
        const availableLanguages: any[] = [];

        bindings.forEach((item: any) => {
            const languageCode = item.language?.value?.split("/").pop();
            const languageLabel = item.languageLabel?.value;
            
            if (languageCode && !languagesSet.has(languageCode)) {
                languagesSet.add(languageCode);
                availableLanguages.push({
                    languageCode,
                    languageLabel: languageLabel || "Unknown Language",
                    wikidataUrl: `https://www.wikidata.org/entity/${caseId}`,
                    source: "Wikidata"
                });
            }
        });

        // If no languages found, add English as default
        if (availableLanguages.length === 0) {
            availableLanguages.push({
                languageCode: "en",
                languageLabel: "English",
                wikidataUrl: `https://www.wikidata.org/entity/${caseId}`,
                source: "Wikidata (Default)"
            });
        }

        res.json({
            success: true,
            caseId,
            caseTitle,
            totalLanguages: availableLanguages.length,
            availableLanguages
        });

    } catch (error) {
        console.error("❌ Case Translation API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch case translation data. Please check your internet connection!" 
        });
    }
});

// Start server
app.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});
