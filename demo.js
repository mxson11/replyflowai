import Head from 'next/head';
import { useState, useRef } from 'react';

export default function Demo() {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [showMissed, setShowMissed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [leadStage, setLeadStage] = useState(null); // null | 'new' | 'qualified' | 'booked'
  const [stats, setStats] = useState({ leads: 0, booked: 0, value: 0 });
  const runningRef = useRef(false);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function runDemo() {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    setMessages([]);
    setShowMissed(false);
    setLeadStage(null);
    setStats({ leads: 0, booked: 0, value: 0 });

    setStatus('call ringing…');
    setShowMissed(true);
    await sleep(1000);

    setStatus('sending auto-text');
    setTyping(true);
    await sleep(900);
    setTyping(false);
    setMessages(m => [...m, { dir: 'out', text: "Hey! Sorry we missed your call at Summit Roofing Co. What can we help you with?" }]);
    await sleep(1200);

    setStatus('customer replying');
    setTyping(true);
    await sleep(1000);
    setTyping(false);
    setMessages(m => [...m, { dir: 'in', text: "Hi, I have a leak near my chimney and need someone to look at it soon" }]);
    await sleep(1000);

    setStatus('AI qualifying lead');
    setTyping(true);
    await sleep(1000);
    setTyping(false);
    setMessages(m => [...m, { dir: 'out', text: "Sorry to hear that. I can get someone out this week — can I grab your address and a good time?" }]);
    await sleep(1100);

    setTyping(true);
    await sleep(900);
    setTyping(false);
    setMessages(m => [...m, { dir: 'in', text: "142 Birchwood Ln. Anytime after 3pm works" }]);
    await sleep(900);

    setStatus('lead captured');
    setLeadStage('new');
    setStats(s => ({ ...s, leads: s.leads + 1 }));
    await sleep(1100);
    setLeadStage('qualified');
    await sleep(900);

    setStatus('sending booking confirmation');
    setTyping(true);
    await sleep(900);
    setTyping(false);
    setMessages(m => [...m, { dir: 'out', text: "Perfect — you're set for Thursday 3:30 PM with Mike. We'll text a reminder before he heads over." }]);
    await sleep(1000);

    setLeadStage('booked');
    setStats(s => ({ ...s, booked: s.booked + 1, value: s.value + 4800 }));
    setStatus('lead recovered — done');
    setRunning(false);
    runningRef.current = false;
  }

  const badgeStyle = stage => ({
    fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
    background: stage === 'new' ? 'rgba(255,92,92,.15)' : stage === 'qualified' ? '#0B3B29' : 'rgba(255,255,255,.08)',
    color: stage === 'new' ? '#FF5C5C' : stage === 'qualified' ? '#00D97E' : '#F5F5F3',
  });

  return (
    <>
      <Head><title>ReplyFlow — Live Demo</title></Head>
      <div className="wrap" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
          <div className="brand-mark">R</div>
          <div className="brand-name">ReplyFlow</div>
        </div>

        <h1 style={{ marginBottom: 10 }}>You missed the call. <span>Your customer didn&apos;t have to be missed.</span></h1>
        <p style={{ color: '#8A8A8F', maxWidth: 600, marginBottom: 26 }}>
          This is exactly what happens the moment a customer&apos;s call goes unanswered. Hit the button to run the whole sequence live.
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
          <button
            onClick={runDemo}
            disabled={running}
            className="btn-primary"
            style={{ border: 'none', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.6 : 1 }}
          >
            Simulate a missed call
          </button>
          <span style={{ color: '#8A8A8F', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 22 }}>
          <div style={{ background: '#141416', border: '1px solid #26262A', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#8A8A8F', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>Customer&apos;s phone</div>
            <div style={{ background: '#000', border: '1px solid #2a2a2e', borderRadius: 22, padding: '14px 12px', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', color: '#8A8A8F', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", paddingBottom: 10, borderBottom: '1px solid #1f1f22', marginBottom: 12 }}>Sarah M. · Mobile</div>
              {showMissed && (
                <div style={{ background: 'rgba(255,92,92,.12)', border: '1px solid rgba(255,92,92,.35)', color: '#FF5C5C', fontSize: 12, padding: '7px 10px', borderRadius: 9, marginBottom: 12, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                  MISSED CALL · 12:41 PM
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    maxWidth: '82%', padding: '10px 13px', borderRadius: 16, fontSize: 13.5, lineHeight: 1.4,
                    alignSelf: m.dir === 'out' ? 'flex-end' : 'flex-start',
                    background: m.dir === 'out' ? '#00D97E' : '#232327',
                    color: m.dir === 'out' ? '#04140D' : '#F5F5F3',
                  }}>
                    {m.text}
                  </div>
                ))}
                {typing && (
                  <div style={{ alignSelf: 'flex-start', padding: '10px 13px', background: '#232327', borderRadius: 16, color: '#8A8A8F', fontSize: 12 }}>…</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ background: '#141416', border: '1px solid #26262A', borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 12, color: '#8A8A8F', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>Business dashboard — ReplyFlow</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 }}>
              <div style={{ background: '#1B1B1E', border: '1px solid #26262A', borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600 }}>{stats.leads}</div>
                <div style={{ fontSize: 11.5, color: '#8A8A8F' }}>Leads today</div>
              </div>
              <div style={{ background: '#1B1B1E', border: '1px solid #26262A', borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600 }}>{stats.booked}</div>
                <div style={{ fontSize: 11.5, color: '#8A8A8F' }}>Booked</div>
              </div>
              <div style={{ background: '#1B1B1E', border: '1px solid #26262A', borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: '#00D97E' }}>${stats.value.toLocaleString()}</div>
                <div style={{ fontSize: 11.5, color: '#8A8A8F' }}>Recovered value</div>
              </div>
            </div>

            {!leadStage && <div style={{ color: '#8A8A8F', fontSize: 13.5, padding: '40px 10px', textAlign: 'center', border: '1px dashed #26262A', borderRadius: 12 }}>No leads yet. Waiting for a missed call…</div>}

            {leadStage && (
              <div style={{ background: '#1B1B1E', border: '1px solid #26262A', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>Sarah M.</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: '#8A8A8F', marginTop: 2 }}>(614) 555-0142 · 142 Birchwood Ln</div>
                  </div>
                  <span style={badgeStyle(leadStage)}>{leadStage === 'new' ? 'New' : leadStage === 'qualified' ? 'Qualified' : 'Booked'}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#c9c9cc' }}>Roof leak near chimney. Requested service after 3 PM this week.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid #26262A' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#00D97E' }}>Est. job value: $4,800</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{ color: '#8A8A8F', fontSize: 12.5, marginTop: 30, textAlign: 'center' }}>
          This demo simulates the product experience. No real texts are sent. <a href="/" style={{ color: '#00D97E' }}>← Back to ReplyFlow</a>
        </p>
      </div>
    </>
  );
}
