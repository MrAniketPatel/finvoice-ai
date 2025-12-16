import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="legal-subtitle">Last updated: January 2025</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>
            At FinVoiceAI, we take your privacy seriously. We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
            <li><strong>Financial Data:</strong> Income, expenses, and transaction details you input into the system</li>
            <li><strong>Voice Data:</strong> Audio recordings when you use our AI voice assistant (processed and not stored)</li>
            <li><strong>Usage Information:</strong> How you interact with our services, features used, and preferences</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our financial management services</li>
            <li>Process your transactions and generate financial reports</li>
            <li>Send you alerts, reminders, and important notifications</li>
            <li>Provide AI-powered insights and recommendations</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal and financial information:
          </p>
          <ul>
            <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest (AES-256)</li>
            <li><strong>Authentication:</strong> Secure JWT-based authentication with bcrypt password hashing</li>
            <li><strong>Access Control:</strong> Strict access controls and regular security audits</li>
            <li><strong>Monitoring:</strong> 24/7 monitoring for suspicious activities and potential breaches</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
            <li><strong>Service Providers:</strong> With trusted third-party services that help us operate (e.g., cloud hosting, payment processing)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Export:</strong> Download your financial data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide services. You can request deletion at any time through your profile settings.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Children's Privacy</h2>
          <p>
            FinVoiceAI is not intended for users under 18 years of age. We do not knowingly collect information from children.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through the application.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> privacy@finvoiceai.com</p>
            <p><strong>Address:</strong> FinVoiceAI, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
