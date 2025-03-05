import React, { useState } from 'react';
import NewsItem from './NewsItem';
import { fetchNews, showErrorAlert } from '../services/newsService';
import { getAISelection, parseAISelection } from '../services/aiService';

const NewsList = () => {
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    setLoading(true);
    try {
      const articles = await fetchNews(trimmedQuery);
      const titles = articles.map(article => article.title);
      const aiAnswer = await getAISelection(trimmedQuery, titles);
      const selectedIndices = parseAISelection(aiAnswer, titles);
      const importantNews = selectedIndices.map(index => articles[index]);
      
      setTopNews(importantNews);
      setSubmittedQuery(trimmedQuery);
    } catch (error) {
      console.error('Error in news search:', error);
      showErrorAlert(error.message);
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
          Loading important news...
        </div>
      ) : (
        <>
          {topNews.length > 0 ? (
            <>
              <h2>Top 5 Most Important News about "{submittedQuery}"</h2>
              {topNews.map((article, index) => (
                <NewsItem key={index} article={article} />
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