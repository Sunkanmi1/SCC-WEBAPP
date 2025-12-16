/**
 * @apiDefine StandardResponse
 * @apiSuccess {Boolean} success Indicates successful request processing (always true for 200 responses)
 * @apiError {Boolean} success Indicates failed request processing (always false for error responses)
 * @apiError {String} error Human-readable error description
 */

/**
 * @apiDefine CourtCase
 * @apiSuccess {String} caseId Unique Wikidata entity identifier (e.g., "Q12345678")
 * @apiSuccess {String} title Full case name/title
 * @apiSuccess {String} description Case description or summary
 * @apiSuccess {String} date Case decision date in ISO format (YYYY-MM-DD)
 * @apiSuccess {String} citation Official legal citation
 * @apiSuccess {String} court Court that decided the case
 * @apiSuccess {String} majorityOpinion Judge who authored the majority opinion
 * @apiSuccess {String} sourceLabel Publication source for the case
 * @apiSuccess {String} judges Comma-separated list of judges on the case
 * @apiSuccess {String} articleUrl Direct link to Wikidata entity
 */

/**
 * @apiDefine CommonErrors
 * @apiError (500 Internal Server Error) NetworkError Unable to connect to external services
 * @apiError (500 Internal Server Error) TimeoutError Request exceeded 10-second timeout limit
 * @apiError (500 Internal Server Error) ExternalAPIError Wikidata SPARQL service unavailable
 * @apiError (500 Internal Server Error) ConfigurationError Missing required environment variables
 */

/**
 * @apiDefine SearchFilters
 * Search is performed against the following fields:
 * - Case title (case-insensitive partial matching)
 * - Case description (full-text search)
 * - Judge names (partial matching)
 * - Legal citation (partial matching)
 * - Court name (partial matching)
 */

/**
 * @apiDefine ResponseTimeNote
 * @apiNote Response times may vary based on external API availability (Wikidata SPARQL endpoint)
 * @apiNote Maximum timeout is 10 seconds per request
 */

/**
 * @api {get} /api/health Health Check
 * @apiName GetHealth
 * @apiGroup System
 * @apiVersion 1.0.0
 * @apiDescription Returns comprehensive server health status and operational metrics.
 * This endpoint is essential for monitoring, deployment verification, and health checks
 * in production environments. It provides real-time server statistics without requiring authentication.
 *
 * @apiPermission none
 * @apiPrivate false
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET "http://localhost:9090/api/health"
 *
 * @apiExample {javascript} JavaScript/Fetch Example:
 *     fetch('http://localhost:9090/api/health')
 *       .then(response => response.json())
 *       .then(data => console.log(data));
 *
 *
 * @apiSuccess {String} status Server health status (always "healthy" for 200 responses)
 * @apiSuccess {String} timestamp Current ISO 8601 timestamp when request was processed
 * @apiSuccess {Number} uptime Server uptime in seconds since last restart
 * @apiSuccess {String} environment Current runtime environment (development/production)
 *
 * @apiSuccessExample {json} Healthy Server Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "status": "healthy",
 *       "timestamp": "2024-01-15T10:30:00.000Z",
 *       "uptime": 3600.5,
 *       "environment": "development"
 *     }
 *
 * @apiUse CommonErrors
 * @apiUse StandardResponse
 * @apiSampleRequest /api/health
 */

