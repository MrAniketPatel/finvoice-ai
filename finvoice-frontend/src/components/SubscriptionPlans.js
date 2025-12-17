import React, { useState } from 'react';

function SubscriptionPlans({ currentPlan = 'free', onUpgrade }) {
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const plans = {
    free: {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      entries: 'Limited',
      features: [
        'Basic income & expense entries',
        'Simple balance sheet',
        'Limited transaction history',
        'Basic dashboard',
        'Email support'
      ],
      limitations: [
        'No report downloads',
        'No payable alerts',
        'No AI voice assistant',
        'Limited entries per month'
      ],
      color: 'gray'
    },
    monthly: {
      name: 'Monthly',
      monthlyPrice: 149,
      yearlyPrice: 149 * 12,
      entries: '150',
      features: [
        'Everything in Free',
        '150 entries per month',
        'Report downloads (PDF/Excel)',
        'Payable alerts & reminders',
        'Advanced balance sheet',
        'Priority email support'
      ],
      popular: true,
      color: 'teal'
    },
    quarterly: {
      name: 'Quarterly',
      monthlyPrice: 399,
      yearlyPrice: 399 * 4,
      entries: '550',
      period: '3 months',
      features: [
        'Everything in Monthly',
        '500 entries + 50 bonus entries',
        'AI Voice Assistant (Multi-language)',
        'Smart transaction categorization',
        'Advanced insights & predictions',
        'Report downloads (PDF/Excel)',
        'Payable alerts & reminders',
        'Priority support'
      ],
      color: 'navy'
    },
    yearly: {
      name: 'Yearly',
      monthlyPrice: 1499,
      yearlyPrice: 1499,
      entries: 'Unlimited',
      period: '12 months',
      features: [
        'Everything in Quarterly',
        'Unlimited entries',
        'AI Voice Assistant (All languages)',
        'Advanced AI recommendations',
        'Custom budget goals',
        'Report downloads (PDF/Excel)',
        'Payable alerts & reminders',
        '1 month free (13 months total)',
        'Phone support'
      ],
      bonus: '1 month free',
      color: 'purple'
    }
  };

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free';
    return `₹${plan.monthlyPrice}`;
  };

  const getPeriod = (planKey, plan) => {
    if (planKey === 'yearly') return '/year';
    if (planKey === 'quarterly') return '/3 months';
    return '/month';
  };

  const getSavings = (planKey) => {
    if (planKey === 'yearly') {
      const monthlyEquivalent = 149 * 13;
      const savings = monthlyEquivalent - 1499;
      return { amount: savings, description: '1 month free' };
    }
    if (planKey === 'quarterly') {
      const monthlyEquivalent = 149 * 3;
      const savings = monthlyEquivalent - 399;
      return { amount: savings, description: `Save ₹${savings}` };
    }
    return null;
  };

  const openModal = (key, plan) => {
    setModalPlan({ key, ...plan });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalPlan(null);
  };

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>Choose Your Plan</h2>
        <p>Unlock the full power of AI-driven financial management</p>
      </div>

      {isLoading ? (
        <div className="plans-grid-compact">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="plan-card-skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-button"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="plans-grid-compact plans-fade-in">
          {Object.entries(plans).map(([key, plan]) => {
            const savings = getSavings(key);
            
            return (
              <div 
                key={key}
                className={`plan-card-compact plan-${plan.color} ${plan.popular ? 'popular' : ''} ${currentPlan === key ? 'selected' : ''}`}
                onClick={() => openModal(key, plan)}
              >
                {plan.popular && <div className="popular-badge-compact">Most Popular</div>}
                {plan.bonus && <div className="bonus-badge-compact">🎁 {plan.bonus}</div>}
                
                <div className="plan-icon">{key === 'free' ? '🆓' : key === 'monthly' ? '📅' : key === 'quarterly' ? '📊' : '⭐'}</div>
                <h3>{plan.name}</h3>
                <div className="plan-price-compact">
                  <span className="price">{getPrice(plan)}</span>
                  <span className="period">{getPeriod(key, plan)}</span>
                </div>
                
                {savings && (
                  <div className="savings-compact">💰 {savings.description}</div>
                )}
                
                <div className="entries-compact">
                  <strong>{plan.entries}</strong> entries{plan.period ? `/${plan.period}` : ''}
                </div>
                
                <div className="features-preview">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="feature-preview-item">
                      <span className="check-mini">✓</span>
                      <span>{feature.length > 25 ? feature.substring(0, 25) + '...' : feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="more-features">+{plan.features.length - 3} more</div>
                  )}
                </div>
                
                <button className="view-details-btn">
                  {currentPlan === key ? '✓ Current Plan' : 'View Full Details →'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && modalPlan && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="plan-modal">
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>{modalPlan.name} Plan</h2>
              <div className="modal-price">
                <span className="price">{getPrice(modalPlan)}</span>
                <span className="period">{getPeriod(modalPlan.key, modalPlan)}</span>
              </div>
              {getSavings(modalPlan.key) && (
                <div className="modal-savings">{getSavings(modalPlan.key).description}</div>
              )}
            </div>

            <div className="modal-body">
              <div className="modal-entries">
                <strong>{modalPlan.entries}</strong> entries{modalPlan.period ? ` per ${modalPlan.period}` : ''}
              </div>

              <div className="modal-features">
                <h4>Features:</h4>
                <ul>
                  {modalPlan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {modalPlan.limitations && (
                <div className="modal-limitations">
                  <h4>Limitations:</h4>
                  <ul>
                    {modalPlan.limitations.map((limitation, index) => (
                      <li key={index}>
                        <span className="cross-icon">✗</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className={`modal-button ${currentPlan === modalPlan.key ? 'current' : ''}`}
                onClick={() => {
                  onUpgrade && onUpgrade(modalPlan.key);
                  closeModal();
                }}
              >
                {currentPlan === modalPlan.key ? 'Current Plan' : 
                 modalPlan.key === 'free' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="subscription-footer">
        <div className="cost-breakdown">
          <h3>Plan Comparison</h3>
          <div className="breakdown-grid">
            <div className="cost-item">
              <span className="cost-label">Free:</span>
              <span className="cost-value">Basic features only</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Monthly (₹149):</span>
              <span className="cost-value">150 entries + reports</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Quarterly (₹399):</span>
              <span className="cost-value">550 entries + AI voice</span>
            </div>
            <div className="cost-item total">
              <span className="cost-label">Yearly (₹1499):</span>
              <span className="cost-value">Unlimited + 1 month free</span>
            </div>
          </div>
        </div>

        <div className="guarantee">
          <h4>30-Day Money-Back Guarantee</h4>
          <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlans;
