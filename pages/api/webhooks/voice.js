// This webhook fires when a call reaches the Twilio number.
// In this setup, the customer calls the business's REAL number as always.
// If nobody answers, the phone carrier itself forwards the unanswered call
// here (via "conditional call forwarding" set up on the business's real
// phone) - so by the time this code runs, we already know it was missed.
// No need to dial anywhere again - just send the text immediately.

import { supabaseAdmin } from '../../../lib/supabase';
import { sendText } from '../../../lib/twilio';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default async function handler(req, res) {
  const twilioNumber = req.body.To;
  const callerNumber = req.body.From;

  const twiml = new VoiceResponse();

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('twilio_number', twilioNumber)
    .single();

  if (business) {
    const firstText = `Hey! Sorry we missed your call at ${business.name}. What can we help you with?`;

    await sendText({ to: callerNumber, from: business.twilio_number, body: firstText });

    await supabaseAdmin.from('leads').insert({
      business_id: business.id,
      customer_phone: callerNumber,
      status: 'new',
      message_log: [{ from: 'business', text: firstText, at: new Date().toISOString() }],
    });
  }

  // End the call politely - the text is already on its way
  twiml.say("Thanks for calling. We're texting you right now.");
  twiml.hangup();

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
