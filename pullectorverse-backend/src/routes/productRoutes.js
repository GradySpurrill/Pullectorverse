import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    const filter = category ? { category } : {};
    const sort = {};


    if (sortBy === "price_asc") sort.price = 1;
    if (sortBy === "price_desc") sort.price = -1;
    if (sortBy === "popularity") sort.popularity = -1;
    if (sortBy === "newest") sort.createdAt = -1;

    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;