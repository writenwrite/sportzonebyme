import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const AI_MODEL = process.env.AI_MODEL || 'llama3.2';

interface ChatContext {
  products?: any[];
  userPreferences?: any;
  conversationHistory?: { role: string; content: string }[];
}

async function queryOllama(prompt: string, context: string = ''): Promise<string> {
  try {
    const systemPrompt = `You are SportZone AI Assistant, a helpful AI for a sports fashion e-commerce store.
You help customers find products, recommend outfits, answer FAQs about shipping/returns/sizing.
Be friendly, professional, and knowledgeable about sports fashion.
${context ? `\nContext: ${context}` : ''}`;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama request failed');
    }

    const data = await response.json();
    return data.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    logger.error('Ollama query error:', error);
    return 'AI service is temporarily unavailable. Please try again later.';
  }
}

export const createChatSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = uuidv4();

    const session = await prisma.chatSession.create({
      data: {
        userId: req.user?.id || null,
        sessionId,
        context: {},
      },
    });

    res.status(201).json({
      status: 'success',
      data: { sessionId: session.sessionId },
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, message } = req.body;

    let session = await prisma.chatSession.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: req.user?.id || null,
          sessionId,
          context: {},
        },
        include: { messages: true },
      });
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
      },
    });

    // Get product context if relevant
    const productKeywords = ['product', 'shoe', 'sneaker', 'shirt', 'jacket', 'pants', 'hat', 'find', 'search', 'recommend', 'show'];
    const isProductQuery = productKeywords.some((kw) =>
      message.toLowerCase().includes(kw)
    );

    let context: ChatContext = {};

    if (isProductQuery) {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
        },
        take: 20,
      });

      context.products = products;
    }

    // Build conversation history
    const conversationHistory = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create context string
    let contextStr = '';
    if (context.products) {
      contextStr += 'Available products: ' +
        context.products
          .map(
            (p) =>
              `${p.name} - $${p.price} - ${p.category.name} - ${p.description.slice(0, 100)}`
          )
          .join('\n');
    }

    // Query AI
    const conversationContext = conversationHistory
      .slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}Customer: ${message}`;

    const response = await queryOllama(fullPrompt, contextStr);

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: response,
        metadata: context.products ? { productIds: context.products.map((p) => p.id) } : null,
      },
    });

    res.json({
      status: 'success',
      data: {
        message: response,
        sessionId: session.sessionId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      return res.json({ status: 'success', data: { messages: [] } });
    }

    res.json({
      status: 'success',
      data: { messages: session.messages },
    });
  } catch (error) {
    next(error);
  }
};

export const getStylingAdvice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { occasion, style, budget } = req.body;

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true } },
      },
      take: 30,
    });

    const productList = products
      .map(
        (p) =>
          `${p.name} ($${p.price}) - ${p.category.name} - ${p.description.slice(0, 80)}`
      )
      .join('\n');

    const prompt = `As a fashion advisor for SportZone, suggest 3 complete outfit combinations based on:
Occasion: ${occasion || 'casual'}
Style: ${style || 'sporty'}
Budget: ${budget ? `$${budget}` : 'flexible'}

Available products:
${productList}

For each outfit, provide:
1. The items to combine
2. Why they work together
3. Total price

Be creative and fashion-forward.`;

    const advice = await queryOllama(prompt);

    res.json({
      status: 'success',
      data: { advice },
    });
  } catch (error) {
    next(error);
  }
};
