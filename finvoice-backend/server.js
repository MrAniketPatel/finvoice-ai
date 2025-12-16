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
import { apiLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();

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
  "http://localhost:3000", // Local development
  "http://localhost:3000/finvoice-ai", // Local development with path
  "https://mraniketpatel.github.io", // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost on any port for development
      if (origin && origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
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

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ FinVoice.AI Backend is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
