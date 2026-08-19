import Head from 'next/head';

export default function Success() {
  return (
    <>
      <Head><title>Welcome to ReplyFlow</title></Head>
      <div className="wrap" style={{ padding: '100px 24px', textAlign: 'center', maxWidth: 600 }}>
        <div className="eyebrow" style={{ margin: '0 auto 20px', display: 'inline-flex' }}>
          <span className="dot"></span> You&apos;re in
        </div>
        <h1 style={{ marginBottom: 16 }}>Your free trial has started.</h1>
        <p style={{ color: '#8A8A8F', marginBottom: 32, lineHeight: 1.6 }}>
          Thanks for signing up. We&apos;ll reach out shortly to get your business connected —
          your Twilio number, your services and hours, and your first live test.
        </p>
        <a className="btn-primary" href="mailto:hello@replyflow.app?subject=Ready to get set up">Get set up now</a>
      </div>
    </>
  );
}
