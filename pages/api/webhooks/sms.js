import { supabaseAdmin } from '../../../lib/supabase';
import { sendText } from '../../../lib/twilio';
import { generateReply, summarizeLead } from '../../../lib/ai';

export default async function handler(req, res) {
  const twilioNumber = req.body.To;
  const customerPhone = req.body.From;
  const incomingText = req.body.Body;

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('twilio_number', twilioNumber)
    .single();

  if (!business) return res.status(200).send('<Response></Response>');

  let { data: lead } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('business_id', business.id)
    .eq('customer_phone', customerPhone)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!lead) {
    const { data: newLead } = await supabaseAdmin
      .from('leads')
      .insert({ business_id: business.id, customer_phone: customerPhone, message_log: [] })
      .select()
      .single();
    lead = newLead;
  }

  const updatedLog = [...(lead.message_log || []), { from: 'customer', text: incomingText, at: new Date().toISOString() }];

  const aiReply = await generateReply({ business, messageLog: updatedLog, latestMessage: incomingText });
  await sendText({ to: customerPhone, from: twilioNumber, body: aiReply });

  updatedLog.push({ from: 'business', text: aiReply, at: new Date().toISOString() });

  const summary = await summarizeLead({ business, messageLog: updatedLog });

  await supabaseAdmin
    .from('leads')
    .update({
      message_log: updatedLog,
      customer_name: summary.customer_name || lead.customer_name,
      notes: summary.summary || lead.notes,
      status: summary.status || lead.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lead.id);

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');
}
