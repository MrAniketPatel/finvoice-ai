import express from "express";
import bcrypt from "bcryptjs";
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
    const { 
      name, 
      occupation, 
      dob, 
      companyName, 
      startedYear,
      phone,
      address,
      city,
      country,
      timezone,
      currency,
      language,
      avatar
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        name, 
        occupation, 
        dob, 
        companyName, 
        startedYear,
        phone,
        address,
        city,
        country,
        timezone,
        currency,
        language,
        avatar
      },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Change password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Please provide both current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
