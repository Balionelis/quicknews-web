import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { getUserLocation, getLanguageFromCountry } from '../services/locationService';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [languages] = useState<Language[]>([
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'zh', name: '中文' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'fi', name: 'Suomi' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'lt', name: 'Lietuvių' },
    { code: 'no', name: 'Norsk' },
    { code: 'pl', name: 'Polski' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'sv', name: 'Svenska' },
    { code: 'th', name: 'ไทย' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'uk', name: 'Українська' },
    { code: 'vi', name: 'Tiếng Việt' }
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