/**
 * @api {get} / API Information
 * @apiName GetRoot
 * @apiGroup System
 * @apiVersion 1.0.0
 * @apiDescription Provides comprehensive API information including available endpoints,
 * usage examples, version details, and quick start guide. This endpoint serves as
 * the main entry point for API discovery and documentation.
 *
 * @apiPermission none
 * @apiPrivate false
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET "http://localhost:9090/"
 *
 * @apiExample {javascript} JavaScript/Fetch Example:
 *     fetch('http://localhost:9090/')
 *       .then(response => response.json())
 *       .then(data => {
 *         console.log('API Version:', data.version);
 *         console.log('Available endpoints:', data.endpoints);
 *       });
 *
 * @apiSuccess {String} message API title and description
 * @apiSuccess {String} version Current API version following semantic versioning
 * @apiSuccess {String} description Detailed API description and purpose
 * @apiSuccess {Object} endpoints Available endpoints with HTTP methods
 * @apiSuccess {String} endpoints.health Health check endpoint reference
 * @apiSuccess {String} endpoints.search_all_cases Search endpoint without query
 * @apiSuccess {String} endpoints.search_with_query Search endpoint with query parameter
 * @apiSuccess {String[]} endpoints.examples Array of working example URLs
 * @apiSuccess {String} documentation Usage instructions and getting started guide
 *
 * @apiSuccessExample {json} API Information Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "message": "Supreme Court of Ghana Cases API",
 *       "version": "1.0.0",
 *       "description": "RESTful API for searching Supreme Court of Ghana cases from Wikidata",
 *       "documentation": "Complete API documentation available at /docs"
 *     }
 *
 * @apiUse StandardResponse
 * @apiSampleRequest /
 */

/**
 * @api {get} /search Search Supreme Court Cases
 * @apiName SearchCases
 * @apiGroup Cases
 * @apiVersion 1.0.0
 * @apiDescription Search Supreme Court of Ghana cases with comprehensive filtering capabilities.
 * This endpoint queries Wikidata's SPARQL service to retrieve case information and supports
 * full-text search across multiple case attributes. Search queries are automatically stored
 * in user sessions for recent search functionality.
 *
 * @apiPermission none
 * @apiPrivate false
 *
 * @apiQuery {String{1..500}} [q] Search query string for case filtering.
 * Supports partial matching across case titles, descriptions, judge names, citations, and courts.
 * Maximum length: 500 characters. Case-insensitive search.
 *
 * @apiParamExample {url} Basic Search Examples:
 *     # Get all available cases (no filtering)
 *     GET /search
 *
 *     # Search for human rights related cases
 *     GET /search?q=human+rights
 *
 *     # Search for constitutional law cases
 *     GET /search?q=constitution
 *
 *     # Search by specific judge name
 *     GET /search?q=anin+yeboah
 *
 * @apiParamExample {url} Advanced Search Examples:
 *     # Search for specific case type
 *     GET /search?q=republic+v
 *
 *     # Search for freedom of expression cases
 *     GET /search?q=freedom+of+expression
 *
 *     # Search for cases from specific court
 *     GET /search?q=supreme+court
 *
 * @apiExample {curl} cURL Examples:
 *     # Basic search
 *     curl "http://localhost:9090/search?q=human+rights"
 *
 *     # URL encoded search
 *     curl "http://localhost:9090/search?q=freedom%20of%20expression"
 *
 *
 * @apiExample {javascript} JavaScript/Fetch Example:
 *     // Search with query
 *     const searchCases = async (query) => {
 *       const response = await fetch(
 *         `http://localhost:9090/search?q=${encodeURIComponent(query)}`,
 *         { credentials: 'include' }  // Include cookies for session
 *       );
 *       return await response.json();
 *     };
 *
 *     // Usage
 *     searchCases('human rights').then(data => {
 *       console.log(`Found ${data.results.length} cases`);
 *     });
 *
 *
 * @apiUse StandardResponse
 * @apiSuccess {Object[]} results Array of court case objects matching search criteria
 * @apiUse CourtCase
 *
 * @apiSuccessExample {json} Search Results Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": true,
 *       "results": [
 *         {
 *           "caseId": "Q12345678",
 *           "title": "Republic v. Tommy Thompson Books Ltd",
 *           "description": "Landmark case involving freedom of expression and press freedom under Ghana's 1992 Constitution",
 *           "date": "2019-03-15",
 *           "citation": "[2019] SCGLR 123",
 *           "court": "Supreme Court of Ghana",
 *           "majorityOpinion": "Justice Anin Yeboah",
 *           "sourceLabel": "Ghana Law Reports",
 *           "judges": "Justice Anin Yeboah, Justice Julius Ansah, Justice Gertrude Torkornoo",
 *           "articleUrl": "https://www.wikidata.org/entity/Q12345678"
 *         },
 *         {
 *           "caseId": "Q87654321",
 *           "title": "Attorney-General v. Faroe Atlantic Co. Ltd",
 *           "description": "Constitutional interpretation case regarding executive powers and separation of powers",
 *           "date": "2020-07-22",
 *           "citation": "[2020] SCGLR 456",
 *           "court": "Supreme Court of Ghana",
 *           "majorityOpinion": "Justice Gertrude Torkornoo",
 *           "sourceLabel": "Ghana Law Reports",
 *           "judges": "Justice Gertrude Torkornoo, Justice Prof. Ashie Kotey, Justice Mariama Owusu",
 *           "articleUrl": "https://www.wikidata.org/entity/Q87654321"
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Empty Results Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": true,
 *       "results": []
 *     }
 *
 * @apiUse CommonErrors
 * @apiErrorExample {json} Network Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     Content-Type: application/json
 *     {
 *       "success": false,
 *       "error": "Please check your internet connection!"
 *     }
 *
 * @apiErrorExample {json} Service Unavailable Response:
 *     HTTP/1.1 500 Internal Server Error
 *     Content-Type: application/json
 *     {
 *       "success": false,
 *       "error": "External API service temporarily unavailable. Please try again later."
 *     }
 *
 * @apiUse SearchFilters
 * @apiUse ResponseTimeNote
 *
 * @apiNote Search queries are automatically stored in user sessions
 * @apiNote Session duration: 30 days from last activity
 * @apiNote Duplicate queries are moved to the top of recent searches list
 * @apiNote Empty or whitespace-only queries return all available cases
 * @apiNote Results are ordered chronologically by case decision date
 *
 * @apiSampleRequest /search
 */

