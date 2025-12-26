import React, { useEffect } from "react";

function PremiumModal({ isOpen, onClose, feature, requiredPlan }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const planDetails = {
    quarterly: {
      name: "Quarterly Plan",
      price: "₹399",
      period: "3 months",
      features: ["550 transactions", "AI Voice Assistant", "Advanced Reports", "Priority Support"]
    },
    yearly: {
      name: "Yearly Plan",
      price: "₹1,499",
      period: "year",
      features: ["Unlimited transactions", "GPT-3.5 AI Insights", "AI Voice Assistant", "Advanced Analytics", "Priority Support", "1 month free!"]
    }
  };

  const plan = planDetails[requiredPlan] || planDetails.yearly;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="premium-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="premium-header">
          <div className="premium-icon">⭐</div>
          <h2>Premium Feature</h2>
          <p className="premium-subtitle">
            {feature} requires {plan.name}
          </p>
        </div>

        <div className="premium-content">
          <div className="premium-plan-card">
            <div className="plan-badge">Recommended</div>
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="period">/{plan.period}</span>
            </div>
            
            <ul className="plan-features">
              {plan.features.map((feat, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            <button className="btn-upgrade" onClick={() => {
              onClose();
              // Navigate to subscription page
              window.location.hash = '#subscription';
            }}>
              Upgrade Now
            </button>
          </div>

          <div className="premium-benefits">
            <h4>Why Upgrade?</h4>
            <div className="benefit-item">
              <span className="benefit-icon">🎤</span>
              <div>
                <strong>AI Voice Assistant</strong>
                <p>Add transactions by voice with Whisper AI</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🤖</span>
              <div>
                <strong>GPT-3.5 Insights</strong>
                <p>Get personalized financial advice</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <div>
                <strong>Advanced Analytics</strong>
                <p>Deep insights into your spending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PremiumModal;
