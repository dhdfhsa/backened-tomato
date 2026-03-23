import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const currency = "bdt";
const deliveryCharge = 2;

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Create a Stripe Checkout session for the current cart.
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !Array.isArray(items) || !items.length || !address) {
      return res.json({
        success: false,
        message: "Order information is incomplete",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || "http://localhost:5173";
    const stripe = getStripeClient();

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error while placing order",
    });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { userId, orderId, success } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order || order.userId !== userId) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Payment verified",
      });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({
      success: false,
      message: "Payment was cancelled",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error verifying order",
    });
  }
};

// userorder for frontened

export const userOrder = async(req,res)=>{
try {
  const orders = await orderModel.find({userId:req.body.userId})
  res.json({success:true,data:orders})
} catch (error) {
  console.log(error)
  res.json({success:false,message:"Error"})
}
}


// Listing orders for admin panel

export const listOrders  =async(req,res)=>{
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
}


// api for updating order status

export const updateStatus = async(req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}