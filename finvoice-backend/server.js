import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import balanceSheetRoutes from "./routes/balancesheet.js";

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

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ FinVoice.AI Backend is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
