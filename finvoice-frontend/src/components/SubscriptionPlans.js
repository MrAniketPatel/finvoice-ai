import React, { useState } from 'react';

function SubscriptionPlans({ currentPlan = 'free', onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [billingCycle, setBillingCycle] = useState('monthly');

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
      const monthlyEquivalent = 149 * 13; // 13 months of monthly plan
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

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>Choose Your Plan</h2>
        <p>Unlock the full power of AI-driven financial management</p>
        

      </div>

      <div className="plans-grid">
        {Object.entries(plans).map(([key, plan]) => {
          const savings = getSavings(key);
          
          return (
            <div 
              key={key}
              className={`plan-card plan-${plan.color} ${plan.popular ? 'popular' : ''} ${selectedPlan === key ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(key)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              {plan.bonus && <div className="bonus-badge">{plan.bonus}</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{getPrice(plan)}</span>
                  <span className="period">{getPeriod(key, plan)}</span>
                </div>
                
                {savings && (
                  <div className="savings-info">
                    {savings.description}
                  </div>
                )}
              </div>

              <div className="plan-features">
                <div className="entries-info">
                  <strong>{plan.entries}</strong> entries{plan.period ? ` per ${plan.period}` : ''}
                </div>
                
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="limitations">
                    <h4>Limitations:</h4>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index}>
                          <span className="cross-icon">✗</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button 
                className={`plan-button ${currentPlan === key ? 'current' : ''}`}
                onClick={() => onUpgrade && onUpgrade(key)}
              >
                {currentPlan === key ? 'Current Plan' : 
                 key === 'free' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          );
        })}
      </div>

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