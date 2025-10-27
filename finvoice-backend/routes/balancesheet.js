import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Example protected route
router.get("/", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dummy data for testing
    const balanceData = {
      totalIncome: 12000,
      totalExpense: 8000,
      profit: 4000,
      userId: decoded.id,
    };

    res.json(balanceData);
  } catch (err) {
    console.error("BalanceSheet Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
