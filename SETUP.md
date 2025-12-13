# Setup Guide

## Environment Variables Setup

### Server Environment Variables

Create a `.env` file in the `server/` directory with the following:

```env
PORT=9090
NODE_ENV=development
WIKIDATA_API=https://query.wikidata.org/sparql
CORS_ORIGIN=http://localhost:5173
```

### Client Environment Variables

Create a `.env` file in the `client/` directory with the following:

```env
VITE_API_BASE_URL=http://localhost:9090
VITE_APP_TITLE=Supreme Court Cases
```

## Quick Setup

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install all dependencies (client + server):
   ```bash
   npm run install:all
   ```

3. Create environment files (copy the examples above)

4. Start development servers:
   ```bash
   npm run dev
   ```

This will start both the client (port 5173) and server (port 9090) concurrently.

