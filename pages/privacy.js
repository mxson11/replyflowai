import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head><title>Privacy Policy — ReplyFlow</title></Head>
      <div className="wrap" style={{ padding: '60px 24px', maxWidth: 720 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 20 }}>Privacy Policy</h1>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7, marginBottom: 16 }}>
          ReplyFlow collects the phone numbers and messages of customers who text a business using our service,
          solely to provide missed-call text-back and lead management for that business. We do not sell customer
          data to third parties.
        </p>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7, marginBottom: 16 }}>
          Business account information (name, services, contact details) is used only to operate the ReplyFlow
          service for that business.
        </p>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7 }}>
          Questions? Contact us at <a href="mailto:hello@replyflow.app" style={{ color: '#00D97E' }}>hello@replyflow.app</a>.
        </p>
        <a href="/" style={{ color: '#00D97E', display: 'inline-block', marginTop: 32 }}>← Back home</a>
      </div>
    </>
  );
}
