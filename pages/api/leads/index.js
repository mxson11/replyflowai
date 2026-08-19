import { supabaseAdmin } from '../../../lib/supabase';
import { requireAdmin } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  const { businessId } = req.query;
  if (!businessId) return res.status(400).json({ error: 'businessId required' });

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ leads: data });
}
