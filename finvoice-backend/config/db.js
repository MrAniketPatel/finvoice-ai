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
    
    // Connection options for better stability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    await mongoose.connect(mongoURI, options);
    console.log("✅ MongoDB Connected Successfully");
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;

