// server.ts
import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());

// ✅ Search endpoint returning JSON
app.get("/search", async (req: Request, res: Response) => {
    const userQuery = (req.query.q as string)?.trim().toLowerCase() || "";

    const sparqlQuery = `
    SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel 
      ?majority_opinionLabel ?sourceLabel 
      (GROUP_CONCAT(DISTINCT ?judge; separator=", ") AS ?judges)
    WHERE {
      {
        SELECT DISTINCT * WHERE {
          ?item (wdt:P31/(wdt:P279*)) wd:Q114079647.
          ?item (wdt:P17/(wdt:P279*)) wd:Q117.
          ?item (wdt:P1001/(wdt:P279*)) wd:Q117.
          ?item (wdt:P793/(wdt:P279*)) wd:Q7099379.
          ?item wdt:P4884 ?court.
          ?court wdt:P279* wd:Q1513611.
        }
        LIMIT 1000
      }
      ?item wdt:P577 ?date.
      ?item wdt:P1031 ?legal_citation.
      ?item wdt:P5826 ?majority_opinion.
      ?item wdt:P1433 ?source.
      ?item wdt:P1594 [rdfs:label ?judge].
      FILTER(LANG(?judge)="en")
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
    }
    GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation 
             ?courtLabel ?majority_opinionLabel ?sourceLabel
    ORDER BY ?date
  `;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const { data } = await axios.get(url, { timeout: 10000 });

        const cases = data.results.bindings
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
            .filter((caseData: any) => caseData.title.toLowerCase().includes(userQuery));

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