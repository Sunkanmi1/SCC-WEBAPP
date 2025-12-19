/**
 * API Documentation History File
 * This file contains historical API documentation for versioning and comparison purposes.
 * apiDoc automatically includes this information when generating documentation.
 */


// "dev": "nodemon --watch './**/*.ts' --exec node --loader ts-node/esm server.ts"

// "dev": "nodemon --watch './**/*.ts' --exec ts-node server.ts",

/**
 * @api {get} /api/health Health Check
 * @apiVersion 0.9.0
 * @apiName GetHealth
 * @apiGroup System
 * @apiDescription Returns basic server health status. Initial implementation with minimal metrics.
 *
 * @apiSuccess {String} status Server health status
 * @apiSuccess {String} timestamp Current timestamp
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "healthy",
 *       "timestamp": "2024-01-10T10:30:00.000Z"
 *     }
 */

/**
 * @api {get} / API Information
 * @apiVersion 0.9.0
 * @apiName GetRoot
 * @apiGroup System
 * @apiDescription Basic API information endpoint. Initial implementation with limited details.
 *
 * @apiSuccess {String} message API title
 * @apiSuccess {String} version Current API version
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Supreme Court Cases API",
 *       "version": "0.9.0"
 *     }
 */

/**
 * @api {get} /search Search Cases
 * @apiVersion 0.9.0
 * @apiName SearchCases
 * @apiGroup Cases
 * @apiDescription Basic search functionality without session management.
 *
 * @apiParam {String} [q] Search query string
 *
 * @apiSuccess {Boolean} success Request success status
 * @apiSuccess {Object[]} results Array of court cases
 * @apiSuccess {String} results.id Case ID
 * @apiSuccess {String} results.title Case title
 * @apiSuccess {String} results.date Case date
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "results": [
 *         {
 *           "id": "12345",
 *           "title": "Sample Case",
 *           "date": "2019-01-01"
 *         }
 *       ]
 *     }
 *
 * @apiError (500 Internal Server Error) {String} error Error message
 *
 * @apiErrorExample Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Search failed"
 *     }
 */

/**
 * @api {get} /browse Browse Cases
 * @apiVersion 0.8.0
 * @apiName BrowseCases
 * @apiGroup Cases
 * @apiDescription Initial browse implementation with basic year filtering only.
 *
 * @apiParam {String} [year] Filter by year
 *
 * @apiSuccess {Boolean} success Request success status
 * @apiSuccess {Object[]} results Array of court cases
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "results": []
 *     }
 */

/**
 * @api {get} /search Advanced Search
 * @apiVersion 0.8.0
 * @apiName SearchCases
 * @apiGroup Cases
 * @apiDescription Early search implementation with limited filtering capabilities.
 *
 * @apiParam {String} [query] Basic search query
 *
 * @apiSuccess {Object[]} cases Array of cases (different structure)
 * @apiSuccess {String} cases.caseNumber Case number
 * @apiSuccess {String} cases.name Case name
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "cases": [
 *         {
 *           "caseNumber": "001",
 *           "name": "Early Case Format"
 *         }
 *       ]
 *     }
 */

/**
 * @api {post} /search Search Cases
 * @apiVersion 0.6.0
 * @apiName SearchCases
 * @apiGroup Cases
 * @apiDescription Early POST-based search implementation (later changed to GET).
 * @apiDeprecated POST method deprecated. Use GET /search instead.
 *
 * @apiBody {String} searchTerm Search term in request body
 *
 * @apiSuccess {Object[]} data Array of case data
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": []
 *     }
 */
