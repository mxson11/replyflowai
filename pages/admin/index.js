import { useState, useEffect } from 'react';

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #26262A',
  background: '#141416', color: '#F5F5F3', fontSize: 14, marginBottom: 12, fontFamily: 'inherit',
};
const labelStyle = { fontSize: 12.5, color: '#8A8A8F', marginBottom: 5, display: 'block' };
const emptyForm = { name: '', twilio_number: '', forwarding_number: '', services: '', service_area: '', hours: '', faqs: '' };
const badgeColors = { new: '#FF5C5C', qualified: '#00D97E', booked: '#F5F5F3', closed: '#8A8A8F' };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('rf_admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) loadBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function loadBusinesses() {
    try {
      const res = await fetch('/api/businesses', { headers: { 'x-admin-password': password } });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
        setLoginError('');
      } else if (res.status === 401) {
        setAuthed(false);
        localStorage.removeItem('rf_admin_pw');
        setLoginError('Wrong admin password.');
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError('Server error: ' + (err.error || res.status) + ' — check your Supabase env variables in Vercel.');
      }
    } catch (e) {
      setLoginError('Could not reach the server: ' + e.message);
    }
  }

  async function loadLeads(business) {
    setSelectedBiz(business);
    setLeadsLoading(true);
    setLeads([]);
    const res = await fetch(`/api/leads?businessId=${business.id}`, { headers: { 'x-admin-password': password } });
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    }
    setLeadsLoading(false);
  }

  function tryLogin() {
    localStorage.setItem('rf_admin_pw', password);
    setAuthed(true);
  }

  function startEdit(b) {
    setEditingId(b.id);
    setForm({
      name: b.name || '', twilio_number: b.twilio_number || '', forwarding_number: b.forwarding_number || '',
      services: b.services || '', service_area: b.service_area || '', hours: b.hours || '', faqs: b.faqs || '',
    });
    setSelectedBiz(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submitBusiness(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const url = editingId ? `/api/businesses/${editingId}` : '/api/businesses';
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMessage(editingId
        ? 'Client updated.'
        : "Client added — point their Twilio number's webhooks at your /api/webhooks/voice and /api/webhooks/sms URLs.");
      setForm(emptyForm);
      setEditingId(null);
      loadBusinesses();
    } else {
      const err = await res.json();
      setMessage('Error: ' + err.error);
    }
  }

  async function deleteBusiness(b) {
    if (!confirm(`Delete ${b.name}? This also deletes all of their leads. This can't be undone.`)) return;
    const res = await fetch(`/api/businesses/${b.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });
    if (res.ok) {
      loadBusinesses();
      if (selectedBiz?.id === b.id) setSelectedBiz(null);
    } else {
      const err = await res.json();
      alert('Error deleting: ' + err.error);
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F5F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: 320 }}>
          <h1 style={{ fontSize: 20, marginBottom: 16 }}>ReplyFlow Admin</h1>
          <input
            style={inputStyle}
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && tryLogin()}
          />
          <button
            onClick={tryLogin}
            style={{ width: '100%', padding: 12, borderRadius: 8, background: '#00D97E', color: '#04140D', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            Enter
          </button>
          {loginError && <p style={{ color: '#FF5C5C', fontSize: 13, marginTop: 14 }}>{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F5F5F3', fontFamily: 'system-ui, sans-serif', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>ReplyFlow Admin</h1>
        <p style={{ color: '#8A8A8F', fontSize: 14, marginBottom: 32 }}>Add, edit, and monitor your clients.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>{editingId ? 'Edit client' : 'Add a new client'}</h2>
            <form onSubmit={submitBusiness}>
              <label style={labelStyle}>Business name</label>
              <input style={inputStyle} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Summit Roofing Co" />

              <label style={labelStyle}>ReplyFlow Twilio number</label>
              <input style={inputStyle} required value={form.twilio_number} onChange={e => setForm({ ...form, twilio_number: e.target.value })} placeholder="+16145551234" />

              <label style={labelStyle}>Their real business number</label>
              <input style={inputStyle} value={form.forwarding_number} onChange={e => setForm({ ...form, forwarding_number: e.target.value })} placeholder="+16145559876" />

              <label style={labelStyle}>Services</label>
              <input style={inputStyle} value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} placeholder="Roof repair, gutter cleaning, siding" />

              <label style={labelStyle}>Service area</label>
              <input style={inputStyle} value={form.service_area} onChange={e => setForm({ ...form, service_area: e.target.value })} placeholder="Columbus, New Albany, Westerville" />

              <label style={labelStyle}>Hours</label>
              <input style={inputStyle} value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} placeholder="Mon-Fri 8am-5pm" />

              <label style={labelStyle}>FAQs / notes for the AI</label>
              <textarea style={{ ...inputStyle, minHeight: 90 }} value={form.faqs} onChange={e => setForm({ ...form, faqs: e.target.value })} placeholder="Free estimates. Financing available. Licensed & insured." />

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: 12, borderRadius: 8, background: '#00D97E', color: '#04140D', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add client'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} style={{ padding: '12px 18px', borderRadius: 8, background: 'transparent', border: '1px solid #26262A', color: '#F5F5F3', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
              {message && <p style={{ fontSize: 13, color: '#00D97E', marginTop: 12 }}>{message}</p>}
            </form>
          </div>

          <div>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>Active clients ({businesses.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {businesses.length === 0 && <p style={{ color: '#8A8A8F', fontSize: 13.5 }}>No clients yet.</p>}
              {businesses.map(b => (
                <div key={b.id} style={{ border: selectedBiz?.id === b.id ? '1px solid #00D97E' : '1px solid #26262A', borderRadius: 10, padding: 14, background: '#141416' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: '#8A8A8F', marginTop: 3, fontFamily: 'monospace' }}>{b.twilio_number}</div>
                      {b.service_area && <div style={{ fontSize: 12.5, color: '#c9c9cc', marginTop: 6 }}>{b.service_area}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => loadLeads(b)} style={{ fontSize: 11.5, padding: '6px 10px', borderRadius: 6, background: 'transparent', border: '1px solid #26262A', color: '#00D97E', cursor: 'pointer' }}>Leads</button>
                      <button onClick={() => startEdit(b)} style={{ fontSize: 11.5, padding: '6px 10px', borderRadius: 6, background: 'transparent', border: '1px solid #26262A', color: '#F5F5F3', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteBusiness(b)} style={{ fontSize: 11.5, padding: '6px 10px', borderRadius: 6, background: 'transparent', border: '1px solid #26262A', color: '#FF5C5C', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedBiz && (
              <div>
                <h2 style={{ fontSize: 16, marginBottom: 14 }}>Leads — {selectedBiz.name}</h2>
                {leadsLoading && <p style={{ color: '#8A8A8F', fontSize: 13.5 }}>Loading…</p>}
                {!leadsLoading && leads.length === 0 && <p style={{ color: '#8A8A8F', fontSize: 13.5 }}>No leads yet for this business.</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {leads.map(lead => (
                    <div key={lead.id} style={{ border: '1px solid #26262A', borderRadius: 10, padding: 14, background: '#141416' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.customer_name || lead.customer_phone}</div>
                        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 20, color: badgeColors[lead.status] || '#8A8A8F', border: `1px solid ${badgeColors[lead.status] || '#8A8A8F'}` }}>{lead.status}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#8A8A8F', fontFamily: 'monospace', marginBottom: 6 }}>{lead.customer_phone}</div>
                      {lead.notes && <div style={{ fontSize: 12.5, color: '#c9c9cc', marginBottom: 8 }}>{lead.notes}</div>}
                      {Array.isArray(lead.message_log) && lead.message_log.length > 0 && (
                        <div style={{ borderTop: '1px solid #26262A', paddingTop: 8, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {lead.message_log.map((m, i) => (
                            <div key={i} style={{ fontSize: 11.5, color: m.from === 'customer' ? '#F5F5F3' : '#00D97E' }}>
                              <b>{m.from === 'customer' ? 'Customer' : 'Business'}:</b> {m.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
