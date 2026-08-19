import { supabaseAdmin } from '../../../lib/supabase';
import { sendText } from '../../../lib/twilio';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default async function handler(req, res) {
  const { businessId, from } = req.query;
  const dialCallStatus = req.body.DialCallStatus;

  const twiml = new VoiceResponse();

  if (dialCallStatus !== 'completed') {
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (business) {
      const firstText = `Hey! Sorry we missed your call at ${business.name}. What can we help you with?`;

      await sendText({ to: from, from: business.twilio_number, body: firstText });

      await supabaseAdmin.from('leads').insert({
        business_id: business.id,
        customer_phone: from,
        status: 'new',
        message_log: [{ from: 'business', text: firstText, at: new Date().toISOString() }],
      });
    }
    twiml.hangup();
  } else {
    twiml.hangup();
  }

  res.setHeader('Content-Type', 'text/xml');
  res.send(twiml.toString());
}
