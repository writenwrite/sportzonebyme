import { Router } from 'express';
import {
  createChatSession,
  sendMessage,
  getChatHistory,
  getStylingAdvice,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/chat', createChatSession);
router.post('/chat/message', sendMessage);
router.get('/chat/:sessionId', getChatHistory);
router.post('/styling-advice', getStylingAdvice);

export default router;
