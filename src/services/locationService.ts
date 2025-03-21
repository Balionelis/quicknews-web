interface LocationData {
  country_code: string;
  country_name: string;
}

export const getUserLocation = async (): Promise<LocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting user location:', error);
    return { country_code: 'US', country_name: 'United States' }; // default
  }
};

export const getLanguageFromCountry = (countryCode: string): string => {
  const countryLanguageMap = new Map<string, string>([
    ['US', 'en'], ['GB', 'en'], ['CA', 'en'],
    ['ES', 'es'], ['MX', 'es'], ['AR', 'es'],
    ['FR', 'fr'], ['DE', 'de'], ['IT', 'it'],
    ['PT', 'pt'], ['BR', 'pt'], ['RU', 'ru'],
    ['CN', 'zh'], ['TW', 'zh'], ['HK', 'zh'],
    ['JP', 'ja'], ['KR', 'ko']
  ]);

  return countryLanguageMap.get(countryCode) || 'en';
};