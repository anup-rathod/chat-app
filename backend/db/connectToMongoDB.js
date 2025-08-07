import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Environment variables loaded:", process.env); // Debug log

const connectToMongoDB = async () => {
    try {
        if (!process.env.MONGO_DB_URI) {
            throw new Error("MONGO_DB_URI is not defined in the environment variables");
        }
        console.log("MONGO_DB_URI:", process.env.MONGO_DB_URI); // Debug log
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
};

export default connectToMongoDB;