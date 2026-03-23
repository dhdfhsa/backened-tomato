import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "User id and item id are required" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding item to cart" });
    }
};

// remove item from user cart
const removeFromCart = async (req, res) => {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "User id and item id are required" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (!cartData[itemId]) {
            return res.json({ success: true, message: "Item is not in cart", cartData });
        }

        cartData[itemId] -= 1;

        if (cartData[itemId] <= 0) {
            delete cartData[itemId];
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item removed from cart", cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
};

// fetch user cart data
const getCart = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User id is required" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching cart data" });
    }
};

export { addToCart, removeFromCart, getCart };
