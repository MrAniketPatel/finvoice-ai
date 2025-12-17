import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    console.log("🔍 Checking environment variables...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log("mongoURI value:", mongoURI ? "Found" : "NOT FOUND");
    
    if (!mongoURI) {
      console.error("❌ No MongoDB URI found in environment variables!");
      console.error("Available env vars:", Object.keys(process.env).filter(key => key.includes('MONGO')));
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    
    console.log("🔌 Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;

