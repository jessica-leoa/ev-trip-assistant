import axios from 'axios';
import { ChatRequest, ChatResponse } from './chatbotTypes';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiResponse(request: ChatRequest): Promise<ChatResponse> {
  try {
    const res = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: request.message }] }]
      }
    );
    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { response: text };
  } catch (error) {
    console.error('Gemini API error:', error);
    return { response: 'Sorry, there was an error processing your request.' };
  }
}
