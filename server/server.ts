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

// ✅ Root endpoint
app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Supreme Court of Ghana Cases API",
		version: "1.0.0",
		description: "API for searching Supreme Court of Ghana cases from Wikidata",
		documentation: "Complete API documentation available at /docs",
	});
});

// ✅ Search endpoint returning JSON
app.get("/search", async (req: Request, res: Response) => {
	const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";

	if (userQuery) {
		storeSearch(req, userQuery);
	}

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
		const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
			sparqlQuery,
		)}&format=json`;
		const { data } = await axios.get(url, { timeout: 10000 });

		const cases = (data as any).results.bindings
			.map((item: any) => ({
				caseId: item.item?.value.split("/").pop() || "Not Available",
				title: item.itemLabel?.value || "Not Available",
				description: item.itemDescription?.value || "No description available",
				date: item.date?.value?.split("T")[0] || "Date not recorded",
				citation: item.legal_citation?.value || "Citation unavailable",
				court: item.courtLabel?.value || "Court not specified",
				majorityOpinion:
					item.majority_opinionLabel?.value || "Majority opinion unavailable",
				sourceLabel: item.sourceLabel?.value || "Source unavailable",
				judges: item.judges?.value || "Judges unavailable",
				articleUrl: item.item?.value || "",
			}))
			.filter((caseData: any) => {
				if (!userQuery) return true; // Return all if no query

				return (
					caseData.title.toLowerCase().includes(userQuery) ||
					(caseData.description &&
						caseData.description.toLowerCase().includes(userQuery)) ||
					(caseData.judges &&
						caseData.judges.toLowerCase().includes(userQuery)) ||
					(caseData.citation &&
						caseData.citation.toLowerCase().includes(userQuery)) ||
					(caseData.court && caseData.court.toLowerCase().includes(userQuery))
				);
			});

		res.json({ success: true, results: cases });
	} catch (error) {
		console.error("❌ API Error:", error);
		res.status(500).json({
			success: false,
			error: "Please check your internet connection!",
		});
	}
});

// Recent searches endpoint
app.get("/recent-search", (req: Request, res: Response) => {
	return res.json({
		success: true,
		results: req.session.recentSearches || [],
	});
});

// Browse endpoint

interface CourtCase {
	caseId: string;
	title: string;
	description: string;
	date: string;
	citation: string;
	court: string;
	judges: string;
	sourceLabel: string;
	articleUrl: string;
}

app.get("/browse", async (req: Request, res: Response) => {
	const year = req.query.year as string | undefined;
	const judge = req.query.judge as string | undefined;
	const country = req.query.country as string | undefined;

	const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?sourceLabel
           (GROUP_CONCAT(DISTINCT ?judge; SEPARATOR = ", ") AS ?judges)
    WHERE {
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
            wdt:P1594 _:b1.
      _:b1 rdfs:label ?judge.
      FILTER(LANG(?judge) = "en")
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
    }
    GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?sourceLabel
    ORDER BY (?date)
    `;

	try {
		const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
			sparqlQuery,
		)}&format=json`;
		const { data } = await axios.get(url, { timeout: 10000 });

		let cases: CourtCase[] = (data as any).results.bindings.map(
			(item: any): CourtCase => ({
				caseId: item.item?.value.split("/").pop() || "N/A",
				title: item.itemLabel?.value || "N/A",
				description: item.itemDescription?.value || "",
				date: item.date?.value?.split("T")[0] || "",
				citation: item.legal_citation?.value || "",
				court: item.courtLabel?.value || "",
				judges: item.judges?.value || "",
				sourceLabel: item.sourceLabel?.value || "",
				articleUrl: item.item?.value || "",
			}),
		);

		if (year) {
			cases = cases.filter((c) => c.date.startsWith(year));
		}

		if (judge) {
			cases = cases.filter((c) =>
				c.judges.toLowerCase().includes(judge.toLowerCase()),
			);
		}

		if (country) {
			cases = cases.filter((c) =>
				c.court.toLowerCase().includes(country.toLowerCase()),
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

// Start server
app.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});
