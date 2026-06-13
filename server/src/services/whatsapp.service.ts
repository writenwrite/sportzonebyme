import { logger } from '../utils/logger';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

interface WhatsAppMessage {
  to: string;
  template: string;
  parameters?: Record<string, string>;
}

export const sendWhatsAppMessage = async (
  to: string,
  message: string
): Promise<boolean> => {
  try {
    if (!WHATSAPP_API_URL || !WHATSAPP_TOKEN) {
      logger.info(`[WhatsApp] Message to ${to}: ${message}`);
      return true;
    }

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });

    if (!response.ok) {
      throw new Error('WhatsApp API error');
    }

    logger.info(`WhatsApp message sent to ${to}`);
    return true;
  } catch (error) {
    logger.error('WhatsApp send error:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (
  phone: string,
  orderNumber: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
): Promise<boolean> => {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity} - $${item.price}`)
    .join('\n');

  const message = `
🎉 *Order Confirmed!*

*Order Number:* ${orderNumber}

*Items:*
${itemsList}

*Total:* $${total.toFixed(2)}

Thank you for shopping with SportZone! 🏃‍♂️

Track your order: https://sportzone.com/orders/${orderNumber}
`.trim();

  return sendWhatsAppMessage(phone, message);
};

export const sendShippingUpdate = async (
  phone: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string,
  carrier?: string
): Promise<boolean> => {
  let message = `
📦 *Shipping Update*

*Order Number:* ${orderNumber}
*Status:* ${status}
`.trim();

  if (trackingNumber && carrier) {
    message += `
*Tracking Number:* ${trackingNumber}
*Carrier:* ${carrier}

Track here: https://track.${carrier.toLowerCase()}.com/${trackingNumber}
`;
  }

  return sendWhatsAppMessage(phone, message);
};

export const sendDeliveryConfirmation = async (
  phone: string,
  orderNumber: string
): Promise<boolean> => {
  const message = `
✅ *Delivered!*

Your order *${orderNumber}* has been delivered!

We hope you enjoy your new gear from SportZone. 🏆

Rate your experience: https://sportzone.com/review/${orderNumber}
`.trim();

  return sendWhatsAppMessage(phone, message);
};
