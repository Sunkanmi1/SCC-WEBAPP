import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



const app = express();
const PORT = process.env.PORT || 9090;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Configure CORS
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// ✅ Health check endpoint (required for deployment)
app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});

// ✅ Root endpoint
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Supreme Court of Ghana Cases API",
        version: "1.0.0",
        description: "API for searching Supreme Court of Ghana cases from Wikidata",
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

// Country-specific configurations
const COUNTRY_CONFIG: Record<string, { courtId: string; countryId: string }> = {
    'GH': { 
        courtId: 'Q1513611',  // Supreme Court of Ghana (parent class)
        countryId: 'Q117'     // Ghana
    },
    'NG': { 
        courtId: 'Q16011598', // Supreme Court of Nigeria
        countryId: 'Q1033'    // Nigeria
    },
    'KE': { 
        courtId: 'Q7653543',  // Supreme Court of Kenya
        countryId: 'Q114'     // Kenya
    },
    'ZA': { 
        courtId: 'Q1360033',  // Constitutional Court of South Africa
        countryId: 'Q258'     // South Africa
    }
};

// ✅ Search endpoint with multi-country support
app.get("/search", async (req: Request, res: Response) => {
    const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";
    const countryCode = (req.query.country as string)?.trim().toUpperCase() || "GH"; // Default to Ghana
    
    // Get the config for the selected country
    const config = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG['GH'];

  const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; SEPARATOR = ", ") AS ?judges) WHERE {
      {
        SELECT DISTINCT * WHERE {
          ?item (wdt:P31/(wdt:P279*)) wd:Q114079647;
            (wdt:P17/(wdt:P279*)) wd:${config.countryId};
            (wdt:P1001/(wdt:P279*)) wd:${config.countryId};
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
                country: countryCode // Add country code to response
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

        res.json({ success: true, results: cases, country: countryCode });
    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ success: false, error: "Please check your internet connection!" });
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
