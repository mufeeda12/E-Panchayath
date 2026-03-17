import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-flag">
          <span className="flag-stripe flag-saffron" />
          <span className="flag-stripe flag-white" />
          <span className="flag-stripe flag-green" />
        </div>
        <h1 className="home-hero-title">Your Voice, Your Village</h1>
        <p className="home-hero-subtitle">
          Register civic complaints directly with Gram Panchayat.<br />
          Track progress, get updates, and help build a better community.
        </p>
        <div className="home-hero-cta">
          <Link to="/register" className="home-btn-primary">
            Register as Citizen
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/login" className="home-btn-outline">
            Already Registered? Login
          </Link>
        </div>
      </section>
      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="home-section home-section-alt">
        <div className="home-section-header">
          <h2 className="home-section-title">How It Works</h2>
          <p className="home-section-subtitle">A simple, transparent process to report and resolve civic issues in your village.</p>
        </div>

        <div className="home-features">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="home-feature-title">Location-Based Complaints</h3>
            <p className="home-feature-desc">Pin exact locations on the map for faster issue resolution by panchayat officials.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h3 className="home-feature-title">Track Your Complaints</h3>
            <p className="home-feature-desc">Monitor status updates from submission to resolution in real-time.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="home-feature-title">Transparent Governance</h3>
            <p className="home-feature-desc">Direct communication channel between citizens and local government.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="home-feature-title">Community Driven</h3>
            <p className="home-feature-desc">Join fellow citizens in improving village infrastructure and services.</p>
          </div>
        </div>
      </section>

      {/* ── 3-Step Process ─────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Simple 3-Step Process</h2>
          <p className="home-section-subtitle">From complaint to resolution — clear, fast, and accountable.</p>
        </div>

        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-number home-step-1">1</div>
            <div className="home-step-connector" />
            <h3 className="home-step-title">Register &amp; Login</h3>
            <p className="home-step-desc">Create your citizen account with basic details and mobile verification.</p>
          </div>
          <div className="home-step">
            <div className="home-step-number home-step-2">2</div>
            <div className="home-step-connector" />
            <h3 className="home-step-title">Report Issue</h3>
            <p className="home-step-desc">Pin location on map, describe the problem, and upload photos.</p>
          </div>
          <div className="home-step">
            <div className="home-step-number home-step-3">3</div>
            <h3 className="home-step-title">Track Resolution</h3>
            <p className="home-step-desc">Get real-time updates as your complaint moves through the system.</p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="home-cta-banner">
        <h2 className="home-cta-title">Ready to Make a Difference?</h2>
        <p className="home-cta-subtitle">Join thousands of citizens working together to improve your Panchayat.</p>
        <Link to="/register" className="home-cta-btn">Get Started Now</Link>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="home-footer-top">
          <div className="home-footer-brand">
            <div className="home-footer-logo">🏛️</div>
            <div>
              <div className="home-footer-name">Gram Panchayat</div>
              <div className="home-footer-location">Alappuzha, Kerala</div>
            </div>
          </div>
          <p className="home-footer-tagline">Empowering citizens through digital governance for a better tomorrow.</p>
        </div>

        <div className="home-footer-links-row">
          <div className="home-footer-col">
            <div className="home-footer-col-title">Quick Links</div>
            <Link to="/login" className="home-footer-link">Citizen Login</Link>
            <Link to="/register" className="home-footer-link">New Registration</Link>
            <Link to="/complaints" className="home-footer-link">Track Complaint</Link>
            <Link to="/contact" className="home-footer-link">Contact Us</Link>
          </div>
          <div className="home-footer-col">
            <div className="home-footer-col-title">Contact</div>
            <div className="home-footer-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              1800-XXX-XXXX (Toll Free)
            </div>
            <div className="home-footer-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Gram Panchayat Office<br />Main Road, Alappuzha<br />Kerala
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          <div className="home-footer-powered">
            <span>🇮🇳</span>
            <span>Powered by Digital India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}