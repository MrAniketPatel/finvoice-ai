import User from "../models/user.js";

// Subscription limits configuration
const SUBSCRIPTION_LIMITS = {
  free: {
    maxTransactions: 50,
    features: ['basic']
  },
  monthly: {
    maxTransactions: 150,
    features: ['basic', 'reports', 'alerts']
  },
  quarterly: {
    maxTransactions: 550,
    features: ['basic', 'reports', 'alerts', 'ai_voice']
  },
  yearly: {
    maxTransactions: Infinity,
    features: ['basic', 'reports', 'alerts', 'ai_voice', 'advanced_ai']
  }
};

// Reset monthly counter if needed
export const resetMonthlyCounter = async (user) => {
  const now = new Date();
  const lastReset = new Date(user.lastResetDate);
  
  // Check if we're in a new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    user.monthlyTransactionCount = 0;
    user.lastResetDate = now;
    await user.save();
  }
  
  return user;
};

// Check if user can add transaction
export const canAddTransaction = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Reset counter if needed
    user = await resetMonthlyCounter(user);
    
    // Check subscription expiry for paid plans
    if (user.subscriptionTier !== 'free' && user.subscriptionExpiry) {
      if (new Date() > new Date(user.subscriptionExpiry)) {
        // Subscription expired, downgrade to free
        user.subscriptionTier = 'free';
        user.monthlyTransactionCount = 0;
        await user.save();
      }
    }
    
    // Get limits for current tier
    const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier];
    
    // Check if user has reached limit
    if (user.monthlyTransactionCount >= limits.maxTransactions) {
      return res.status(403).json({ 
        error: "Transaction limit reached",
        message: `You've reached your ${limits.maxTransactions} transaction limit for this month. Upgrade to add more transactions.`,
        currentCount: user.monthlyTransactionCount,
        maxCount: limits.maxTransactions,
        subscriptionTier: user.subscriptionTier,
        upgradeRequired: true
      });
    }
    
    // Attach user and limits to request
    req.userWithLimits = user;
    req.subscriptionLimits = limits;
    
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ error: "Server error checking subscription" });
  }
};

// Increment transaction count after successful creation
export const incrementTransactionCount = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { monthlyTransactionCount: 1 }
    });
  } catch (error) {
    console.error("Error incrementing transaction count:", error);
  }
};

// Check if user has access to a feature
export const requireFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier];
      
      if (!limits.features.includes(featureName)) {
        return res.status(403).json({ 
          error: "Feature not available",
          message: `This feature requires a premium subscription. Your current plan: ${user.subscriptionTier}`,
          featureRequired: featureName,
          subscriptionTier: user.subscriptionTier,
          upgradeRequired: true
        });
      }
      
      next();
    } catch (error) {
      console.error("Feature check error:", error);
      res.status(500).json({ error: "Server error checking feature access" });
    }
  };
};

// Get usage stats for user
export const getUsageStats = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Reset counter if needed
    user = await resetMonthlyCounter(user);
    
    const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier];
    
    res.json({
      subscriptionTier: user.subscriptionTier,
      currentCount: user.monthlyTransactionCount,
      maxCount: limits.maxTransactions,
      remainingCount: limits.maxTransactions === Infinity ? Infinity : limits.maxTransactions - user.monthlyTransactionCount,
      percentage: limits.maxTransactions === Infinity ? 0 : Math.round((user.monthlyTransactionCount / limits.maxTransactions) * 100),
      subscriptionExpiry: user.subscriptionExpiry,
      features: limits.features,
      isUnlimited: limits.maxTransactions === Infinity
    });
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    res.status(500).json({ error: "Server error fetching usage stats" });
  }
};

export default {
  canAddTransaction,
  incrementTransactionCount,
  requireFeature,
  getUsageStats,
  resetMonthlyCounter
};
