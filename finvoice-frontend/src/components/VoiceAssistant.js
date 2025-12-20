import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import PremiumModal from "./PremiumModal";
import useAudioRecorder from "../hooks/useAudioRecorder";
import { parseTransactionVoice, parseAlertVoice } from "../utils/voiceParser";

function VoiceAssistant({ onRefresh }) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userTier, setUserTier] = useState('free');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  
  const { isRecording, audioBlob, error, startRecording, stopRecording, clearRecording } = useAudioRecorder();

  useEffect(() => {
    checkSubscription();
  }, []);

  useEffect(() => {
    if (audioBlob && !processing) {
      handleAudioTranscription();
    }
  }, [audioBlob]);

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
      return;
    }

    // Premium user - start/stop recording
    if (isRecording) {
      stopRecording();
      setMessage('🎤 Processing audio...');
    } else {
      clearRecording();
      setMessage('');
      startRecording();
    }
  };

  const handleAudioTranscription = async () => {
    setProcessing(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        // Send to Whisper API
        const res = await fetch(API_ENDPOINTS.AI.TRANSCRIBE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ audioBase64: base64Audio })
        });

        const data = await res.json();
        
        if (res.ok && data.text) {
          setMessage(`✅ Heard: "${data.text}"`);
          
          // Process the transcribed text
          await processVoiceCommand(data.text);
        } else {
          setMessage('❌ Could not understand audio. Please try again.');
        }
        
        setProcessing(false);
        clearRecording();
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      };
      
    } catch (err) {
      console.error('Transcription error:', err);
      setMessage('❌ Error processing audio. Please try again.');
      setProcessing(false);
      clearRecording();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const processVoiceCommand = async (text) => {
    const lowerText = text.toLowerCase();
    const token = localStorage.getItem("token");

    try {
      if (
        lowerText.includes("add") ||
        lowerText.includes("expense") ||
        lowerText.includes("income") ||
        lowerText.includes("spent") ||
        lowerText.includes("earned")
      ) {
        const parsed = parseTransactionVoice(text);
        
        if (!parsed.amount) {
          setMessage('❌ Could not understand the amount. Try: "Add expense 500 for food"');
          return;
        }

        const res = await fetch(API_ENDPOINTS.TRANSACTIONS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(parsed),
        });

        if (res.ok) {
          setMessage(`✅ Added ${parsed.type}: ₹${parsed.amount} for ${parsed.category}`);
          if (onRefresh) onRefresh();
        } else {
          const errorData = await res.json();
          setMessage(errorData.message || '❌ Failed to add transaction');
        }
      } else if (
        lowerText.includes("remind") ||
        lowerText.includes("alert") ||
        lowerText.includes("payment")
      ) {
        const parsed = parseAlertVoice(text);
        
        if (!parsed.amount) {
          setMessage('❌ Could not understand the amount');
          return;
        }

        const res = await fetch(API_ENDPOINTS.ALERTS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(parsed),
        });

        if (res.ok) {
          setMessage(`✅ Alert created: ${parsed.title}`);
          if (onRefresh) onRefresh();
        } else {
          setMessage('❌ Failed to create alert');
        }
      } else {
        setMessage('❓ Try: "Add expense 500 for food" or "Remind me rent payment 15000"');
      }
    } catch (err) {
      console.error('Command processing error:', err);
      setMessage('❌ Error processing command');
    }
  };

  const getButtonText = () => {
    if (processing) return '⏳ Processing...';
    if (isRecording) return '🔴 Recording... (Click to stop)';
    if (userTier === 'free' || userTier === 'monthly') return '⭐ Upgrade to Use Voice';
    return '🎤 Start Voice Command';
  };

  const getButtonStyle = () => {
    if (isRecording) {
      return {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        animation: 'pulse 1.5s infinite'
      };
    }
    if (userTier === 'free' || userTier === 'monthly') {
      return {
        background: 'linear-gradient(135deg, #FFD700, #FFA500)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #71C7B8, #A8DADC)'
    };
  };

  if (error) {
    return (
      <div className="voice-assistant-card">
        <div className="voice-card-header">
          <div className="voice-title-row">
            <h3>🎤 AI Voice Assistant</h3>
          </div>
          <p className="voice-description" style={{ color: '#ef4444' }}>
            ⚠️ Microphone access required. Please allow microphone access in your browser settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-assistant-card">
      <div className="voice-card-header">
        <div className="voice-title-row">
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
            : "Click the button below and speak your command. Example: 'Add expense 500 for food'"}
        </p>
      </div>
      
      {message && (
        <div style={{
          background: message.includes('✅') ? '#d1fae5' : message.includes('❌') ? '#fee2e2' : '#dbeafe',
          color: message.includes('✅') ? '#065f46' : message.includes('❌') ? '#991b1b' : '#1e40af',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}
      
      <div className="voice-card-actions">
        <button 
          className="voice-action-btn"
          onClick={handleVoiceClick}
          disabled={processing}
          style={getButtonStyle()}
        >
          {getButtonText()}
        </button>
      </div>

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