/**
 * @api {get} /recent-search Get Recent Searches
 * @apiName GetRecentSearches
 * @apiGroup Cases
 * @apiVersion 1.0.0
 * @apiDescription Retrieve user's recent search queries stored in their session.
 * This endpoint provides search history functionality, tracking search queries with timestamps for user convenience and search pattern analysis.
 *
 * @apiPermission none
 * @apiPrivate false
 *
 * @apiUse SessionAuthentication
 * @apiHeader {String} User-Agent Client application identifier (recommended)
 * @apiHeader {String} Accept Content type acceptance (application/json)
 *
 * @apiHeaderExample {json} Request Headers:
 *     {
 *       "Cookie": "search_session=s%3AeyJyZWNlbnRTZWFyY2hlcyI6W119.abc123def456",
 *       "User-Agent": "SCC-WebApp/1.0.0",
 *       "Accept": "application/json"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET "http://localhost:9090/recent-search" \
 *          -H "Cookie: search_session=your_session_cookie" \
 *          -H "Accept: application/json"
 *
 * @apiExample {javascript} JavaScript/Fetch Example:
 *     // Fetch recent searches (requires session cookie)
 *     fetch('http://localhost:9090/recent-search', {
 *       method: 'GET',
 *       credentials: 'include',  // Include session cookies
 *       headers: {
 *         'Accept': 'application/json'
 *       }
 *     })
 *     .then(response => response.json())
 *     .then(data => {
 *       console.log('Recent searches:', data.results);
 *       data.results.forEach(search => {
 *         const date = new Date(search.timestamp);
 *         console.log(`"${search.query}" searched on ${date.toLocaleDateString()}`);
 *       });
 *     });
 *
 *
 * @apiUse StandardResponse
 * @apiSuccess {Object[]} results Array of recent search query objects (max 10 entries)
 * @apiSuccess {String{1..500}} results.query Search query string that was previously used
 * @apiSuccess {Number} results.timestamp Unix timestamp in milliseconds when search was performed
 *
 * @apiSuccessExample {json} Recent Searches Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Set-Cookie: search_session=s%3A...; Path=/; HttpOnly
 *     {
 *       "success": true,
 *       "results": [
 *         {
 *           "query": "human rights",
 *           "timestamp": 1705312200000
 *         },
 *         {
 *           "query": "constitution",
 *           "timestamp": 1705311800000
 *         },
 *         {
 *           "query": "freedom of expression",
 *           "timestamp": 1705311400000
 *         },
 *         {
 *           "query": "anin yeboah",
 *           "timestamp": 1705311000000
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Empty History Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": true,
 *       "results": []
 *     }
 *
 * @apiSuccessExample {json} New Session Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Set-Cookie: search_session=s%3A...; Path=/; HttpOnly; Max-Age=2592000
 *     {
 *       "success": true,
 *       "results": []
 *     }
 *
 * @apiNote Recent searches are automatically populated when using the /search endpoint with query parameters
 * @apiNote Searches are ordered by timestamp (most recent first)
 * @apiNote Duplicate queries update the timestamp and move to the top of the list
 * @apiNote Session expires after 30 days of inactivity
 * @apiNote Works without session cookie (returns empty results for new sessions)
 *
 * @apiSampleRequest /recent-search
 */

