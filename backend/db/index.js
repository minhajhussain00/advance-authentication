import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Initiliasing mongodb instance...");
    await mongoose.connect( process.env.MONGODB_URI);
    console.log("MongoDB initialised successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
