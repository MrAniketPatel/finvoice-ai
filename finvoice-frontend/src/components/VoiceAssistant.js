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

      if (
        lowerText.includes("add") ||
        lowerText.includes("expense") ||
        lowerText.includes("income") ||
        lowerText.includes("spent") ||
        lowerText.includes("earned") ||
        lowerText.includes("received")
      ) {
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
          "❓ Try: 'Add expense 500 for food' or 'Remind me rent payment 15000 next week'"
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
        <div className="voice-card">
          <p style={{ color: "var(--gray-500)", fontSize: "14px", margin: 0 }}>
            Voice input not supported in this browser. Try Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-assistant">
      <div className="voice-card">
        <h3>🎤 Voice Assistant</h3>

        <button
          onClick={() => {
            console.log('Voice button clicked');
            startListening();
          }}
          disabled={isListening || processing}
          className={`voice-btn ${isListening ? "listening" : ""}`}
        >
          {processing ? (
            <>⏳ Processing...</>
          ) : isListening ? (
            <>🔴 Listening... Speak clearly!</>
          ) : (
            <>🎤 Click & Speak</>
          )}
        </button>

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: isListening ? "#fef3c7" : "var(--gray-50)",
            borderRadius: "8px",
            minHeight: "80px",
            border: isListening ? "2px solid #f59e0b" : "1px solid var(--gray-200)",
            transition: "all 0.3s",
          }}
        >
          {isListening && (
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#92400e",
                fontWeight: "600",
                animation: "pulse 1.5s infinite",
              }}
            >
              🎤 Listening... Speak now! (e.g., "Add expense 500 for food")
            </p>
          )}
          {transcript && (
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "var(--gray-700)",
              }}
            >
              <strong>You said:</strong> "{transcript}"
            </p>
          )}
          {message && (
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                fontWeight: "600",
                color: message.includes("✅")
                  ? "var(--success)"
                  : message.includes("❌")
                  ? "var(--danger)"
                  : "var(--gray-700)",
              }}
            >
              {message}
            </p>
          )}
          {!transcript && !message && !isListening && (
            <div>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--gray-700)",
                }}
              >
                💡 Try saying:
              </p>
              <ul
                style={{
                  margin: "0",
                  paddingLeft: "20px",
                  fontSize: "13px",
                  lineHeight: "1.8",
                  color: "var(--gray-600)",
                }}
              >
                <li>"Add expense 500 rupees for food"</li>
                <li>"Income 5000 salary"</li>
                <li>"Remind me rent payment 15000 next week"</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceAssistant;
