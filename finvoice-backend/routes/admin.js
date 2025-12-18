import express from "express";
import User from "../models/user.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Manual subscription upgrade (for testing/admin use)
// In production, this would be protected by admin authentication
router.post("/upgrade-user", authMiddleware, async (req, res) => {
  try {
    const { tier, months } = req.body;
    
    // Valid tiers
    const validTiers = ['free', 'monthly', 'quarterly', 'yearly'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: "Invalid tier. Use: free, monthly, quarterly, or yearly" });
    }

    // Calculate expiry date
    let expiryDate = null;
    if (tier !== 'free') {
      expiryDate = new Date();
      const monthsToAdd = months || (tier === 'monthly' ? 1 : tier === 'quarterly' ? 3 : 12);
      expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
    }

    // Update user subscription
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        subscriptionTier: tier,
        subscriptionExpiry: expiryDate,
        monthlyTransactionCount: 0, // Reset counter on upgrade
        lastResetDate: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: `Successfully upgraded to ${tier} plan`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        subscriptionExpiry: user.subscriptionExpiry,
        monthlyTransactionCount: user.monthlyTransactionCount
      }
    });

  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade subscription" });
  }
});

// Get current user's subscription details
router.get("/my-subscription", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiry: user.subscriptionExpiry,
      monthlyTransactionCount: user.monthlyTransactionCount,
      lastResetDate: user.lastResetDate,
      isActive: user.subscriptionTier === 'free' || (user.subscriptionExpiry && new Date() < new Date(user.subscriptionExpiry))
    });

  } catch (error) {
    console.error("Subscription fetch error:", error);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

export default router;
