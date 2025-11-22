import React, { useEffect, useState } from "react";
import useVoiceInput from "../hooks/useVoiceInput";
import { parseTransactionVoice, parseAlertVoice } from "../utils/voiceParser";

function VoiceAssistant({ onRefresh }) {
  const { isListening, transcript, isSupported, startListening } = useVoiceInput();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (transcript && !processing) {
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  const handleVoiceCommand = async (text) => {
    setProcessing(true);
    const lowerText = text.toLowerCase();

    try {
      const token = localStorage.getItem("token");

      // Determine command type
      if (
        lowerText.includes("add") ||
        lowerText.includes("expense") ||
        lowerText.includes("income") ||
        lowerText.includes("spent") ||
        lowerText.includes("earned") ||
        lowerText.includes("received")
      ) {
        // Transaction command
        const parsed = parseTransactionVoice(text);

        if (!parsed.amount) {
          setMessage("❌ Could not understand the amount. Please try again.");
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
          setMessage(
            `✅ Added ${parsed.type}: ₹${parsed.amount} for ${parsed.category}`
          );
          if (onRefresh) onRefresh();
        } else {
          setMessage("❌ Failed to add transaction. Please try again.");
        }
      } else if (
        lowerText.includes("remind") ||
        lowerText.includes("alert") ||
        lowerText.includes("payment") ||
        lowerText.includes("due")
      ) {
        // Alert command
        const parsed = parseAlertVoice(text);

        if (!parsed.amount) {
          setMessage("❌ Could not understand the amount. Please try again.");
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
          setMessage(`✅ Created alert: ${parsed.title} - ₹${parsed.amount}`);
          if (onRefresh) onRefresh();
        } else {
          setMessage("❌ Failed to create alert. Please try again.");
        }
      } else if (
        lowerText.includes("balance") ||
        lowerText.includes("total") ||
        lowerText.includes("summary")
      ) {
        setMessage(
          "📊 Check your dashboard for balance and summary information!"
        );
      } else {
        setMessage(
          "❓ I didn't understand that. Try: 'Add expense 500 for food' or 'Remind me rent payment 15000 next week'"
        );
      }
    } catch (err) {
      console.error("Voice command error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    }

    setProcessing(false);
    setTimeout(() => setMessage(""), 5000);
  };

  if (!isSupported) {
    return (
      <div className="voice-assistant">
        <p style={{ color: "#999", fontSize: "14px" }}>
          Voice input not supported in this browser. Try Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="voice-assistant">
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          borderRadius: "15px",
          color: "white",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>
          🎤 Voice Assistant
        </h3>

        <button
          onClick={startListening}
          disabled={isListening || processing}
          style={{
            padding: "15px 30px",
            background: isListening ? "#e74c3c" : "white",
            color: isListening ? "white" : "#667eea",
            border: "none",
            borderRadius: "10px",
            cursor: isListening || processing ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            width: "100%",
            transition: "all 0.3s",
            opacity: processing ? 0.6 : 1,
          }}
        >
          {processing
            ? "⏳ Processing..."
            : isListening
            ? "🎤 Listening... Speak now!"
            : "🎤 Click to Speak"}
        </button>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "8px",
            minHeight: "60px",
          }}
        >
          {transcript && (
            <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              <strong>You said:</strong> "{transcript}"
            </p>
          )}
          {message && (
            <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>
              {message}
            </p>
          )}
          {!transcript && !message && (
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                <strong>Try saying:</strong>
              </p>
              <ul
                style={{
                  margin: "0",
                  paddingLeft: "20px",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              >
                <li>"Add expense 500 rupees for food"</li>
                <li>"Income 5000 salary"</li>
                <li>"Remind me rent payment 15000 next week"</li>
                <li>"Alert credit card 5000 tomorrow"</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceAssistant;
