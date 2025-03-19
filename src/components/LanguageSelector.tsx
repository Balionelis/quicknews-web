import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { getUserLocation, getLanguageFromCountry } from '../services/locationService';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [languages] = useState<Language[]>([
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'lt', name: "Lithuanian"}
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false);
  const languageDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function detectUserLanguage() {
      try {
        const location = await getUserLocation();
        const languageCode = getLanguageFromCountry(location.country_code);
        if (languageCode) {
          setSelectedLanguage(languageCode);
          onLanguageChange(languageCode);
        }
      } catch (error) {
        console.error('Error detecting user language:', error);
      }
    }

    detectUserLanguage();
    
    return () => {
      if (languageDebounceTimerRef.current) {
        clearTimeout(languageDebounceTimerRef.current);
      }
    };
  }, [onLanguageChange]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    
    if (isChangingLanguage) {
      return;
    }
    
    setIsChangingLanguage(true);
    setSelectedLanguage(newLanguage);
    
    if (languageDebounceTimerRef.current) {
      clearTimeout(languageDebounceTimerRef.current);
    }
    
    languageDebounceTimerRef.current = setTimeout(() => {
      onLanguageChange(newLanguage);
      setIsChangingLanguage(false);
    }, 500);
  };

  return (
    <div className="language-selector">
      <select 
        value={selectedLanguage} 
        onChange={handleLanguageChange}
        disabled={isChangingLanguage}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      {isChangingLanguage && (
        <div className="language-loading-indicator" style={{ 
          fontSize: '0.8rem', 
          marginTop: '5px', 
          color: '#666' 
        }}>
          Changing language...
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;