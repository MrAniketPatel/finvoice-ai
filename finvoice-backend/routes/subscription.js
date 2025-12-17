import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getUsageStats } from "../middlewares/subscriptionCheck.js";
import User from "../models/user.js";

const router = express.Router();

// Get usage statistics
router.get("/usage", authMiddleware, getUsageStats);

// Get subscription details
router.get("/details", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiry: user.subscriptionExpiry,
      subscriptionStartDate: user.subscriptionStartDate,
      paymentHistory: user.paymentHistory
    });
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update subscription (for testing - in production this would be handled by payment webhook)
router.post("/upgrade", authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'monthly', 'quarterly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Calculate expiry date based on plan
    let expiryDate = null;
    if (plan !== 'free') {
      expiryDate = new Date();
      if (plan === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (plan === 'quarterly') {
        expiryDate.setMonth(expiryDate.getMonth() + 3);
      } else if (plan === 'yearly') {
        expiryDate.setMonth(expiryDate.getMonth() + 13); // 13 months (1 free)
      }
    }
    
    user.subscriptionTier = plan;
    user.subscriptionExpiry = expiryDate;
    user.subscriptionStartDate = new Date();
    user.monthlyTransactionCount = 0; // Reset counter on upgrade
    user.lastResetDate = new Date();
    
    await user.save();
    
    res.json({
      message: `Successfully upgraded to ${plan} plan`,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiry: user.subscriptionExpiry
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
