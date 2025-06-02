// Importing required modules
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');

// Initialize Express app and set the port
const app = express();
const PORT = process.env.PORT || 3030;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Log HTTP requests in 'dev' format
app.use(morgan('dev'));

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Search route: renders results.ejs with search results
app.get('/search', async (req, res) => {
    const userQuery = req.query.q?.trim().toLowerCase() || '';
    const caseTypeFilter = req.query.caseType || '';
    const dateFilter = req.query.date || '';

    const sparqlQuery = `
        SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; separator=", ") AS ?judges)
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
            GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel
            ORDER BY ?date
    `;

    try {
        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const response = await axios.get(url, { timeout: 10000 });

        let cases = response.data.results.bindings.map(item => ({
            caseId: item.item?.value.split('/').pop() || 'Not Available',
            title: item.itemLabel?.value || 'Not Available',
            description: item.itemDescription?.value || 'No description available',
            date: item.date?.value ? item.date.value.split('T')[0] : 'Date not recorded',
            citation: item.legal_citation?.value || 'Citation unavailable',
            court: item.courtLabel?.value || 'Court not specified',
            majorityOpinion: item.majority_opinionLabel?.value || 'Majority opinion unavailable',
            sourceLabel: item.sourceLabel?.value || 'Source unavailable',
            judges: item.judges?.value || 'Judges unavailable',
            articleUrl: item.item?.value || ''
        }));

        // Filter results based on user query and optional filters
        cases = cases.filter(caseData =>
            caseData.title.toLowerCase().includes(userQuery) &&
            (caseTypeFilter ? caseData.caseType === caseTypeFilter : true) &&
            (dateFilter ? caseData.date.includes(dateFilter) : true)
        );

        res.render('results', {
            query: req.query.q,
            results: cases,
            error: cases.length === 0 ? `No matches found for "${userQuery}".` : null
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        res.render('results', {
            query: req.query.q,
            results: [],
            error: 'Please check your internet connection !'
        });
    }
});

// API to fetch case details (returns JSON)
app.get('/case/:caseId', async (req, res) => {
    const caseId = req.params.caseId;
    if (!caseId) {
        return res.status(400).json({ success: false, error: "Case ID is required." });
    }

    try {
        const sparqlCaseQuery = `
            SELECT DISTINCT ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel (GROUP_CONCAT(DISTINCT ?judge; separator=", ") AS ?judges)
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
            GROUP BY ?item ?itemLabel ?itemDescription ?date ?legal_citation ?courtLabel ?majority_opinionLabel ?sourceLabel
            ORDER BY ?date
        `;

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlCaseQuery)}&format=json`;
        const response = await axios.get(url, { timeout: 10000 });

        if (!response.data.results.bindings.length) {
            return res.status(404).json({ success: false, error: `No case details found for ID: ${caseId}.` });
        }

        const caseData = response.data.results.bindings[0];
        res.json({
            success: true,
            data: {
                caseId,
                title: caseData.itemLabel?.value || "Not Available",
                description: caseData.itemDescription?.value || "No description available",
                date: caseData.date?.value ? caseData.date.value.split("T")[0] : "Date not recorded",
                citation: caseData.legal_citation?.value || "Citation unavailable",
                court: caseData.courtLabel?.value || "Court not specified",
                majorityOpinion: caseData.majority_opinionLabel?.value || "Majority opinion unavailable",
                sourceLabel: caseData.sourceLabel?.value || "Source unavailable",
                judges: caseData.judges?.value || "Judges unavailable",
                articleUrl: `https://www.wikidata.org/wiki/${caseId}`
            }
        });
    } catch (error) {
        console.error("❌ Error retrieving case details:", error);
        res.status(500).json({ success: false, error: 'Error retrieving data from Wikidata' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
