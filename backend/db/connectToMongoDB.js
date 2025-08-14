import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env file only in local development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log(".env file loaded for local development");
}

// Get Mongo URI from environment variables
const mongoURI = process.env.MONGO_DB_URI;

// 🔍 Debugging logs (safe in dev, avoid in prod)
console.log("NODE_ENV:", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  console.log("Loaded MONGO_DB_URI from env file:", mongoURI);
} else {
  console.log("Using MONGO_DB_URI from Azure Application Settings");
}

// 🚨 Fail fast if MONGO_DB_URI is missing
if (!mongoURI) {
  throw new Error("❌ MONGO_DB_URI is not defined in the environment variables");
}

// ✅ Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectToMongoDB;
