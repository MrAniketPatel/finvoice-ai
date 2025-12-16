import React, { useState, useRef } from 'react';
import { OpenAIVoiceService } from '../utils/openaiVoice';

function AdvancedVoiceButton({ onTransactionAdd, onAlertAdd }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en'); // en, hi, auto
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const voiceService = useRef(null);

  // Initialize OpenAI service (you'll need to add API key)
  React.useEffect(() => {
    // In production, store API key securely
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'your-api-key-here';
    voiceService.current = new OpenAIVoiceService(apiKey);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMessage('🎤 Listening... Speak now!');
    } catch (error) {
      setMessage('❌ Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setMessage('🤖 Processing with AI...');
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const result = await voiceService.current.processVoiceCommand(audioBlob, language);
      
      if (result.success && result.parsed) {
        const { type, amount, category, description, confidence } = result.parsed;
        
        if (confidence < 0.7) {
          setMessage(`❓ Not sure I understood: "${result.transcript}". Please try again.`);
          return;
        }

        // Add transaction or alert based on type
        if (type === 'expense' || type === 'income') {
          const transaction = {
            type,
            amount: parseFloat(amount),
            category,
            description,
          };
          
          if (onTransactionAdd) {
            await onTransactionAdd(transaction);
            setMessage(`✅ Added ${type}: ₹${amount} for ${category}`);
          }
        } else if (type === 'alert') {
          const alert = {
            title: description,
            amount: parseFloat(amount),
            category,
          };
          
          if (onAlertAdd) {
            await onAlertAdd(alert);
            setMessage(`🔔 Alert set: ${description} - ₹${amount}`);
          }
        }
        
        // Show transcript for confirmation
        setTimeout(() => {
          setMessage(`Heard: "${result.transcript}"`);
        }, 2000);
        
      } else {
        setMessage(`❌ ${result.error || 'Could not process voice command'}`);
      }
    } catch (error) {
      setMessage('❌ AI processing failed. Check your API key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  };

  return (
    <div className="advanced-voice-container">
      {/* Language Selector */}
      <div className="voice-controls">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-selector"
        >
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Voice Button */}
      <button
        className={`advanced-voice-btn ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
        onClick={handleClick}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="processing-spinner">⟳</div>
        ) : isRecording ? (
          '⏹️'
        ) : (
          '🎤'
        )}
      </button>

      {/* Status Message */}
      {message && (
        <div className="voice-message">
          <p>{message}</p>
        </div>
      )}

      {/* Example Commands */}
      <div className="voice-examples">
        <h4>Try saying:</h4>
        <ul>
          <li>"Add expense 500 for lunch"</li>
          <li>"I earned 50000 salary"</li>
          <li>"Remind me to pay rent 15000"</li>
          <li>"मैंने 200 रुपये खाने में खर्च किए" (Hindi)</li>
        </ul>
      </div>
    </div>
  );
}

export default AdvancedVoiceButton;