// OpenAI Whisper + GPT Voice Integration
// More powerful than browser speech recognition

class OpenAIVoiceService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Convert speech to text using Whisper
  async speechToText(audioBlob, language = 'en') {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language); // 'en', 'hi', 'es', etc.
    formData.append('response_format', 'json');

    try {
      const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error('Whisper API error:', error);
      throw new Error('Speech recognition failed');
    }
  }

  // Use GPT to understand and parse the transcribed text
  async parseFinancialCommand(text) {
    const prompt = `
You are a financial assistant. Parse this voice command into a structured transaction or alert.

Voice command: "${text}"

Extract:
1. Type: "income", "expense", or "alert"
2. Amount: number only
3. Category: food, transport, salary, rent, etc.
4. Description: brief description
5. Date: if mentioned, otherwise "today"

Respond in JSON format:
{
  "type": "expense",
  "amount": 500,
  "category": "Food",
  "description": "lunch at restaurant",
  "date": "today",
  "confidence": 0.95
}

If unclear, set confidence < 0.7 and ask for clarification.
`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful financial assistant that parses voice commands.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 200,
        }),
      });

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      // Parse JSON response
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      console.error('GPT parsing error:', error);
      throw new Error('Command parsing failed');
    }
  }

  // Complete voice-to-transaction pipeline
  async processVoiceCommand(audioBlob, language = 'auto') {
    try {
      // Step 1: Speech to text
      const transcript = await this.speechToText(audioBlob, language);
      
      // Step 2: AI parsing
      const parsed = await this.parseFinancialCommand(transcript);
      
      return {
        transcript,
        parsed,
        success: true,
      };
    } catch (error) {
      return {
        transcript: '',
        parsed: null,
        success: false,
        error: error.message,
      };
    }
  }
}

// Alternative: Free local Whisper (runs in browser)
class LocalWhisperService {
  constructor() {
    this.model = null;
    this.isLoading = false;
  }

  async loadModel() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      // Use Transformers.js for local Whisper
      const { pipeline } = await import('@xenova/transformers');
      this.model = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
      console.log('Local Whisper model loaded');
    } catch (error) {
      console.error('Failed to load local Whisper:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async transcribe(audioBlob) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const result = await this.model(arrayBuffer);
      return result.text;
    } catch (error) {
      console.error('Local transcription error:', error);
      throw new Error('Local speech recognition failed');
    }
  }
}

export { OpenAIVoiceService, LocalWhisperService };