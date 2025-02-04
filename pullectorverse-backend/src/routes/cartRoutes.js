// routes/cartRoutes.js
import express from "express";
import Cart from "../models/cartModel.js";

const router = express.Router();

/**
 * This middleware checks if a user is logged in or not.
 * If "loggedInUserId" is present, we use that.
 * Otherwise, we generate/find a "guestUserId" in the session.
 */
router.use((req, res, next) => {
  // 1) Example: If you had user info from Auth0 or JWT,
  //    you'd do something like: const loggedInUserId = req.user?.sub ?? null;
  //    Here, we're hardcoding `null` for demonstration.
  const loggedInUserId = null;

  if (loggedInUserId) {
    req.currentUserId = loggedInUserId;
  } else {
    // Not logged in => guest
    if (!req.session.guestUserId) {
      req.session.guestUserId =
        "guest-" + Date.now() + "-" + Math.random().toString(36).substring(2);
    }
    req.currentUserId = req.session.guestUserId;
  }

  next();
});

/**
 * GET /api/cart
 * Fetch the current user's (or guest's) cart
 */
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.currentUserId }).populate(
      "items.productId"
    );

    // If no cart found, respond with empty array
    if (!cart) {
      return res.json([]);
    }
    res.json(cart.items);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/cart
 * Add an item to the current user's cart
 */
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    //Find or create a cart for this userId
    let cart = await Cart.findOne({ userId: req.currentUserId });
    if (!cart) {
      cart = new Cart({ userId: req.currentUserId, items: [] });
    }

    //Check if item already exists
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    //Save and respond
    await cart.save();
    await cart.populate("items.productId");
    res.json(cart.items);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/cart/:productId
 * Update the quantity of an existing cart item
 */
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

/**
 * DELETE /api/cart/:productId
 * Remove a single product from the cart
 */
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

/**
 * OPTIONAL: DELETE /api/cart
 * Clear the entire cart
 */
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
