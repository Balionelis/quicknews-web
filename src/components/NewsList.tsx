import React, { useState } from 'react';
import NewsItem from './NewsItem';
import { fetchGoogleNewsRSS } from '../services/googleNewsService';
import { getAISelection, parseAISelection } from '../services/aiService';
import { Article } from '../types';

const NewsList: React.FC = () => {
  const [topNews, setTopNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedQuery, setSubmittedQuery] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    setLoading(true);
    try {
      const articles = await fetchGoogleNewsRSS(trimmedQuery);
      const titles = articles.map(article => article.title);
      const aiAnswer = await getAISelection(trimmedQuery, titles);
      const selectedIndices = parseAISelection(aiAnswer, titles);
      const importantNews = selectedIndices.map(index => articles[index]);
      
      setTopNews(importantNews);
      setSubmittedQuery(trimmedQuery);
    } catch (error) {
      console.error('Error in news search:', error);
      setTopNews([]);
      setSubmittedQuery('');
    } finally {
      setLoading(false);
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
        <button type="submit">Search News</button>
      </form>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Finding important news...</div>
        </div>
      ) : (
        <>
          {topNews.length > 0 ? (
            <>
              <h2>Top 5 Most Important News about "{submittedQuery}"</h2>
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