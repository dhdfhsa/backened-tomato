import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { addFood, listFood, removeFood } from "../controllers/foodControllers.js";

const foodRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uplodes");
const isVercel = process.env.VERCEL === "1";

const upload = isVercel
  ? multer({ storage: multer.memoryStorage() })
  : multer({
      storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadsDir),
        filename: (_req, file, cb) => cb(null, `${Date.now()}${file.originalname}`),
      }),
    });

foodRouter.post(
  "/add",
  (req, res, next) => {
    if (isVercel) {
      return res.status(503).json({
        success: false,
        message: "Image uploads are disabled on Vercel until cloud storage is configured.",
      });
    }
    next();
  },
  upload.single("image"),
  addFood
);

foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
