# Getting Started with Supreme Court Cases API

Welcome to the comprehensive documentation for the **Supreme Court of Ghana Cases API**. This RESTful service provides programmatic access to Supreme Court case data sourced from Wikidata, enabling developers to search, filter, and retrieve detailed information about Ghana's Supreme Court cases.

## Quick Overview

The API offers five main endpoints for different functionalities:
- **System endpoints** for health checks and API information
- **Search endpoints** for finding cases with queries and filters
- **Session endpoints** for managing user search history

## Base URLs

| Environment | URL | Description |
|-------------|-----|-------------|
| **Development** | `http://localhost:9090` | Local development server |
| **Staging** | `https://staging-api.example.com` | Testing environment |
| **Production** | `https://api.example.com` | Live production API |

## Authentication & Sessions

- **No API keys required** for basic functionality
- **Session-based authentication** for search history features
- **HTTP-only cookies** used for session management
- **30-day session duration** with automatic renewal
- **CORS enabled** for cross-origin requests

## Quick Start

### 1. Test the API
```bash
# Check if API is running
curl http://localhost:9090/api/health

# Get API information
curl http://localhost:9090/

# Search for cases
curl "http://localhost:9090/search?q=human+rights"
```

### 2. Basic Usage
```javascript
// JavaScript example
const response = await fetch('http://localhost:9090/search?q=constitution');
const data = await response.json();
console.log(`Found ${data.results.length} cases`);
```

## Response Format

All API responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "success": true,
  "results": [...]  // or other data fields
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

## Rate Limiting & Performance

- **No explicit rate limiting** currently implemented
- **10-second timeout** for external API requests
- **5,000 case limit** per query for optimal performance
- **Wikidata SPARQL** backend with variable response times

## Content Types

- **Request:** `application/json` (for POST requests)
- **Response:** `application/json`
- **Character Encoding:** UTF-8

## Error Handling

The API implements comprehensive error handling:
- **Network connectivity issues** → 500 with connection error
- **External service timeouts** → 500 with timeout message  
- **Invalid parameters** → Graceful handling with empty results
- **Missing session data** → Empty array for new sessions

## Need Help?

- **Complete Guide:** Read the detailed endpoint documentation below
- **Issues:** Report problems via GitHub issues
- **Support:** Contact the development team

---
