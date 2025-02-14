import express from "express";
import Cart from "../models/cartModel.js";

const router = express.Router();

router.use((req, res, next) => {
  const loggedInUserId = null;

  if (loggedInUserId) {
    req.currentUserId = loggedInUserId;
  } else {
    if (!req.session.guestUserId) {
      req.session.guestUserId =
        "guest-" + Date.now() + "-" + Math.random().toString(36).substring(2);
    }
    req.currentUserId = req.session.guestUserId;
  }

  next();
});

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.currentUserId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json([]);
    }
    res.json(cart.items);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.currentUserId });
    if (!cart) {
      cart = new Cart({ userId: req.currentUserId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("items.productId");
    res.json(cart.items);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:productId", async (req, res) => {
  const { quantity } = req.body; 

  try {
    const cart = await Cart.findOne({ userId: req.currentUserId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");
    res.json(cart.items);
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.currentUserId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.productId");
    res.json(cart.items);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.currentUserId });
    if (!cart) {
      return res.json([]); 
    }
    cart.items = [];
    await cart.save();
    res.json([]);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
