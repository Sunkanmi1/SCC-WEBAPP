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
            search_all_cases: "GET",
            search_with_query: "GET?q={query}",
            examples: [
                "http://localhost:9090",
                "http://localhost:9090?q=human+rights",
                "http://localhost:9090?q=constitution"
            ]
        },
        documentation: "Use endpoint to get case data"
    });
});

// ✅ Search endpoint returning JSON
app.get("/search", async (req: Request, res: Response) => {
    const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";

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
                articleUrl: item.item?.value || ""
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

        res.json({ success: true, results: cases });
    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ success: false, error: "Please check your internet connection!" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
