import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendText({ to, from, body }) {
  return client.messages.create({ to, from, body });
}
