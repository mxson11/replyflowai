import { supabaseAdmin } from '../../../lib/supabase';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default async function handler(req, res) {
  const twilioNumber = req.body.To;

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('twilio_number', twilioNumber)
    .single();

  const twiml = new VoiceResponse();

  if (!business || !business.forwarding_number) {
    twiml.say('Sorry, this number is not set up yet.');
    res.setHeader('Content-Type', 'text/xml');
    return res.send(twiml.toString());
  }

  const dial = twiml.dial({
    timeout: 18,
    action: `${process.env.APP_URL}/api/webhooks/voice-status?businessId=${business.id}&from=${encodeURIComponent(req.body.From)}`,
  });
  dial.number(business.forwarding_number);

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
