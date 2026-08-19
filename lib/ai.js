import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReply({ business, messageLog, latestMessage }) {
  const history = messageLog
    .map(m => `${m.from === 'customer' ? 'Customer' : 'Business'}: ${m.text}`)
    .join('\n');

  const system = `You are the friendly front desk for ${business.name}, a local home service business.
Services offered: ${business.services || 'not specified'}
Service area: ${business.service_area || 'not specified'}
Hours: ${business.hours || 'not specified'}
FAQs: ${business.faqs || 'none provided'}

Your job on this text thread:
- Sound like a real, warm staff member, not a bot. Keep replies short (1-3 sentences), text-message style.
- Figure out what the customer needs.
- Collect their address/location and a good time to reach them or come by.
- Once you have enough info to book, confirm a next step (e.g. "someone will call you to confirm a time").
- Never make up pricing you weren't given. If asked something you don't know, say a team member will follow up.
- Do not mention you are an AI.`;

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    system,
    messages: [
      { role: 'user', content: `Conversation so far:\n${history}\n\nNew customer message: "${latestMessage}"\n\nReply as the business.` }
    ]
  });

  return msg.content.find(b => b.type === 'text')?.text?.trim() || "Thanks for reaching out — someone will follow up shortly!";
}

export async function summarizeLead({ business, messageLog }) {
  const history = messageLog.map(m => `${m.from}: ${m.text}`).join('\n');
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 150,
    system: 'Extract lead info from this text conversation. Respond ONLY with compact JSON: {"customer_name": string|null, "summary": string, "status": "new"|"qualified"|"booked"}. No other text.',
    messages: [{ role: 'user', content: history }]
  });
  const text = msg.content.find(b => b.type === 'text')?.text?.trim() || '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { customer_name: null, summary: '', status: 'new' };
  }
}
