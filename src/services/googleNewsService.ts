import { Article } from '../types';

interface RSSResponse {
  status: string;
  message?: string;
  items: Array<{
    title: string;
    description?: string;
    link: string;
    pubDate: string;
    author?: string;
  }>;
}

const newsCache = new Map<string, {
  timestamp: number;
  articles: Article[];
}>();

const MAX_CACHE_AGE = 5 * 60 * 1000;

export const fetchGoogleNewsRSS = async (
  query: string = 'general',
  language: string = 'en',
  daysBack: number = 1
): Promise<Article[]> => {
  try {
    const cacheKey = `${query}_${language}_${daysBack}`;
    
    const cachedResult = newsCache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp) < MAX_CACHE_AGE) {
      console.log('Using cached news results');
      return cachedResult.articles;
    }
    
    const dateQuery = daysBack > 1 ? ` when:${daysBack}d` : '';
    const fullQuery = `${query}${dateQuery}`;
    
    const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(fullQuery)}&hl=${encodeURIComponent(language)}&gl=US&ceid=US:${encodeURIComponent(language)}`;
    const rssToJsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleNewsUrl)}`;
    
    const response = await fetch(rssToJsonApiUrl);
    
    if (response.status === 429) {
      console.warn('RSS API rate limit exceeded. Checking for cached results or retrying with default filter.');
      
      if (language !== 'en') {
        const englishCacheKey = `${query}_en_${daysBack}`;
        const englishCache = newsCache.get(englishCacheKey);
        if (englishCache && (Date.now() - englishCache.timestamp) < MAX_CACHE_AGE) {
          console.log('Using English cached results as fallback');
          return englishCache.articles;
        }
      }
      
      if (daysBack > 1) {
        const todayCacheKey = `${query}_${language}_1`;
        const todayCache = newsCache.get(todayCacheKey);
        if (todayCache && (Date.now() - todayCache.timestamp) < MAX_CACHE_AGE) {
          console.log('Using today cached results as fallback');
          return todayCache.articles;
        }
        
        return fetchGoogleNewsRSS(query, language, 1);
      }
      
      throw new Error('429: Rate limit exceeded. Please try again later.');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }
    
    const data: RSSResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`RSS API error: ${data.message || 'Unknown error'}`);
    }
    
    const items = data.items;
    
    if (!items || items.length === 0) {
      throw new Error(`No articles found for query: ${query}`);
    }
    
    const articles: Article[] = items.map(item => ({
      title: item.title,
      description: item.description || 'No description available',
      url: item.link,
      publishedAt: item.pubDate,
      source: {
        name: item.author || 'Google News'
      }
    }));
    
    newsCache.set(cacheKey, {
      timestamp: Date.now(),
      articles: articles
    });
    
    return articles;
  } catch (error: any) {
    console.error('News Fetch Error:', {
      message: error.message,
      query: query,
      timestamp: new Date().toISOString()
    });

    throw new Error(`Failed to fetch news: ${error.message}`);
  }
};