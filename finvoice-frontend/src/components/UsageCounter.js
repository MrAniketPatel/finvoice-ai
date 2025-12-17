import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function UsageCounter({ onUpgradeClick }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/subscription/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsage(response.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="usage-counter-skeleton">
        <div className="skeleton-bar"></div>
      </div>
    );
  }

  if (!usage) return null;

  const getProgressColor = () => {
    if (usage.isUnlimited) return 'var(--teal)';
    if (usage.percentage >= 90) return 'var(--danger)';
    if (usage.percentage >= 70) return 'var(--warning)';
    return 'var(--teal)';
  };

  const getPlanName = () => {
    const names = {
      free: 'Free',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return names[usage.subscriptionTier] || 'Free';
  };

  return (
    <div className="usage-counter">
      <div className="usage-header">
        <div className="usage-title">
          <span className="plan-badge">{getPlanName()} Plan</span>
          <h4>Transaction Usage</h4>
        </div>
        {!usage.isUnlimited && usage.percentage >= 80 && (
          <button className="upgrade-btn-small" onClick={onUpgradeClick}>
            Upgrade
          </button>
        )}
      </div>

      {usage.isUnlimited ? (
        <div className="unlimited-badge">
          <span className="unlimited-icon">⭐</span>
          <div>
            <strong>Unlimited Transactions</strong>
            <p>You have unlimited access</p>
          </div>
        </div>
      ) : (
        <>
          <div className="usage-stats">
            <span className="usage-count">
              <strong>{usage.currentCount}</strong> / {usage.maxCount}
            </span>
            <span className="usage-remaining">
              {usage.remainingCount} remaining
            </span>
          </div>

          <div className="usage-bar">
            <div 
              className="usage-progress" 
              style={{ 
                width: `${usage.percentage}%`,
                backgroundColor: getProgressColor()
              }}
            ></div>
          </div>

          {usage.percentage >= 90 && (
            <div className="usage-warning">
              <span className="warning-icon">⚠️</span>
              <span>You're running low on transactions!</span>
            </div>
          )}

          {usage.percentage >= 100 && (
            <div className="usage-limit-reached">
              <span className="limit-icon">🚫</span>
              <div>
                <strong>Limit Reached</strong>
                <p>Upgrade to add more transactions this month</p>
              </div>
            </div>
          )}
        </>
      )}

      {usage.subscriptionExpiry && (
        <div className="subscription-expiry">
          <small>
            Renews on {new Date(usage.subscriptionExpiry).toLocaleDateString()}
          </small>
        </div>
      )}
    </div>
  );
}

export default UsageCounter;
