# Country Selector Integration Guide

## Overview

The country selector system allows users to browse Supreme Court cases from different countries. When a country is selected, a loading modal appears, data is fetched, and the user is navigated to a dynamic country-specific page.

## Features Implemented

### 1. **Dynamic Country Selection**

- Users can select from available countries (Ghana, Nigeria, Kenya)
- Visual feedback shows the currently active country
- Dropdown with flags and country names

### 2. **Loading Modal**

- Displays when switching countries
- Shows a spinner and loading message
- Smooth animations

### 3. **Custom Hook for Data Fetching**

- `useCountryData` hook handles all backend communication
- Easy to integrate with your backend API
- Includes loading, error, and success states

### 4. **Dynamic URLs**

- Each country has its own URL (e.g., `/gh` for Ghana, `/ng` for Nigeria)
- URL updates when switching countries
- Page reads country from URL on load

### 5. **Visual Country Indicators**

- Active country highlighted in dropdown
- Country selector button shows active state
- Page header displays current country

## Backend Integration

### Step 1: Update the API Endpoint

Open `src/hooks/useCountryData.ts` and update line 34:

```typescript
// REPLACE THIS:
// const response = await fetch(`/api/cases/${countryCode.toLowerCase()}`);

// WITH YOUR BACKEND URL:
const response = await fetch(
  `https://your-backend.com/api/cases/${countryCode.toLowerCase()}`
);

// OR if using relative paths:
const response = await fetch(`/api/cases/${countryCode.toLowerCase()}`);
```

### Step 2: Remove Mock Data

In `useCountryData.ts`, remove/comment lines 37-48 (the mock data section):

```typescript
// REMOVE THESE LINES:
await new Promise((resolve) => setTimeout(resolve, 1500));
const mockData: CountryData = {
  cases: [],
  metadata: {
    country: getCountryName(countryCode),
    countryCode: countryCode,
    totalCases: 0,
  },
};
setData(mockData);
```

### Step 3: Uncomment Real API Call

Uncomment lines 31-36 in `useCountryData.ts`:

```typescript
// UNCOMMENT THESE:
if (!response.ok) {
  throw new Error(`Failed to fetch data for ${countryCode}`);
}
const result = await response.json();
setData(result);
```

## Expected Backend Response Format

Your backend should return data in this format:

```json
{
  "cases": [
    {
      "id": "string",
      "title": "Case Title",
      "description": "Case description",
      "date": "2024-01-01",
      "parties": ["Party A", "Party B"],
      "citation": "Citation info"
      // ... other case fields
    }
  ],
  "metadata": {
    "country": "Ghana",
    "countryCode": "GH",
    "totalCases": 150
  }
}
```

## Router Setup

Add these routes to your router configuration:

```typescript
import CountryPage from './pages/CountryPage';

// In your router:
<Route path="/gh" element={<CountryPage countryCode="GH" />} />
<Route path="/ng" element={<CountryPage countryCode="NG" />} />
<Route path="/ke" element={<CountryPage countryCode="KE" />} />
<Route path="/za" element={<CountryPage countryCode="ZA" />} />
```

## Usage Examples

### In a Component

```typescript
import { useCountryData } from "../hooks/useCountryData";

function MyComponent() {
  const { data, loading, error, refetch } = useCountryData("GH");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data?.metadata?.country} Cases</h1>
      <p>Total: {data?.metadata?.totalCases}</p>
      {/* Render cases */}
    </div>
  );
}
```

### Header with Country Detection

```typescript
import Header from '../components/Header';

// Automatically detects country from URL
<Header />

// Or pass it explicitly
<Header currentCountryCode="GH" />
```

## File Structure

```
src/
├── components/
│   ├── Header.tsx              # Updated with country selector
│   ├── LoadingModal.tsx        # Loading modal component
│   └── Footer.tsx
├── hooks/
│   └── useCountryData.ts       # Custom hook for API calls
├── pages/
│   └── CountryPage.tsx         # Dynamic country page template
└── styles/
    ├── Header.css
    ├── LoadingModal.css
    └── CountryPage.css
```

## Testing Before Backend Integration

The system works with mock data out of the box. You can:

1. Click country selector and choose a country
2. See the loading modal appear
3. Get navigated to the country URL
4. See the country page with mock data

## Adding New Countries

To add more countries:

1. Update the countries array in `Header.tsx`:

```typescript
const countries: Country[] = [
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" }, // Add new country here
];
```

2. Add route for the new country:

```typescript
<Route path="/za" element={<CountryPage countryCode="ZA" />} />
```

3. Update the helper function in `useCountryData.ts`:

```typescript
const countryMap: Record<string, string> = {
  GH: "Ghana",
  NG: "Nigeria",
  KE: "Kenya",
  ZA: "South Africa", // Add here too
};
```

## Notes

- All country codes should be 2 letters (ISO format)
- URLs are lowercase (e.g., `/gh` not `/GH`)
- The system handles URL changes and browser back/forward
- Loading modal prevents interaction during data fetch
- Error handling is built-in with retry capability
