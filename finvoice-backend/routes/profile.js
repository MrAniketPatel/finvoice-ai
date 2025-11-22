import express from "express";
import User from "../models/user.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Get user profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update user profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, occupation, dob, companyName, startedYear } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, occupation, dob, companyName, startedYear },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
