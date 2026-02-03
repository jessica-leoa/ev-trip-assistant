import { Router } from 'express';
import { chatWithGemini } from './chatbotController';

const router = Router();

router.post('/chatbot', chatWithGemini);

export default router;
