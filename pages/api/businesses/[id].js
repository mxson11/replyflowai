import { supabaseAdmin } from '../../../lib/supabase';
import { requireAdmin } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { name, twilio_number, forwarding_number, services, service_area, hours, faqs } = req.body;
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .update({ name, twilio_number, forwarding_number, services, service_area, hours, faqs })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ business: data });
  }

  if (req.method === 'DELETE') {
    // Deletes the business AND all its leads (set up that way in the database schema)
    const { error } = await supabaseAdmin.from('businesses').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ deleted: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
