import React from 'react';

const NewsItem = ({ article }) => {
  const extractTitleFromHTML = (htmlString) => {
    if (!htmlString.includes('<a href=')) {
      return htmlString;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    return tempDiv.textContent;
  };

  const extractUrlFromHTML = (htmlString) => {
    if (!htmlString.includes('<a href=')) {
      return article.url;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    const anchor = tempDiv.querySelector('a');
    return anchor ? anchor.href : article.url;
  };

  const cleanDescription = (description) => {
    if (!description) return 'No description available';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    
    return tempDiv.textContent;
  };

  const title = extractTitleFromHTML(article.title);
  const url = extractUrlFromHTML(article.title);
  const description = cleanDescription(article.description);

  return (
    <div className="news-item">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="news-meta">
        <span className="news-date"> {new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="read-more-btn"
      >
        Read Full Article
      </a>
    </div>
  );
};

export default NewsItem;