const API_URL = 'https://quicknews-backend.vercel.app';

export const getAISelection = async (query, titles) => {
  try {
    const response = await fetch(`${API_URL}/api/gemini/selection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, titles })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error from proxy server');
    }

    const data = await response.json();
    return data.selection;
  } catch (error) {
    console.error('Error with AI selection:', error);
    return "1,2,3,4,5"; // fallback
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