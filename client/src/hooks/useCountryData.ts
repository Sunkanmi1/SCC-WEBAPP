import { useState, useEffect } from "react";

interface CaseItem {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  parties?: string[];
  citation?: string;
  [key: string]: unknown;
}

interface CountryData {
  cases: CaseItem[];
  metadata?: {
    country: string;
    countryCode: string;
    totalCases: number;
  };
}

interface UseCountryDataReturn {
  data: CountryData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching country-specific supreme court case data
 *
 * @param countryCode - Two-letter country code (e.g., "GH", "NG", "KE")
 * @returns Object containing data, loading state, error, and refetch function
 *
 * @example
 * const { data, loading, error } = useCountryData("GH");
 */
export const useCountryData = (countryCode: string): UseCountryDataReturn => {
  const [data, setData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountryData = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual backend API endpoint
      // const response = await fetch(`/api/cases/${countryCode.toLowerCase()}`);

      // Simulate API call delay (remove when backend is ready)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Uncomment when backend is available
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch data for ${countryCode}`);
      // }
      // const result = await response.json();
      // setData(result);

      // Mock data for development (remove when backend is ready)
      const mockData: CountryData = {
        cases: [],
        metadata: {
          country: getCountryName(countryCode),
          countryCode: countryCode,
          totalCases: 0,
        },
      };
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchCountryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  return {
    data,
    loading,
    error,
    refetch: fetchCountryData,
  };
};

// Helper function to get country name from code
const getCountryName = (code: string): string => {
  const countryMap: Record<string, string> = {
    GH: "Ghana",
    NG: "Nigeria",
    KE: "Kenya",
    ZA: "South Africa",
  };
  return countryMap[code.toUpperCase()] || code;
};
