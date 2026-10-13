import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, MessageCircle, Search, Zap, Award } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper" style={{ paddingTop: '72px' }}>
      {/* Hero */}
      <section className="landing-hero">
        <div className="container">
          <div className="landing-hero-content">
            <div className="landing-hero-badge">
              <Sparkles size={14} /> The Future of Freelancing
            </div>
            <h1>
              Find Top Talent &<br />
              <span className="gradient-text">Get Work Done</span>
            </h1>
            <p className="landing-hero-desc">
              FreelanceHub connects skilled professionals with innovative projects.
              Whether you're hiring or looking for your next gig, we make it seamless.
            </p>
            <div className="landing-hero-actions">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
                  <Link to="/projects" className="btn btn-secondary btn-lg">Browse Projects</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
                  <Link to="/projects" className="btn btn-secondary btn-lg">Browse Projects</Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '10K+', label: 'Freelancers' },
              { num: '5K+', label: 'Projects Posted' },
              { num: '98%', label: 'Satisfaction Rate' },
              { num: '$2M+', label: 'Paid to Freelancers' },
            ].map((s, i) => (
              <div key={i} className={`glass-card stat-card animate-fade-in-up stagger-${i + 1}`}>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="container">
          <div className="landing-features-header">
            <h2>Everything You Need</h2>
            <p>Powerful tools to connect clients and freelancers in one unified platform</p>
          </div>
          <div className="features-grid">
            {[
              { icon: <Search size={24} />, cls: 'feature-icon-blue', title: 'Smart Project Matching', desc: 'Browse and search projects by skills, budget, and category to find the perfect fit.' },
              { icon: <Shield size={24} />, cls: 'feature-icon-purple', title: 'Secure Payments', desc: 'Protected transactions with milestone-based payments for peace of mind.' },
              { icon: <MessageCircle size={24} />, cls: 'feature-icon-emerald', title: 'Real-time Messaging', desc: 'Built-in chat to communicate directly with clients or freelancers.' },
              { icon: <Zap size={24} />, cls: 'feature-icon-amber', title: 'Fast Proposals', desc: 'Submit detailed proposals with bids and timelines in just seconds.' },
              { icon: <Award size={24} />, cls: 'feature-icon-rose', title: 'Verified Profiles', desc: 'Showcase your skills, portfolio, and experience to stand out.' },
              { icon: <Sparkles size={24} />, cls: 'feature-icon-cyan', title: 'Smart Dashboard', desc: 'Track projects, proposals, and earnings all in one place.' },
            ].map((f, i) => (
              <div key={i} className={`glass-card feature-card animate-fade-in-up stagger-${i + 1}`}>
                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <div className="glass-card landing-cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of freelancers and clients already using FreelanceHub.</p>
            <div className="landing-hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/projects" className="btn btn-secondary btn-lg">Explore Projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
