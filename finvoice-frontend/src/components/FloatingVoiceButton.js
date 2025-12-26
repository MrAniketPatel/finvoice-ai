import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";
import useAudioRecorder from "../hooks/useAudioRecorder";
import { parseTransactionVoice, parseAlertVoice } from "../utils/voiceParser";

function FloatingVoiceButton({ onRefresh }) {
  const [userTier, setUserTier] = useState('free');
  const [showTooltip, setShowTooltip] = useState(false);
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

  const handleClick = () => {
    // Check if user has Quarterly or Yearly plan
    if (userTier === 'free' || userTier === 'monthly') {
      // Redirect to subscription page instead of showing modal
      window.location.hash = '#subscription';
      return;
    }

    // Premium user - start/stop recording
    if (isRecording) {
      stopRecording();
      setMessage('Processing...');
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
        const base64Audio = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
        
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
          setMessage(`Heard: "${data.text}"`);
          
          // Process the transcribed text
          await processVoiceCommand(data.text);
        } else {
          setMessage('❌ Could not understand audio');
        }
        
        setProcessing(false);
        clearRecording();
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      };
      
    } catch (err) {
      console.error('Transcription error:', err);
      setMessage('❌ Error processing audio');
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
          setMessage('❌ Could not understand amount');
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
          setMessage(`✅ Added ${parsed.type}: ₹${parsed.amount}`);
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
          setMessage('❌ Could not understand amount');
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
          setMessage(`✅ Alert created`);
          if (onRefresh) onRefresh();
        } else {
          setMessage('❌ Failed to create alert');
        }
      } else {
        setMessage('❓ Try: "Add expense 500 for food"');
      }
    } catch (err) {
      console.error('Command processing error:', err);
      setMessage('❌ Error processing command');
    }
  };

  if (error) {
    return (
      <button
        className="floating-voice-btn"
        onClick={() => alert('Microphone access required. Please allow microphone access in your browser settings.')}
        title="Microphone access required"
      >
        🎤❌
      </button>
    );
  }

  return (
    <>
      <button
        className={`floating-voice-btn ${isRecording ? 'recording' : ''} ${processing ? 'processing' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={processing}
        title={isRecording ? "Click to stop recording" : "Click to start recording"}
      >
        {processing ? '⏳' : isRecording ? '🔴' : '🎤'}
        {(userTier === 'free' || userTier === 'monthly') && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: '700'
          }}>
            PRO
          </span>
        )}
      </button>

      {(showTooltip || message) && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            maxWidth: "300px",
            zIndex: 999,
          }}
        >
          {message ? (
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
              {message}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              {(userTier === 'free' || userTier === 'monthly') 
                ? "🎤 AI Voice Assistant - Upgrade to Quarterly or Yearly plan"
                : isRecording 
                  ? "🔴 Recording... Click to stop"
                  : "🎤 Click to record voice command"}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default FloatingVoiceButton;
