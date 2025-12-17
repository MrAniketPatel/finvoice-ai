import React, { useEffect } from "react";
import "../Landing.css";

function Landing({ onGetStarted, onLogin, onNavigate }) {
  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge reveal">✨ AI-Powered Finance Management</div>
          <h1 className="hero-title reveal">
            Reimagine the way
            <br />
            you see <span className="gradient-text">your money</span>
          </h1>
          <p className="hero-subtitle reveal">
            FinVoiceAI turns financial chaos into clarity. Track income,
            expenses, and invoices — all powered by intelligence.
          </p>
          <div className="hero-buttons reveal">
            <button className="cta-button" onClick={onGetStarted}>
              Get Started — It's Free
            </button>
            <button 
              className="cta-button-secondary" 
              onClick={onLogin}
              style={{
                background: 'white',
                color: 'var(--navy-blue)',
                border: '2px solid var(--navy-blue)',
              }}
            >
              Login
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">💰</div>
            <div className="card-text">
              <div className="card-label">Total Income</div>
              <div className="card-value">₹97,000</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📊</div>
            <div className="card-text">
              <div className="card-label">Balance</div>
              <div className="card-value">₹42,000</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🔔</div>
            <div className="card-text">
              <div className="card-label">Due Soon</div>
              <div className="card-value">3 Payments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - The Problem */}
      <section className="story-section problem-section">
        <div className="story-content reveal">
          <h2 className="story-title">Managing money shouldn't feel like juggling chaos.</h2>
          <p className="story-text">
            Spreadsheets overflow. Receipts go missing. Numbers lose meaning.
            <br />
            <br />
            You're left wondering where your money went, what's due next, and
            whether you're actually ahead or behind.
          </p>
        </div>
      </section>

      {/* Story Section - The Transformation */}
      <section className="story-section transformation-section">
        <div className="story-content reveal">
          <h2 className="story-title">Then came FinVoiceAI — a voice that understands your story.</h2>
          <p className="story-text">
            Record your income. Track your expenses. Set reminders.
            <br />
            <br />
            Let AI do the heavy lifting while you focus on what matters —
            building the life you want, not just tracking it.
          </p>
        </div>
      </section>

      {/* Story Section - The Clarity */}
      <section className="story-section clarity-section">
        <div className="story-content reveal">
          <h2 className="story-title">Every balance, every bill, every insight — right where it belongs.</h2>
          <p className="story-text">
            Finance made human. Effortless. Intelligent.
            <br />
            <br />
            This is clarity. This is control. This is FinVoiceAI.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header reveal">
          <h2 className="section-title">Smarter tools, simpler workflows</h2>
          <p className="section-subtitle">
            Everything you need to take control of your financial story
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">🧾</div>
            <h3>AI-Powered Dashboard</h3>
            <p>
              Real-time insights that adapt to you. See your financial health
              at a glance, with intelligence that learns your patterns.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🎙️</div>
            <h3>Voice Commands</h3>
            <p>
              Add or check entries hands-free. Just speak naturally, and
              FinVoiceAI understands what you need.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">📈</div>
            <h3>Balance Sheet Generator</h3>
            <p>
              View your finances across any timeframe — 1 week, 1 month, 6
              months, or yearly. Your data, your way.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">⏰</div>
            <h3>Payable Alerts</h3>
            <p>
              Never miss a rent, loan, or bill. Smart reminders keep you ahead
              of deadlines, not chasing them.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">👤</div>
            <h3>Personal Profiles</h3>
            <p>
              Whether you're a student, freelancer, or business owner —
              FinVoiceAI fits your world, not the other way around.
            </p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Your data is protected with industry-standard encryption. Your
              money, your privacy, your peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header reveal">
          <h2 className="section-title">Your journey to clarity starts here</h2>
          <p className="section-subtitle">Three simple steps to financial freedom</p>
        </div>

        <div className="steps-container">
          <div className="step reveal">
            <div className="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>
              Sign up in seconds. No credit card required, no complicated
              forms. Just you and your financial future.
            </p>
          </div>

          <div className="step-connector"></div>

          <div className="step reveal">
            <div className="step-number">2</div>
            <h3>Add Your Transactions</h3>
            <p>
              Start tracking effortlessly. Type, speak, or import — however you
              work, FinVoiceAI adapts.
            </p>
          </div>

          <div className="step-connector"></div>

          <div className="step reveal">
            <div className="step-number">3</div>
            <h3>Get Insights</h3>
            <p>
              Watch your financial clarity improve. Smart analytics reveal
              patterns, opportunities, and peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial-style Section */}
      <section className="testimonial-section">
        <div className="testimonial-content reveal">
          <p className="testimonial-quote">
            "Because finance should speak your language."
          </p>
          <p className="testimonial-author">— The FinVoiceAI Promise</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content reveal">
          <h2>Finance, simplified. Your story, powered by FinVoiceAI.</h2>
          <p>
            Join thousands who've transformed their relationship with money.
            Start your journey today.
          </p>
          <button className="cta-button-secondary" onClick={onGetStarted}>
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p className="footer-tagline">Your voice. Your data. Your control.</p>
          <p className="footer-copyright">
            © 2025 FinVoiceAI — Intelligent Finance Management
          </p>
          <div className="footer-links">
            <button onClick={() => onNavigate && onNavigate('privacy')}>Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('terms')}>Terms of Service</button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('contact')}>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
