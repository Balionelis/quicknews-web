import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Missing Gemini API key in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error', 
      fallbackSelection: "1,2,3,4,5" 
    });
  }

  try {
    const { query, titles } = req.body;
    
    if (!query || !titles || !Array.isArray(titles)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = ( 
      `I have a list of news headlines related to '${query}'.\n\n` +
      `Here are the headlines:\n${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n` +
      `Your task is to select the 5 most important and relevant headlines based on their significance, impact, and relevance to '${query}'.\n` +
      `Only respond with the numbers of the selected headlines in a comma-separated format (e.g., 1,2,5,7,9) and nothing else.`
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return res.status(200).json({ selection: text });
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    return res.status(500).json({ 
      error: 'Failed to process request', 
      fallbackSelection: "1,2,3,4,5" 
    });
  }
}