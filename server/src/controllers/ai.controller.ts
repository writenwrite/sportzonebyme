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

// Smart fallback responses when Ollama is not available
function getSmartResponse(message: string, products: any[] = []): string {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|halo|hai|yo|oi|selamat|pagi|siang|sore|malam)/i.test(lower)) {
    return "Hello! Welcome to SportZone! 🏃‍♂️ I'm here to help you find the perfect sports gear. What are you looking for today?";
  }

  // Thanks
  if (/thank|thanks|terima kasih|makasih|thx|thanks ya|thank you/i.test(lower)) {
    return "You're welcome! 😊 Happy to help! Is there anything else you'd like to know?";
  }

  // Goodbye
  if (/^(bye|goodbye|dadah|see you|sampai jumpa|chau|ciao)/i.test(lower)) {
    return "Goodbye! 👋 Thanks for visiting SportZone. See you again soon!";
  }

  // ===== PRODUCTS =====
  // Outfit recommendation
  if (/outfit|padu.?padan|kombinasi|mix|match|gimana.*pakai|what.*wear|mau.*ke.*(?:party|kantor|gym|jalan|lari|olahraga)/i.test(lower)) {
    return "Here are some outfit ideas for you! 🎨\n\n🏃 **Running Outfit:**\n• UltraBoost Pro + ProRunner Jacket + SpeedElite Shorts\n• Total: ~$379.97\n\n💪 **Training Outfit:**\n• AeroFit Training Tee + FlexMove Leggings + PowerGrip Gloves\n• Total: ~$150.97\n\n🎒 **Casual Sporty:**\n• AeroFit Training Tee + Sport Classic Backpack\n• Total: ~$125.98\n\nWhich outfit interests you?";
  }

  // Running products
  if (/running|lari|jog|marathon|jogging|lari.?pagi|lari.?sore/i.test(lower)) {
    return "Great choice for running! 🏃\n\nOur top running gear:\n• **UltraBoost Pro** - $189.99 (Premium cushioning for daily runs)\n• **AeroRun Lite** - $149.99 (Lightweight racer for race day)\n• **SpeedElite Shorts** - $59.99 (Ultra-light with built-in brief)\n• **ProRunner Jacket** - $129.99 (Water-resistant for all weather)\n\nWant details on any of these?";
  }

  // Training/Gym
  if (/training|gym|workout|fitness|latihan|olahraga|angkat.*beban|yoga|pilates/i.test(lower)) {
    return "Perfect for your workouts! 💪\n\nTraining essentials:\n• **AeroFit Training Tee** - $45.99 (Breathable, moisture-wicking)\n• **FlexMove Leggings** - $69.99 (4-way stretch, comfy)\n• **PowerGrip Gloves** - $34.99 (Wrist support, grip pads)\n• **SpeedElite Shorts** - $59.99 (Ultra-light for cardio)\n\nNeed a complete training outfit?";
  }

  // Shoes
  if (/shoe|sneaker|sepatu|footwear/i.test(lower)) {
    return "Here are our shoes 👟:\n\n• **UltraBoost Pro** - $189.99 (Premium running shoe, responsive cushioning)\n• **AeroRun Lite** - $149.99 (Lightweight racer for speed)\n\nWhat size do you need?";
  }

  // Jacket
  if (/jacket|jaket|outer|rompi|vest/i.test(lower)) {
    return "Check out our jackets! 🧥\n\n• **ProRunner Jacket** - $129.99\n  Water-resistant with reflective details\n  Perfect for all-weather running\n\nWhat size do you need?";
  }

  // Pants/Leggings
  if (/pants|celana|legging|leggings|training.?pant/i.test(lower)) {
    return "Check out our pants! 👖\n\n• **FlexMove Leggings** - $69.99\n  4-way stretch, moisture management\n  Perfect for yoga, training, or casual wear\n\nWhat size do you need?";
  }

  // Shorts
  if (/shorts|celana.?pendek|short/i.test(lower)) {
    return "Check out our shorts! 🩳\n\n• **SpeedElite Running Shorts** - $59.99\n  Ultra-light with built-in brief\n  Reflective accents for visibility\n\nWhat size do you need?";
  }

  // T-shirt / Tee
  if (/shirt|tee|baju|kaos|t.?shirt|atasan/i.test(lower)) {
    return "Check out our tees! 👕\n\n• **AeroFit Training Tee** - $45.99\n  Lightweight, breathable\n  Moisture-wicking technology\n\nWhat size do you need?";
  }

  // Backpack
  if (/backpack|tas|rucksack|ransel|gym.?bag/i.test(lower)) {
    return "Check out our backpacks! 🎒\n\n• **Sport Classic Backpack** - $79.99\n  Durable with laptop compartment\n  Ventilated shoe pocket\n  Perfect for gym and travel\n\nWhat color do you prefer?";
  }

  // Gloves
  if (/gloves|sarung|tangan/i.test(lower)) {
    return "Check out our gloves! 🧤\n\n• **PowerGrip Training Gloves** - $34.99\n  Wrist support for heavy lifts\n  Silicone grip pads\n  Protect your hands during workouts\n\nWhat size do you need?";
  }

  // ===== SIZING =====
  if (/size|ukuran|besar|kecil|small|medium|large|fit|pas|longgar|sempit|size.?chart|panduan.*ukuran|ukurannya/i.test(lower)) {
    return "Our sizing guide 📏:\n\n**Clothing:**\n• XS: Chest 32-34\" / Waist 26-28\"\n• S: Chest 34-36\" / Waist 28-30\"\n• M: Chest 36-38\" / Waist 30-32\"\n• L: Chest 38-40\" / Waist 32-34\"\n• XL: Chest 40-42\" / Waist 34-36\"\n\n**Shoes (US):**\n• Men: 8, 9, 10, 11, 12, 13\n• Women: 6, 7, 8, 9, 10\n\nWhat product do you need sizing for?";
  }

  // ===== PRICE =====
  if (/price|harga|berapa|murah|expensive|budget|diskon|discount|sale|promo|how much|cost|bayar|termahal|termurah|harganya|cuma|mahal|nggak mahal|gak mahal|worth/i.test(lower)) {
    return "Our price range 💰:\n\n• **Accessories:** $34.99 - $79.99\n• **Clothing:** $45.99 - $159.99\n• **Shoes:** $149.99 - $189.99\n\n🔥 **Best deals:**\n• AeroFit Training Tee - $45.99 (was $55.99)\n• UltraBoost Pro - $189.99 (was $219.99)\n• AeroRun Lite - $149.99 (was $179.99)\n\n✅ Free shipping on orders over $100!";
  }

  // ===== SHIPPING =====
  if (/shipping|pengiriman|delivery|kirim|deliver|how long|berapa hari|berapa lama|lama.*kirim|kirim.*berapa|ontime|cepat|express|standard|gratis.*kirim|free.*ship/i.test(lower)) {
    return "Shipping info 🚚:\n\n• **Standard:** 5-7 business days - $9.99\n• **Express:** 2-3 business days - $19.99\n• **FREE shipping** on orders over $100!\n\nWe ship worldwide! Where would you like to ship?";
  }

  // ===== RETURNS =====
  if (/return|refund|kembali|tukar|exchange|balikin|retur|ganti.?barang|uang.*kembali|garansi|rusak|defect|cacat/i.test(lower)) {
    return "Return policy 📦:\n\n✅ **30-day return window**\n✅ Free returns for defective items\n✅ Original packaging required\n✅ Refund processed within 5-7 business days\n\n**How to return:**\n1. Login → My Orders\n2. Select order → Return Item\n3. Print return label\n4. Ship it back!\n\nNeed help with a return?";
  }

  // ===== STOCK =====
  if (/stock|stok|ada|tersedia|habis|kosong|ready|available|left|berapa.*stok|stok.*berapa/i.test(lower)) {
    if (products.length > 0) {
      const inStock = products.filter(p => p.stock > 0).slice(0, 5);
      if (inStock.length > 0) {
        const list = inStock.map(p => `• ${p.name} - ${p.stock} units available ($${p.price})`).join('\n');
        return `Here's what's in stock 📦:\n\n${list}\n\nAll items are ready to ship! Want to order?`;
      }
    }
    return "We have plenty of stock! 📦\n\nAll our products are available:\n• UltraBoost Pro - In stock\n• AeroFit Training Tee - In stock\n• ProRunner Jacket - In stock\n• SpeedElite Shorts - In stock\n• And more!\n\nWhat would you like to order?";
  }

  // ===== BRAND =====
  if (/brand|merek|merk|siapa.*brand|brand.*siapa|punya.*brand|brand.*apa|yang.*jual|yang.*jual/i.test(lower)) {
    return "We carry premium sports brands! 🏷️\n\n• **SportZone** - Our flagship brand (Best value!)\n• **Nike** - Classic athletic wear\n• **Adidas** - Performance gear\n• **Puma** - Stylish sportswear\n\nOur SportZone brand offers the best quality at affordable prices. Want to see products from a specific brand?";
  }

  // ===== CONTACT / SUPPORT =====
  if (/contact|support|help|bantuan|cs|customer.?service|hubungi|telepon|email|wa|whatsapp|telp|nomor|alamat|toko.*dimana|dimana.*toko|jam.*buka|buka.*jam/i.test(lower)) {
    return "Contact us 📞:\n\n📧 **Email:** support@sportzone.com\n📱 **WhatsApp:** +1-234-567-8900\n💬 **Live Chat:** Available here!\n⏰ **Hours:** Mon-Fri 9AM-6PM\n\nOur store is at: 123 Sports Street, Jakarta\n\nOr ask me anything here!";
  }

  // ===== ORDER =====
  if (/order|pesanan|status|track|lacak|dimana.*pesanan|pesanan.*dimana|sudah.*kirim|belum.*kirim|pengiriman.*status/i.test(lower)) {
    return "Check your order 📋:\n\n1. Login to your account\n2. Go to 'My Orders'\n3. Click on order for tracking info\n\nOr tell me your order number and I'll help!";
  }

  // ===== PAYMENT =====
  if (/pay|payment|bayar|cara.*bayar|transfer|credit.?card|visa|mastercard|gopay|ovo|dana|shopeepay|ewallet|tunai|cash/i.test(lower)) {
    return "Payment methods 💳:\n\n• Credit/Debit Card (Visa, Mastercard)\n• PayPal\n• Apple Pay / Google Pay\n• GoPay, OVO, DANA, ShopeePay\n\nAll payments are secure and encrypted! 🔒";
  }

  // ===== ACCOUNT =====
  if (/account|akun|login|register|sign.?up|daftar|masuk|keluar|logout|forgot.*password|lupa.*sandil|lupa.*password/i.test(lower)) {
    return "Account info 👤:\n\n• **Register:** Click 'Register' at top right\n• **Login:** Click 'Login' at top right\n• **Forgot password:** Click 'Forgot Password' on login page\n\nNeed help with your account?";
  }

  // ===== MATERIAL =====
  if (/material|fabric|bahan|katun|cotton|polyester|nylon|spandex|lembut|halus|adem|panas|nyaman/i.test(lower)) {
    return "Our materials 🧵:\n\n• **Cotton** - Soft, breathable (Tees)\n• **Polyester** - Moisture-wicking (Sportswear)\n• **Nylon** - Lightweight, durable (Shorts)\n• **Spandex** - Stretchy, flexible (Leggings)\n\nAll materials are high-quality and designed for performance!";
  }

  // ===== COLOR =====
  if (/color|colour|warna|black|white|red|blue|navy|hitam|putih|merah|biru|abu|grey|grey|pink|kuning|yellow|green|hijau|orange|ungu|purple/i.test(lower)) {
    return "Available colors 🎨:\n\n• **Black** - Classic, matches everything\n• **White** - Clean, fresh look\n• **Navy** - Professional, versatile\n• **Red** - Bold, energetic\n• **Grey** - Neutral, modern\n\nMost products come in multiple colors. What color are you looking for?";
  }

  // ===== DELIVERY LOCATION =====
  if (/kirim.*ke|ke.*mana|alamat.*kirim|delivery.*to|ship.*to|daerah|kota|kabupaten|provinsi|indonesia|luar.*negeri|international/i.test(lower)) {
    return "We ship worldwide! 🌍\n\n**Domestic (Indonesia):**\n• Standard: 3-5 days - Rp 25.000\n• Express: 1-2 days - Rp 50.000\n\n**International:**\n• Standard: 7-14 days\n• Express: 3-5 days\n\nWhere would you like us to ship?";
  }

  // ===== GENERIC PRODUCT SEARCH =====
  if (/product|find|search|show|look|cari|lihat|ada|jual|beli|mau|punya|apa.?aja|semua|all|everything/i.test(lower)) {
    if (products.length > 0) {
      const productList = products.slice(0, 5).map(p => 
        `• ${p.name} - $${p.price} (${p.category?.name || 'Sports'})`
      ).join('\n');
      return `Here are our products:\n\n${productList}\n\nWhat type of product are you looking for?`;
    }
    return "I can help you find products! We have:\n\n• 👟 Shoes (running, casual)\n• 👕 Clothing (tees, jackets, leggings)\n• 🎒 Accessories (backpacks, gloves)\n\nWhat are you looking for?";
  }

  // ===== DEFAULT - More helpful =====
  return "I can help you with:\n\n🛍️ **Products:** \"Show me shoes\" or \"ada sepatu apa\"\n📏 **Sizing:** \"What size for shoes?\"\n🚚 **Shipping:** \"How long is shipping?\"\n📦 **Returns:** \"How to return?\"\n💰 **Pricing:** \"How much?\" or \"harganya berapa?\"\n🎨 **Outfits:** \"Recommend an outfit\"\n📞 **Support:** \"Contact info\" atau \"alamat toko\"\n\nTry asking in English or Indonesian! 😊";
}

