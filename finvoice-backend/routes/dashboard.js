import express from "express";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Alert from "../models/alert.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Protected dashboard route with summary data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(5);

    // Get pending alerts
    const pendingAlerts = await Alert.find({
      userId: req.userId,
      status: "pending",
    }).sort({ dueDate: 1 });

    // Calculate quick stats
    const allTransactions = await Transaction.find({ userId: req.userId });
    const totalIncome = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      user: { name: user.name, email: user.email },
      stats: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      recentTransactions,
      pendingAlerts: pendingAlerts.slice(0, 3),
    });
  } catch (err) {
    console.error("Dashboard route error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;