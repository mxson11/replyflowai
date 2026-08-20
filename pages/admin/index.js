import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const badgeColors = { new: '#FF5C5C', qualified: '#00D97E', booked: '#F5F5F3', closed: '#8A8A8F' };

export default function ClientDashboard() {
  const router = useRouter();
  const { code } = router.query;
  const [business, setBusiness] = useState(null);
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound

  useEffect(() => {
    if (!code) return;
    fetch(`/api/portal?code=${code}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => {
        setBusiness(data.business);
        setLeads(data.leads || []);
        setStatus('ok');
      })
      .catch(() => setStatus('notfound'));
  }, [code]);

  if (status === 'loading') {
    return <div style={{ minHeight: '100vh', background: '#0B0B0C' }} />;
  }

  if (status === 'notfound') {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F5F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#8A8A8F' }}>This link isn&apos;t valid. Contact ReplyFlow for your dashboard link.</p>
      </div>
    );
  }

  return (
    <>
      <Head><title>{business.name} — ReplyFlow</title></Head>
      <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F5F5F3', fontFamily: 'system-ui, sans-serif', padding: '32px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: '#00D97E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#04140D', fontSize: 13 }}>R</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#8A8A8F' }}>ReplyFlow</div>
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>{business.name}</h1>
          <p style={{ color: '#8A8A8F', fontSize: 14, marginBottom: 32 }}>Your leads, captured automatically from missed calls.</p>

          {leads.length === 0 && (
            <div style={{ color: '#8A8A8F', fontSize: 13.5, padding: '40px 10px', textAlign: 'center', border: '1px dashed #26262A', borderRadius: 12 }}>
              No leads yet. As soon as a customer calls and you can&apos;t pick up, they&apos;ll show up here.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leads.map(lead => (
              <div key={lead.id} style={{ border: '1px solid #26262A', borderRadius: 12, padding: 16, background: '#141416' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{lead.customer_name || lead.customer_phone}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 20, color: badgeColors[lead.status] || '#8A8A8F', border: `1px solid ${badgeColors[lead.status] || '#8A8A8F'}` }}>{lead.status}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#8A8A8F', fontFamily: 'monospace', marginBottom: 8 }}>{lead.customer_phone}</div>
                {lead.notes && <div style={{ fontSize: 13, color: '#c9c9cc', marginBottom: 10 }}>{lead.notes}</div>}
                {Array.isArray(lead.message_log) && lead.message_log.length > 0 && (
                  <div style={{ borderTop: '1px solid #26262A', paddingTop: 10, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {lead.message_log.map((m, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: m.from === 'customer' ? '#F5F5F3' : '#00D97E' }}>
                        <b>{m.from === 'customer' ? 'Customer' : 'You'}:</b> {m.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
