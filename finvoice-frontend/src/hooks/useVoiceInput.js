import { useState, useEffect } from 'react';

const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // More reliable settings
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true; // Show interim results
      recognitionInstance.maxAlternatives = 1;
      recognitionInstance.lang = 'en-US'; // Changed to US English for better recognition
      
      // Give more time for speech detection
      if ('webkitSpeechRecognition' in window) {
        recognitionInstance.continuous = true; // Keep listening
      }
      
      // Handle interim and final results
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setTranscript(finalTranscript);
          setIsListening(false);
        } else if (interimTranscript) {
          console.log('Interim transcript:', interimTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, please try again');
        } else if (event.error === 'audio-capture') {
          console.log('No microphone found');
        } else if (event.error === 'not-allowed') {
          console.log('Microphone permission denied');
        }
        setIsListening(false);
      };

      recognitionInstance.onstart = () => {
        console.log('Voice recognition started - speak now!');
      };

      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
        console.log('Starting voice recognition...');
        console.log('IMPORTANT: Speak IMMEDIATELY after clicking! Say: "Add expense 500 for food"');
        
        // Auto-stop after 10 seconds if continuous
        setTimeout(() => {
          if (isListening) {
            recognition.stop();
            console.log('Auto-stopped after 10 seconds');
          }
        }, 10000);
      } catch (error) {
        console.error('Error starting recognition:', error);
        // If already started, stop and restart
        if (error.message.includes('already started')) {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
            setIsListening(true);
          }, 100);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  };
};

export default useVoiceInput;
