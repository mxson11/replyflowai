import { randomBytes } from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase';
import { requireAdmin } from '../../../lib/adminAuth';

function generateAccessCode() {
  return randomBytes(6).toString('hex'); // e.g. "a1b2c3d4e5f6"
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ businesses: data });
  }

  if (req.method === 'POST') {
    const { name, twilio_number, forwarding_number, services, service_area, hours, faqs } = req.body;

    if (!name || !twilio_number) {
      return res.status(400).json({ error: 'name and twilio_number are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .insert({ name, twilio_number, forwarding_number, services, service_area, hours, faqs, access_code: generateAccessCode() })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ business: data });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
