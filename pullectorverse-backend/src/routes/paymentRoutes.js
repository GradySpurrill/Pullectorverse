import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/stripe", async (req, res) => {
  try {
    const { items, total, email } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      customer_email: email, 
      metadata: {
        cart: JSON.stringify(items), 
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});


router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;


        const user = await User.findOne({ email: session.customer_email });

        if (!user) {
          console.error("User not found:", session.customer_email);
          return res.status(400).json({ error: "User not found" });
        }


        const orderItems = session.metadata?.cart
          ? JSON.parse(session.metadata.cart) 
          : [];

        const newOrder = new Order({
          user: user._id,
          items: orderItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
          total: session.amount_total / 100, 
          status: "pending",
          createdAt: new Date(),
        });

        await newOrder.save();
        console.log("Order saved successfully:", newOrder);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook Error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;
