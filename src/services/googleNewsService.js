export const fetchGoogleNewsRSS = async (query = 'general') => {
  try {
    const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const rssToJsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleNewsUrl)}`;
    
    const response = await fetch(rssToJsonApiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`RSS API error: ${data.message || 'Unknown error'}`);
    }
    
    const items = data.items;
    
    if (!items || items.length === 0) {
      throw new Error(`No articles found for query: ${query}`);
    }
    
    const articles = items.map(item => ({
      title: item.title,
      description: item.description || 'No description available',
      url: item.link,
      publishedAt: item.pubDate,
      source: {
        name: item.author || 'Google News'
      }
    }));
    
    return articles;
  } catch (error) {
    console.error('News Fetch Error:', {
      message: error.message,
      query: query,
      timestamp: new Date().toISOString()
    });

    throw new Error(`Failed to fetch news: ${error.message}`);
  }
};