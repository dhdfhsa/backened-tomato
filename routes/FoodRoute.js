import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { addFood, listFood, removeFood } from "../controllers/foodControllers.js";

const foodRouter = express.Router();

// ১. Cloudinary কনফিগারেশন (আপনার .env ফাইল থেকে ডাটা নেবে)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ২. Cloudinary-তে ইমেজ সেভ করার সেটিংস (Vercel-এর জন্য এটিই সেরা)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tomato_food_items', // Cloudinary ড্যাশবোর্ডে এই ফোল্ডারটি তৈরি হবে
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // ইমেজের সাইজ অটোমেটিক কন্ট্রোল করবে
  },
});

const upload = multer({ storage: storage });

// ৩. সব রাউট বা এন্ডপয়েন্ট (Endpoints)
// নতুন খাবার যোগ করার জন্য (অ্যাডমিন প্যানেল থেকে)
foodRouter.post("/add", upload.single("image"), addFood);

// খাবারের তালিকা দেখার জন্য (ফ্রন্টএন্ড এবং অ্যাডমিন উভয়ের জন্য)
foodRouter.get("/list", listFood);

// খাবার মুছে ফেলার জন্য (অ্যাডমিন প্যানেল থেকে)
foodRouter.post("/remove", removeFood);

export default foodRouter;