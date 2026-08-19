import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head><title>Terms of Service — ReplyFlow</title></Head>
      <div className="wrap" style={{ padding: '60px 24px', maxWidth: 720 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 20 }}>Terms of Service</h1>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7, marginBottom: 16 }}>
          ReplyFlow is billed at $29/month with a 14-day free trial. You may cancel at any time; access continues
          through the end of the current billing period.
        </p>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7, marginBottom: 16 }}>
          ReplyFlow automates text responses to missed calls on your behalf. You are responsible for the accuracy
          of the business information (services, hours, pricing) you provide, since this is what customer-facing
          replies are based on.
        </p>
        <p style={{ color: '#8A8A8F', lineHeight: 1.7 }}>
          Questions? Contact us at <a href="mailto:hello@replyflow.app" style={{ color: '#00D97E' }}>hello@replyflow.app</a>.
        </p>
        <a href="/" style={{ color: '#00D97E', display: 'inline-block', marginTop: 32 }}>← Back home</a>
      </div>
    </>
  );
}
