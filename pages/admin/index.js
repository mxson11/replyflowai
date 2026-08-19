import { useState, useEffect } from 'react';

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #26262A',
  background: '#141416', color: '#F5F5F3', fontSize: 14, marginBottom: 12, fontFamily: 'inherit',
};
const labelStyle = { fontSize: 12.5, color: '#8A8A8F', marginBottom: 5, display: 'block' };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState({
    name: '', twilio_number: '', forwarding_number: '',
    services: '', service_area: '', hours: '', faqs: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loginError, setLoginError] = useState('');

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

  function tryLogin() {
    localStorage.setItem('rf_admin_pw', password);
    setAuthed(true);
  }

  async function submitBusiness(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Client added — point their Twilio number's webhooks at your /api/webhooks/voice and /api/webhooks/sms URLs.");
      setForm({ name: '', twilio_number: '', forwarding_number: '', services: '', service_area: '', hours: '', faqs: '' });
      loadBusinesses();
    } else {
      const err = await res.json();
      setMessage('Error: ' + err.error);
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
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>ReplyFlow Admin</h1>
        <p style={{ color: '#8A8A8F', fontSize: 14, marginBottom: 32 }}>Add a new client and manage existing ones.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>Add a new client</h2>
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

              <button type="submit" disabled={saving} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#00D97E', color: '#04140D', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Add client'}
              </button>
              {message && <p style={{ fontSize: 13, color: '#00D97E', marginTop: 12 }}>{message}</p>}
            </form>
          </div>

          <div>
            <h2 style={{ fontSize: 16, marginBottom: 14 }}>Active clients ({businesses.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {businesses.length === 0 && <p style={{ color: '#8A8A8F', fontSize: 13.5 }}>No clients yet.</p>}
              {businesses.map(b => (
                <div key={b.id} style={{ border: '1px solid #26262A', borderRadius: 10, padding: 14, background: '#141416' }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: '#8A8A8F', marginTop: 3, fontFamily: 'monospace' }}>{b.twilio_number}</div>
                  {b.service_area && <div style={{ fontSize: 12.5, color: '#c9c9cc', marginTop: 6 }}>{b.service_area}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
