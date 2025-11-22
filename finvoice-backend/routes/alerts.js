import express from "express";
import Alert from "../models/alert.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Get all alerts for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Add new alert
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, dueDate, category } = req.body;
    
    const alert = new Alert({
      userId: req.userId,
      title,
      amount,
      dueDate,
      category,
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update alert status
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ msg: "Alert not found" });
    }

    res.json(alert);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete alert
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!alert) {
      return res.status(404).json({ msg: "Alert not found" });
    }

    res.json({ msg: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
