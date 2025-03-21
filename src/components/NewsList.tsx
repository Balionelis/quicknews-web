import React, { useState, useEffect, useRef } from 'react';
import NewsItem from './NewsItem';
import DateSelector from './DateSelector';
import LanguageSelector from './LanguageSelector';
import { fetchGoogleNewsRSS } from '../services/googleNewsService';
import { getAISelection, parseAISelection } from '../services/aiService';
import { Article } from '../types';

interface NewsListProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ language, onLanguageChange }) => {
  const [topNews, setTopNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [actualDateUsed, setActualDateUsed] = useState<number>(1);
  const previousLanguageRef = useRef<string>(language);
  const languageDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (languageDebounceTimerRef.current) {
      clearTimeout(languageDebounceTimerRef.current);
    }
    
    if (previousLanguageRef.current !== language) {
      setError(null);
      
      languageDebounceTimerRef.current = setTimeout(() => {
        setTopNews([]);
        setSubmittedQuery('');
        previousLanguageRef.current = language;
      }, 1000);
    }
    
    return () => {
      if (languageDebounceTimerRef.current) {
        clearTimeout(languageDebounceTimerRef.current);
      }
    };
  }, [language]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;
    if (loading) return;

    setLoading(true);
    setError(null);
    setActualDateUsed(selectedDate);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const articles = await fetchGoogleNewsRSS(trimmedQuery, language, selectedDate);
      
      if (selectedDate > 1 && articles.length > 0) {
        const oldestArticleDate = new Date(articles[articles.length - 1].publishedAt);
        const today = new Date();
        if (oldestArticleDate.getDate() === today.getDate() && 
            oldestArticleDate.getMonth() === today.getMonth() && 
            oldestArticleDate.getFullYear() === today.getFullYear()) {
          setActualDateUsed(1);
          setError("Date range request was limited. Showing today's results instead.");
        }
      }
      
      const titles = articles.map(article => article.title);
      const aiAnswer = await getAISelection(trimmedQuery, titles);
      const selectedIndices = parseAISelection(aiAnswer, titles);
      const importantNews = [];
      for (const index of selectedIndices) {
        if (index >= 0 && index < articles.length) {
          importantNews.push(articles[index]);
        }
      }
      setTopNews(importantNews);
      setSubmittedQuery(trimmedQuery);
    } catch (error: any) {
      console.error('Error in news search:', error);
      setTopNews([]);
      setSubmittedQuery('');
      
      if (error.message && error.message.includes('429')) {
        setError("Too many requests. Please wait a minute before trying again.");
      } else if (error.message && error.message.includes('converting new feeds')) {
        setError("API rate limit reached. Please wait a minute before trying again.");
      } else {
        setError(error.message || 'Failed to fetch news');
      }
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeLabel = (days: number): string => {
    switch (days) {
      case 1: return 'Today';
      case 7: return 'This Week';
      case 30: return 'This Month';
      case 365: return 'This Year';
      default: return `${days} days`;
    }
  };

  return (
    <div className="news-list">
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter news topic (e.g., AI, Technology, Politics)"
        />
        <div className="filter-container">
          <DateSelector onDateChange={setSelectedDate} />
          <LanguageSelector onLanguageChange={onLanguageChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search News'}
        </button>
      </form>

      {error && (
        <div className="error-message" style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#fff3cd', 
          color: '#856404',
          borderRadius: '4px',
          border: '1px solid #ffeeba'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Finding important news...</div>
        </div>
      ) : (
        <>
          {topNews.length > 0 ? (
            <>
              <h2>
                Top 5 Most Important News about "{submittedQuery}"
                {actualDateUsed !== selectedDate && 
                  ` (${getDateRangeLabel(actualDateUsed)})`}
              </h2>
              {topNews.map((article, index) => (
                <NewsItem 
                  key={index} 
                  article={article} 
                  animationDelay={index * 100} 
                />
              ))}
            </>
          ) : (
            submittedQuery && <div>No news found for "{submittedQuery}"</div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsList;