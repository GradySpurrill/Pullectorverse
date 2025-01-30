import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Create an order
router.post('/', async (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body;

    // Create order
    const order = new Order({
      user: userId,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
      total,
      shippingAddress,
    });

    // Clear user's cart
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;