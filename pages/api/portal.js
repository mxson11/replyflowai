import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing access code' });

  const { data: business, error: bizErr } = await supabaseAdmin
    .from('businesses')
    .select('id, name, twilio_number, service_area')
    .eq('access_code', code)
    .single();

  if (bizErr || !business) return res.status(404).json({ error: 'Invalid link' });

  const { data: leads, error: leadsErr } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  if (leadsErr) return res.status(500).json({ error: leadsErr.message });

  res.status(200).json({ business, leads });
}
