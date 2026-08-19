import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>ReplyFlow</title>
      </Head>

      <nav>
        <div className="wrap nav-inner">
          <div className="brand"><div className="brand-mark">R</div><div className="brand-name">ReplyFlow</div></div>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#industries">Who it&apos;s for</a>
          </div>
          <a className="nav-cta" href="#pricing">Start free trial</a>
        </div>
      </nav>

      <div className="wrap hero">
        <div>
          <div className="eyebrow"><span className="dot"></span> Built for home service businesses</div>
          <h1>Never lose a customer to a <span>missed call</span> again.</h1>
          <p>When someone calls and you can&apos;t pick up, ReplyFlow texts them back instantly, answers their questions, and books the job — automatically.</p>
          <div className="hero-ctas">
            <a className="btn-primary" href="#pricing">Start your 14-day free trial</a>
            <a className="btn-ghost" href="#how">See how it works</a>
          </div>
          <div className="hero-note">$29/mo · no setup fee · cancel anytime</div>
        </div>

        <div className="phone-visual">
          <div className="top">Sarah M. · Mobile</div>
          <div className="missed">MISSED CALL · 12:41 PM</div>
          <div className="bubble out">Hey! Sorry we missed your call at Summit Roofing. What can we help with?</div>
          <div className="bubble in">Hi, I have a leak near my chimney</div>
          <div className="bubble out">Got it — I can get someone out this week. What&apos;s your address?</div>
        </div>
      </div>

      <div className="industries" id="industries">
        <div className="wrap">
          <div className="industries-label">Built for</div>
          <div className="industries-list">
            <span>Roofing ·</span> <span>HVAC ·</span> <span>Plumbing ·</span> <span>Landscaping ·</span> <span>Electrical ·</span> <span>Pest control ·</span> <span>Cleaning ·</span> Towing
          </div>
        </div>
      </div>

      <div className="wrap section" id="how">
        <div className="section-head">
          <div className="section-label">HOW IT WORKS</div>
          <h2>Four steps, zero extra work for you.</h2>
          <p>ReplyFlow runs quietly behind your existing phone number. Nothing about how customers reach you changes.</p>
        </div>
        <div className="steps-row">
          <div className="step-cell"><div className="n">01</div><b>Call comes in</b><p>A customer calls while you&apos;re on a job or with another customer.</p></div>
          <div className="step-cell"><div className="n">02</div><b>Auto-text sent</b><p>Within seconds, they get a friendly text in your business&apos;s name.</p></div>
          <div className="step-cell"><div className="n">03</div><b>AI takes over</b><p>It answers questions and collects what you need to quote the job.</p></div>
          <div className="step-cell"><div className="n">04</div><b>Lead lands in your dashboard</b><p>You see it, qualified and ready, with a suggested time to follow up.</p></div>
        </div>
      </div>

      <div className="wrap section" id="pricing">
        <div className="section-head">
          <div className="section-label">PRICING</div>
          <h2>One plan. Everything included.</h2>
          <p>No tiers to compare, no per-lead fees. Just a number that answers when you can&apos;t.</p>
        </div>
        <div className="pricing-card">
          <div className="price-top"><div className="amount">$29</div><div className="per">/ month</div></div>
          <div className="trial">First 14 days free</div>
          <ul>
            <li>Instant missed-call text-back</li>
            <li>AI that answers customer questions</li>
            <li>Automatic lead capture</li>
            <li>Appointment booking</li>
            <li>Full lead dashboard</li>
            <li>Cancel anytime</li>
          </ul>
          <a className="btn-primary" href="#">Start free trial</a>
        </div>
      </div>

      <div className="wrap">
        <div className="cta-band">
          <h2>Stop losing jobs to voicemail.</h2>
          <p>Set up takes one phone call. Most businesses are live the same day.</p>
          <a className="btn-primary" href="#pricing">Start your free trial</a>
        </div>
      </div>

      <footer>
        <div className="wrap foot-inner">
          <div>© 2026 ReplyFlow</div>
          <div className="foot-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
