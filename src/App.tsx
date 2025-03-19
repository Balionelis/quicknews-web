import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import NewsList from './components/NewsList';
import './styles.css';

const App: React.FC = () => {
  const [githubStats, setGithubStats] = useState({
    watchers: null,
    stars: null,
    error: false
  });
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Balionelis/quicknews-web');
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub stats');
        }
        
        const data = await response.json();
        
        setGithubStats({
          watchers: data.subscribers_count,
          stars: data.stargazers_count,
          error: false
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setGithubStats({
          watchers: null,
          stars: null,
          error: true
        });
      }
    };

    fetchGithubStats();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>QuickNews</h1>
      </header>
      <main>
        <NewsList language={language} onLanguageChange={setLanguage} />
      </main>
      <footer>
        <div className="footer-content">
          <p>Powered by Google News RSS & Gemini AI</p>
          <div className="footer-stats">
            {githubStats.error ? (
              <div className="error-message">Unable to load GitHub stats</div>
            ) : (
              <>
                <a 
                  href="https://github.com/Balionelis/quicknews-web/watchers"
                  className="github-stat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{githubStats.watchers !== null 
                    ? `${githubStats.watchers} watching` 
                    : "Loading..."}
                  </span>
                </a>
                
                <a 
                  href="https://github.com/Balionelis/quicknews-web/stargazers"
                  className="github-stat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{githubStats.stars !== null 
                    ? `${githubStats.stars} stars` 
                    : "Loading..."}
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;