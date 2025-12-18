import express from "express";
import OpenAI from "openai";
import { authMiddleware } from "../middlewares/auth.js";
import { requireFeature } from "../middlewares/subscriptionCheck.js";
import Transaction from "../models/transaction.js";

const router = express.Router();

// Initialize OpenAI only if API key exists
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Whisper: Transcribe audio to text (Quarterly+ plan required)
router.post("/transcribe", authMiddleware, requireFeature("ai_voice"), async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: "AI service not configured",
        message: "OpenAI API key is not set up on the server"
      });
    }

    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "Audio data is required" });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Create a file-like object for OpenAI
    const file = new File([audioBuffer], "audio.webm", { type: "audio/webm" });

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
    });

    res.json({ 
      text: transcription.text,
      success: true 
    });

  } catch (error) {
    console.error("Whisper transcription error:", error);
    res.status(500).json({ 
      error: "Transcription failed",
      message: error.message 
    });
  }
});

// GPT-3.5: Generate financial insights (Yearly plan required)
router.post("/insights", authMiddleware, requireFeature("advanced_ai"), async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: "AI service not configured",
        message: "OpenAI API key is not set up on the server"
      });
    }

    // Get user's recent transactions
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(50);

    if (transactions.length === 0) {
      return res.json({
        insights: ["Add some transactions to get personalized AI insights!"],
        recommendations: [],
        predictions: []
      });
    }

    // Prepare transaction summary for GPT
    const transactionSummary = transactions.map(t => ({
      type: t.type,
      amount: t.amount,
      category: t.category,
      date: t.date
    }));

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Call GPT-3.5 for insights
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional financial advisor. Analyze the user's transactions and provide 3 key insights, 2 actionable recommendations, and 1 prediction. Be concise, specific, and helpful. Format your response as JSON with keys: insights (array), recommendations (array), predictions (array)."
        },
        {
          role: "user",
          content: `Analyze these financial transactions:
Total Income: $${totalIncome}
Total Expenses: $${totalExpense}
Net: $${totalIncome - totalExpense}

Recent transactions: ${JSON.stringify(transactionSummary.slice(0, 20))}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // Fallback if GPT doesn't return valid JSON
      parsedResponse = {
        insights: [aiResponse.substring(0, 200)],
        recommendations: ["Keep tracking your expenses regularly"],
        predictions: ["Continue monitoring your spending patterns"]
      };
    }

    res.json({
      ...parsedResponse,
      success: true,
      tokensUsed: completion.usage.total_tokens
    });

  } catch (error) {
    console.error("GPT insights error:", error);
    res.status(500).json({ 
      error: "Failed to generate insights",
      message: error.message 
    });
  }
});

// GPT-3.5: Smart transaction categorization (Yearly plan required)
router.post("/categorize", authMiddleware, requireFeature("advanced_ai"), async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: "AI service not configured"
      });
    }

    const { description, amount } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial categorization expert. Given a transaction description and amount, suggest the most appropriate category. Respond with ONLY the category name from this list: Food, Transport, Shopping, Bills, Entertainment, Healthcare, Education, Other."
        },
        {
          role: "user",
          content: `Transaction: "${description}", Amount: $${amount}`
        }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const category = completion.choices[0].message.content.trim();

    res.json({ 
      category,
      success: true 
    });

  } catch (error) {
    console.error("GPT categorization error:", error);
    res.status(500).json({ 
      error: "Categorization failed",
      message: error.message 
    });
  }
});

export default router;