/**
 * @api {get} /browse Browse Cases with Advanced Filters
 * @apiName BrowseCases
 * @apiGroup Cases
 * @apiVersion 1.0.0
 * @apiDescription Browse Supreme Court cases using advanced filtering options with multiple
 * simultaneous filters. This endpoint provides structured case browsing capabilities with
 * year-based, judge-based, and court-based filtering. Unlike the search endpoint,
 * browse queries are not stored in session history.
 *
 * @apiPermission none
 * @apiPrivate false
 *
 * @apiQuery {String{4}} [year] Filter cases by specific year in YYYY format (e.g., 2019, 2020)
 * @apiQuery {String{2..100}} [judge] Filter cases by judge name using case-insensitive partial matching
 * @apiQuery {String{2..100}} [country] Filter cases by country or court name using case-insensitive partial matching
 *
 * @apiParamExample {url} Single Filter Examples:
 *     # Browse all cases without filters
 *     GET /browse
 *
 *     # Filter cases from specific year
 *     GET /browse?year=2019
 *     GET /browse?year=2020
 *
 *     # Filter cases by judge (partial matching)
 *     GET /browse?judge=anin+yeboah
 *     GET /browse?judge=torkornoo
 *
 *     # Filter cases by court/country
 *     GET /browse?country=ghana
 *     GET /browse?country=supreme
 *
 * @apiParamExample {url} Multiple Filter Examples:
 *     # Combine year and judge filters
 *     GET /browse?year=2020&judge=anin+yeboah
 *
 *     # Combine all three filters
 *     GET /browse?year=2019&judge=torkornoo&country=ghana
 *
 *     # Year and country filters
 *     GET /browse?year=2021&country=supreme+court
 *
 * @apiExample {curl} cURL Examples:
 *     # Browse with single filter
 *     curl "http://localhost:9090/browse?year=2019"
 *
 *     # Browse with multiple filters
 *     curl "http://localhost:9090/browse?year=2020&judge=torkornoo"
 *
 *
 * @apiExample {javascript} JavaScript/Fetch Example:
 *     // Browse with filters
 *     const browseCases = async (filters = {}) => {
 *       const params = new URLSearchParams();
 *
 *       if (filters.year) params.append('year', filters.year);
 *       if (filters.judge) params.append('judge', filters.judge);
 *       if (filters.country) params.append('country', filters.country);
 *
 *       const url = `http://localhost:9090/browse?${params.toString()}`;
 *       const response = await fetch(url);
 *       return await response.json();
 *     };
 *
 *     // Usage examples
 *     browseCases({ year: '2019' }).then(data =>
 *       console.log(`Found ${data.results.length} cases from 2019`)
 *     );
 *
 *     browseCases({ year: '2020', judge: 'torkornoo' }).then(data =>
 *       console.log(`Found ${data.results.length} cases from 2020 with Justice Torkornoo`)
 *     );
 *
 *
 *
 * @apiUse StandardResponse
 * @apiSuccess {String="browse"} mode Response mode identifier (always "browse")
 * @apiSuccess {Object} filters Applied filter parameters with their values or null
 * @apiSuccess {String} filters.year Year filter value or null if not applied
 * @apiSuccess {String} filters.judge Judge filter value or null if not applied
 * @apiSuccess {String} filters.country Country filter value or null if not applied
 * @apiSuccess {Object[]} results Array of court case objects matching filter criteria
 * @apiUse CourtCase
 *
 * @apiSuccessExample {json} Filtered Browse Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": true,
 *       "mode": "browse",
 *       "filters": {
 *         "year": "2019",
 *         "judge": null,
 *         "country": null
 *       },
 *       "results": [
 *         {
 *           "caseId": "Q12345678",
 *           "title": "Republic v. Tommy Thompson Books Ltd",
 *           "description": "Freedom of expression case involving media regulation",
 *           "date": "2019-03-15",
 *           "citation": "[2019] SCGLR 123",
 *           "court": "Supreme Court of Ghana",
 *           "judges": "Justice Anin Yeboah, Justice Julius Ansah",
 *           "sourceLabel": "Ghana Law Reports",
 *           "articleUrl": "https://www.wikidata.org/entity/Q12345678"
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Multiple Filters Response:
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     {
 *       "success": true,
 *       "mode": "browse",
 *       "filters": {
 *         "year": "2020",
 *         "judge": "torkornoo",
 *         "country": null
 *       },
 *       "results": [
 *         {
 *           "caseId": "Q87654321",
 *           "title": "Attorney-General v. Faroe Atlantic Co. Ltd",
 *           "description": "Constitutional case on executive authority",
 *           "date": "2020-07-22",
 *           "citation": "[2020] SCGLR 456",
 *           "court": "Supreme Court of Ghana",
 *           "judges": "Justice Gertrude Torkornoo, Justice Prof. Ashie Kotey",
 *           "sourceLabel": "Ghana Law Reports",
 *           "articleUrl": "https://www.wikidata.org/entity/Q87654321"
 *         }
 *       ]
 *     }
 *
 *
 * @apiUse CommonErrors
 * @apiErrorExample {json} Browse Service Error:
 *     HTTP/1.1 500 Internal Server Error
 *     Content-Type: application/json
 *     {
 *       "success": false,
 *       "error": "Browse request failed due to external service unavailability"
 *     }
 *
 * @apiUse ResponseTimeNote
 *
 * @apiNote Browse queries are NOT stored in session history (unlike search queries)
 * @apiNote Year filtering performs exact matching against the date field's year component
 * @apiNote Judge filtering uses case-insensitive partial string matching against the judges field
 * @apiNote Multiple filters are combined using logical AND operation
 * @apiNote Invalid filter values are ignored (treated as null)
 * @apiNote Results are ordered chronologically by case decision date (ascending)
 * @apiNote Empty filter values (empty strings) are treated as null/not applied
 *
 * @apiSampleRequest /browse
 */

/**
 * @apiDefine ApiVersion_1_0_0
 * @apiVersion 1.0.0
 * @apiDescription Initial stable release of the Supreme Court Cases API.
 *
 * Features included:
 * - Complete case search functionality
 * - Advanced filtering and browsing
 * - Session-based search history
 * - Comprehensive error handling
 * - Full Wikidata SPARQL integration
 *
 * Supported endpoints: /api/health, /, /search, /recent-search, /browse
 */

/**
 * @apiDefine RequestRateLimiting
 * @apiNote Rate limiting is currently not implemented but recommended for production use
 * @apiNote External API (Wikidata) has its own rate limiting policies
 * @apiNote Consider implementing request throttling for high-traffic scenarios
 */

/**
 * @apiDefine CacheConsiderations
 * @apiNote API responses are not currently cached
 * @apiNote Consider implementing Redis or in-memory caching for frequently accessed data
 * @apiNote External API response times may vary based on Wikidata server load
 */

/**
 * @apiDefine SecurityConsiderations
 * @apiNote API implements CORS for cross-origin requests
 * @apiNote Session cookies are HTTP-only and secure in production
 * @apiNote Input validation is performed on all query parameters
 * @apiNote No sensitive data is logged or exposed in error messages
 */
