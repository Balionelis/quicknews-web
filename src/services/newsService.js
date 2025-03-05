const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return yesterday.toISOString().split('T')[0];
};

export const fetchNews = async (query = 'general') => {
  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY is not set. Please add REACT_APP_NEWS_API_KEY to your .env file.');
  }

  const yesterday = getYesterdayDate();
//   console.log(yesterday);

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${yesterday}&sortBy=relevancy&language=en&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`News API Request Failed: ${response.status} ${response.statusText}
      Response Body: ${errorBody}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      throw new Error(`No articles found for query: ${query} on ${yesterday}`);
    }

    return data.articles;
  } catch (error) {
    console.error('News Fetch Error:', {
      message: error.message,
      query: query,
      date: yesterday,
      timestamp: new Date().toISOString()
    });

    throw new Error(`Failed to fetch news: ${error.message}`);
  }
};

export const showErrorAlert = (message) => {
  alert(`
  🚨 News Fetch Error 🚨

  ${message}

  Troubleshooting Tips:
  1. Check your internet connection
  2. Verify API key in .env file
  3. Ensure News API key is valid
  4. Try a different search query
  `);
};