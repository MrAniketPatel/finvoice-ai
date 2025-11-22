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

dotenv.config();

const app = express();

// ✅ Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect DB
connectDB();

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
