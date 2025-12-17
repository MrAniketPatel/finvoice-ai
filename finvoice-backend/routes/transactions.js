import express from "express";
import Transaction from "../models/transaction.js";
import { authMiddleware } from "../middlewares/auth.js";
import { canAddTransaction, incrementTransactionCount } from "../middlewares/subscriptionCheck.js";

const router = express.Router();

// Get all transactions for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Add new transaction (with subscription limit check)
router.post("/", authMiddleware, canAddTransaction, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    
    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    await transaction.save();
    
    // Increment transaction count
    await incrementTransactionCount(req.userId);
    
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.json({ msg: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
