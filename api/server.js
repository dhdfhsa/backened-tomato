import express from "express";
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import foodRouter from "../routes/FoodRoute.js";
import userRouter from "../routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "../routes/CartRoute.js";
import orderRouter from "../routes/orderRoute.js";

// app config

const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uplodes");

// middleware

app.use(express.json())
const allowedOrigins = [
  "https://frontened-tomato.vercel.app",
  "https://admin-tomato1-2zh5.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// db connection

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed", error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static(uploadsDir))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
    res.send("Hello work Api")
})

app.use((error, _req, res, _next) => {
    console.error("Unhandled application error", error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

if (process.env.VERCEL !== "1") {
    app.listen(port,()=>{
        console.log(`Server Started on http://localhost:${port}`)
    })
}

export default app;
