import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { placeOrder, verifyOrder , userOrder, listOrders,updateStatus} from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userOrder",authMiddleware,userOrder);
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus)
export default orderRouter;
