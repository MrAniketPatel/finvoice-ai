import React, { useState } from "react";
import useVoiceInput from "../hooks/useVoiceInput";
import { parseTransactionVoice, parseAlertVoice } from "../utils/voiceParser";

function FloatingVoiceButton({ onRefresh }) {
  const { isListening, transcript, isSupported, startListening } = useVoiceInput();
  const [showTooltip, setShowTooltip] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    if (transcript && !processing) {
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  const handleVoiceCommand = async (text) => {
    setProcessing(true);
    const lowerText = text.toLowerCase();

    try {
      const token = localStorage.getItem("token");

      if (
        lowerText.includes("add") ||
        lowerText.includes("expense") ||
        lowerText.includes("income") ||
        lowerText.includes("spent") ||
        lowerText.includes("earned")
      ) {
        const parsed = parseTransactionVoice(text);
        if (!parsed.amount) {
          setMessage("❌ Amount not clear");
          setTimeout(() => setMessage(""), 3000);
          setProcessing(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/transactions", {
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
          setMessage("❌ Failed");
        }
      } else if (
        lowerText.includes("remind") ||
        lowerText.includes("alert") ||
        lowerText.includes("payment")
      ) {
        const parsed = parseAlertVoice(text);
        if (!parsed.amount) {
          setMessage("❌ Amount not clear");
          setTimeout(() => setMessage(""), 3000);
          setProcessing(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/alerts", {
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
          setMessage("❌ Failed");
        }
      } else {
        setMessage("❓ Try: 'Add expense 500 for food'");
      }
    } catch (err) {
      setMessage("❌ Error");
    }

    setProcessing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <button
        className={`floating-voice-btn ${isListening ? "listening" : ""}`}
        onClick={startListening}
        disabled={isListening || processing}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title="Click to speak"
      >
        {processing ? "⏳" : isListening ? "🎤" : "🎤"}
      </button>

      {(showTooltip || message || transcript) && (
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
          {message && (
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
              {message}
            </p>
          )}
          {transcript && !message && (
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              "{transcript}"
            </p>
          )}
          {!message && !transcript && showTooltip && (
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              Click to add transactions or alerts with voice
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default FloatingVoiceButton;
