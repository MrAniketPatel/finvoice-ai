import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import balanceSheetRoutes from "./routes/balancesheet.js";
import transactionRoutes from "./routes/transactions.js";
import alertRoutes from "./routes/alerts.js";
import profileRoutes from "./routes/profile.js";
import subscriptionRoutes from "./routes/subscription.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();

// Trust proxy - required for rate limiting behind Render/Vercel
app.set('trust proxy', 1);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// ✅ Allow requests from your frontend
app.use(
  cors({
    origin: true, // Allow all origins for development
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "10mb" })); // Limit payload size

// Connect DB
connectDB();

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authroutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/balancesheet", balanceSheetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ FinVoice.AI Backend is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
