import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Gemini API key is missing. Set REACT_APP_GEMINI_API_KEY in .env file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getAISelection = async (query, titles) => {
  if (!GEMINI_API_KEY) {
    console.error("No API key available");
    return "1,2,3,4,5";
  }

  try {
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
    // console.log(result)

    return text;
  } catch (error) {
    console.error('Error with Gemini API:', error);
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

    // If no valid picks, default to first 5
    return pickedNumbers.length > 0 
      ? pickedNumbers.slice(0, topCount)
      : Array.from({length: Math.min(topCount, titles.length)}, (_, i) => i);
  } catch (error) {
    console.error('Error parsing AI selection:', error);
    return Array.from({length: Math.min(topCount, titles.length)}, (_, i) => i);
  }
};