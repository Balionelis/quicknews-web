// This will replace newsService.js

export const fetchGoogleNewsRSS = async (query = 'general') => {
  try {
    // Use a public RSS to JSON API service
    const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const rssToJsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleNewsUrl)}`;
    
    // Fetch the RSS feed converted to JSON
    const response = await fetch(rssToJsonApiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the request was successful
    if (data.status !== 'ok') {
      throw new Error(`RSS API error: ${data.message || 'Unknown error'}`);
    }
    
    // Extract the news items
    const items = data.items;
    
    // If no news items found
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