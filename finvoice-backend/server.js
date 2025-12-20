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
import aiRoutes from "./routes/ai.js";
import adminRoutes from "./routes/admin.js";
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
const allowedOrigins = [
  'http://localhost:3000',
  'https://finvoice-ai-kappa.vercel.app',
  'https://finvoiceai.com',
  'https://www.finvoiceai.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
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
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ FinVoice.AI Backend is running...");
});

// Keep MongoDB connection alive
setInterval(async () => {
  try {
    await mongoose.connection.db.admin().ping();
    console.log('💓 MongoDB ping successful');
  } catch (error) {
    console.error('❌ MongoDB ping failed:', error.message);
  }
}, 5 * 60 * 1000); // Ping every 5 minutes

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
