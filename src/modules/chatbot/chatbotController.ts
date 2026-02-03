import { Request, Response } from 'express';
import { getGeminiResponse } from './chatbotService';
import { ChatRequest } from './chatbotTypes';

export async function chatWithGemini(req: Request, res: Response) {
  const { message } = req.body as ChatRequest;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  const geminiResponse = await getGeminiResponse({ message });
  res.json(geminiResponse);
}
