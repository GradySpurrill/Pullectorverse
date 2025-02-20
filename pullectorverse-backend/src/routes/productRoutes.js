import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Fetching products from MongoDB...");

    const products = await Product.find({});

    if (!products.length) {
      console.warn("No products found in MongoDB!");
    }

    res.json(products);
  } catch (error) {
    console.error("Error Fetching Products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
});

export default router;
