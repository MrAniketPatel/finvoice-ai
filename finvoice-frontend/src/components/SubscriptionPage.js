import React from 'react';
import SubscriptionPlans from './SubscriptionPlans';

function SubscriptionPage() {
  const handleUpgrade = (planKey) => {
    console.log(`Upgrading to ${planKey} plan`);
    
    const plans = {
      free: { name: 'Free', price: 0 },
      monthly: { name: 'Monthly', price: 149 },
      quarterly: { name: 'Quarterly', price: 399 },
      yearly: { name: 'Yearly', price: 1499 }
    };
    
    if (planKey === 'free') {
      alert('You\'re already on the free plan!');
      return;
    }
    
    const plan = plans[planKey];
    alert(`Redirecting to payment for ${plan.name} plan - ₹${plan.price}...`);
    
    // TODO: Integrate with Razorpay payment gateway
    // initializeRazorpay(plan);
  };

  // Future Razorpay integration
  const initializeRazorpay = (plan) => {
    const options = {
      key: 'rzp_test_your_key_here',
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      name: 'FinVoiceAI',
      description: `${plan.name} Subscription`,
      handler: function (response) {
        console.log('Payment successful:', response);
        // Update user subscription in backend
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#71C7B8'
      }
    };
    
    // const rzp = new window.Razorpay(options);
    // rzp.open();
  };

  return (
    <div className="content-container">
      <SubscriptionPlans 
        currentPlan="free" 
        onUpgrade={handleUpgrade}
      />
      
      <div className="subscription-benefits">
        <h2>Why Upgrade to AI-Powered Voice?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎤</div>
            <h3>Multi-Language Support</h3>
            <p>Speak in Hindi, English, or any language. Our AI understands context and converts speech perfectly.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🧠</div>
            <h3>Smart Understanding</h3>
            <p>"मैंने 500 रुपये खाने में खर्च किए" → Automatically categorizes as Food expense with ₹500 amount.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Add transactions 10x faster than typing. Just speak naturally and watch your finances update instantly.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <h3>AI Insights</h3>
            <p>Get personalized recommendations, spending predictions, and smart budget suggestions powered by GPT.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;