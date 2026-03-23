import "dotenv/config";
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("DB Connected");
}
