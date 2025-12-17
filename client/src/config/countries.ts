// Country Configuration for Multi-Country Support

export interface Country {
  code: string;
  name: string;
  flag: string;
  wikidataId: string; // Wikidata ID for the Supreme Court
  enabled: boolean;
}

export const COUNTRIES: Country[] = [
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    wikidataId: 'Q30261418', // Supreme Court of Ghana
    enabled: true
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    wikidataId: 'Q16011598', // Supreme Court of Nigeria
    enabled: true
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    wikidataId: 'Q7653543', // Supreme Court of Kenya
    enabled: true
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    wikidataId: 'Q1360033', // Constitutional Court of South Africa
    enabled: true
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    wikidataId: 'Q7881425', // Supreme Court of Uganda
    enabled: false // Coming soon
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    wikidataId: 'Q7668643', // Court of Appeal of Tanzania
    enabled: false // Coming soon
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

export const getEnabledCountries = (): Country[] => {
  return COUNTRIES.filter(c => c.enabled);
};

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Ghana as default
