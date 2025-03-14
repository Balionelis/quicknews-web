const API_URL = 'https://quicknews-api.vercel.app';

export const getAISelection = async (query, titles) => {
  try {
    console.log('Sending request to external API with query:', query);
    
    const response = await fetch(`${API_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://quicknews-web.vercel.app'
      },
      body: JSON.stringify({ query, titles }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error status:', response.status);
      console.error('API error details:', data);
      return data.fallbackSelection || "1,2,3,4,5";
    }

    console.log('API response received:', data);
    return data.selection;
  } catch (error) {
    console.error('Error calling API:', error.message);
    return "1,2,3,4,5";
  }
};

export const parseAISelection = (aiAnswer, titles, topCount = 5) => {
  try {
    const pickedNumbers = aiAnswer.split(',')
      .map(item => {
        const num = parseInt(item.trim(), 10);
        return (num >= 1 && num <= titles.length) ? num - 1 : -1;
      })
      .filter(num => num !== -1);

    return pickedNumbers.length > 0 
      ? pickedNumbers.slice(0, topCount)
      : Array.from({length: Math.min(topCount, titles.length)}, (_, i) => i);
  } catch (error) {
    console.error('Error parsing AI selection:', error);
    return Array.from({length: Math.min(topCount, titles.length)}, (_, i) => i);
  }
};