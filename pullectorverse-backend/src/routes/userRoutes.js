import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Get user cart
router.get('/:id/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user cart
router.put('/:id/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.cart = req.body.cart; 
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;