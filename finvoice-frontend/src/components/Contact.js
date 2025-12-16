import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual contact form submission
    setStatus('success');
    setTimeout(() => {
      setStatus('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1>Contact Us</h1>
        <p className="legal-subtitle">We'd love to hear from you</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <p>
            Have questions, feedback, or need support? Our team is here to help you make the most of FinVoiceAI.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email Support</h3>
                <p>support@finvoiceai.com</p>
                <span className="response-time">Response within 24 hours</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">💬</div>
              <div>
                <h3>General Inquiries</h3>
                <p>hello@finvoiceai.com</p>
                <span className="response-time">For partnerships and media</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">🔒</div>
              <div>
                <h3>Privacy & Legal</h3>
                <p>legal@finvoiceai.com</p>
                <span className="response-time">Privacy and compliance matters</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Office Address</h3>
                <p>FinVoiceAI</p>
                <p>India</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#twitter" className="social-icon">🐦 Twitter</a>
              <a href="#linkedin" className="social-icon">💼 LinkedIn</a>
              <a href="#github" className="social-icon">💻 GitHub</a>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing & Subscriptions</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Report a Bug</option>
                <option value="feedback">General Feedback</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows="6"
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>

            {status === 'success' && (
              <div className="contact-success">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <p>Go to the login page and click "Forgot Password". Follow the instructions sent to your email.</p>
          </div>

          <div className="faq-item">
            <h3>Can I export my financial data?</h3>
            <p>Yes! Premium users can export data as PDF or Excel from the Balance Sheet page.</p>
          </div>

          <div className="faq-item">
            <h3>Is my financial data secure?</h3>
            <p>Absolutely. We use bank-level encryption (AES-256) and never share your data with third parties.</p>
          </div>

          <div className="faq-item">
            <h3>How does the AI voice assistant work?</h3>
            <p>Simply speak naturally about your transactions. Our AI understands context and categorizes them automatically.</p>
          </div>

          <div className="faq-item">
            <h3>Can I cancel my subscription anytime?</h3>
            <p>Yes, you can cancel anytime from your profile settings. No questions asked.</p>
          </div>

          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>Yes! We offer a 30-day money-back guarantee on all paid plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
