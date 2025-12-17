import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  occupation: { type: String },
  dob: { type: Date },
  companyName: { type: String },
  startedYear: { type: Number },
  
  // Subscription fields
  subscriptionTier: { 
    type: String, 
    enum: ['free', 'monthly', 'quarterly', 'yearly'], 
    default: 'free' 
  },
  subscriptionExpiry: { type: Date },
  subscriptionStartDate: { type: Date },
  
  // Usage tracking
  monthlyTransactionCount: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now },
  
  // Payment tracking
  paymentHistory: [{
    amount: Number,
    plan: String,
    date: { type: Date, default: Date.now },
    paymentId: String,
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' }
  }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);

