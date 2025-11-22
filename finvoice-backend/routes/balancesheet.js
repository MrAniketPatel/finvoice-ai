import express from "express";
import Transaction from "../models/transaction.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Get balance sheet data with time filter
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { period } = req.query; // week, month, 6months, year
    
    let startDate = new Date();
    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "6months":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate },
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      profit,
      transactionCount: transactions.length,
      period: period || "all",
    });
  } catch (err) {
    console.error("BalanceSheet Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
