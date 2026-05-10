import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const connURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        console.log("--- MongoDB Connection Attempt ---");
        console.log(`URI: ${connURI ? "Found (masked)" : "NOT FOUND!"}`);
        
        if (!connURI) {
            console.error("CRITICAL: MongoDB connection URI is missing from .env!");
            console.log("Check if your .env file has MONGODB_URI or MONGO_URI defined.");
            return;
        }

        const conn = await mongoose.connect(connURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Listen for internal connection errors after initial connection
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected.");
        });

    } catch (error) {
        console.error(`❌ MongoDB Connection Error Details: ${error.message}`);
        console.log("Troubleshooting steps:");
        console.log("1. Ensure local MongoDB service is running.");
        console.log("2. Check if your IP is whitelisted (if using Atlas).");
        console.log("3. Verify the URI string in your .env file.");
        process.exit(1);
    }
};

export default connectDB;
