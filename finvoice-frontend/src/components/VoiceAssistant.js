import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import PremiumModal from "./PremiumModal";

function VoiceAssistant({ onRefresh }) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userTier, setUserTier] = useState('free');

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserTier(data.subscriptionTier || 'free');
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  const handleVoiceClick = () => {
    if (userTier === 'free' || userTier === 'monthly') {
      setShowPremiumModal(true);
    } else {
      alert("Voice feature coming soon! OpenAI Whisper integration in progress.");
    }
  };

  return (
    <div className="voice-assistant-card">
      <div className="voice-header">
        <h3>🎤 AI Voice Assistant</h3>
        {(userTier === 'free' || userTier === 'monthly') && (
          <span className="premium-badge">
            <span className="premium-badge-icon">⭐</span>
            PREMIUM
          </span>
        )}
      </div>
      <p className="voice-description">
        {(userTier === 'free' || userTier === 'monthly')
          ? "Upgrade to Quarterly or Yearly plan to add transactions using voice commands powered by OpenAI Whisper."
          : "Add transactions and alerts using voice commands powered by OpenAI Whisper."}
      </p>
      <button 
        className="voice-btn"
        onClick={handleVoiceClick}
        style={{
          background: (userTier === 'free' || userTier === 'monthly')
            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
            : 'linear-gradient(135deg, #71C7B8, #A8DADC)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%'
        }}
      >
        {(userTier === 'free' || userTier === 'monthly') ? '⭐ Upgrade to Use Voice' : '🎤 Start Voice Command'}
      </button>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature="AI Voice Assistant"
        requiredPlan="quarterly"
      />
    </div>
  );
}

export default VoiceAssistant;