async function queryOllama(prompt: string, context: string = ''): Promise<string> {
  try {
    const systemPrompt = `You are SportZone AI Assistant, a helpful AI for a sports fashion e-commerce store.
You help customers find products, recommend outfits, answer FAQs about shipping/returns/sizing.
Be friendly, professional, and knowledgeable about sports fashion.
${context ? `\nContext: ${context}` : ''}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Ollama request failed');
    }

    const data = await response.json();
    return data.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    logger.info('Ollama not available, using smart fallback');
    return ''; // Return empty to trigger fallback
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
        context: '{}',
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
          context: '{}',
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
    const productKeywords = ['product', 'shoe', 'sneaker', 'shirt', 'jacket', 'pants', 'hat', 'find', 'search', 'recommend', 'show', 'running', 'training', 'gym'];
    const isProductQuery = productKeywords.some((kw) =>
      message.toLowerCase().includes(kw)
    );

    let context: ChatContext = {};
    let products: any[] = [];

    if (isProductQuery) {
      products = await prisma.product.findMany({
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

    // Query AI with fallback
    const conversationContext = conversationHistory
      .slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}Customer: ${message}`;

    let response = await queryOllama(fullPrompt, contextStr);
    
    // Use smart fallback if Ollama is not available
    if (!response) {
      response = getSmartResponse(message, products);
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: response,
        metadata: context.products ? JSON.stringify({ productIds: context.products.map((p) => p.id) }) : null,
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

    let advice = await queryOllama(prompt);
    
    // Smart fallback for styling advice
    if (!advice) {
      const casualOutfit = products.filter(p => ['AeroFit Training Tee', 'SpeedElite Running Shorts', 'Sport Classic Backpack'].includes(p.name));
      const runningOutfit = products.filter(p => ['UltraBoost Pro', 'ProRunner Jacket'].includes(p.name));
      const trainingOutfit = products.filter(p => ['FlexMove Leggings', 'PowerGrip Training Gloves', 'AeroFit Training Tee'].includes(p.name));
      
      const formatOutfit = (name: string, items: any[], occasion: string) => {
        const total = items.reduce((sum, p) => sum + p.price, 0);
        return `🏃 ${name} (${occasion})\nItems: ${items.map(p => p.name).join(', ')}\nTotal: $${total.toFixed(2)}\nWhy: Perfect combination for ${occasion.toLowerCase()} activities.`;
      };

      advice = `Here are my styling recommendations:\n\n${formatOutfit('Casual Sporty Look', casualOutfit.length ? casualOutfit : products.slice(0, 2), 'Everyday wear')}\n\n${formatOutfit('Running Essentials', runningOutfit.length ? runningOutfit : products.slice(0, 2), 'Running')}\n\n${formatOutfit('Gym Ready', trainingOutfit.length ? trainingOutfit : products.slice(0, 2), 'Training')}\n\nWould you like more details about any of these outfits?`;
    }

    res.json({
      status: 'success',
      data: { advice },
    });
  } catch (error) {
    next(error);
  }
};
