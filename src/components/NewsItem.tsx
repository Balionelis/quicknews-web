import React from 'react';
import { Article } from '../types';

interface NewsItemProps {
  article: Article;
  animationDelay?: number;
}

const NewsItem: React.FC<NewsItemProps> = ({ article, animationDelay = 0 }) => {
  const extractTitleFromHTML = (htmlString: string): string => {
    if (!htmlString.includes('href=')) {
      return htmlString;
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    return doc.body.textContent || '';
  };

  const extractUrlFromHTML = (htmlString: string): string => {
    if (!htmlString.includes('href=')) {
      return article.url;
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    const anchor = doc.querySelector('a');
    return anchor ? anchor.href : article.url;
  };

  const cleanDescription = (description: string): string => {
    if (!description) return 'No description available';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    
    return doc.body.textContent || 'No description available';
  };

  const title = extractTitleFromHTML(article.title);
  const url = extractUrlFromHTML(article.title);
  const description = cleanDescription(article.description);

  return (
    <div 
      className="news-item" 
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="news-meta">
        <span className="news-date">{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="read-more-btn"
      >
        Read Article
      </a>
    </div>
  );
};

export default NewsItem;