import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import axios from "axios";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

async function getAuth0Token() {
  try {
    const auth0Response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Retrieved Auth0 Token");
    return auth0Response.data.access_token;
  } catch (err) {
    console.error("Auth0 Token Error:", err.response?.data || err.message);
    throw new Error("Failed to retrieve Auth0 token");
  }
}

router.post("/stripe", async (req, res) => {
  try {
    const { items, total, email, userId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    console.log(
      "🔹 Received Token from Frontend:",
      token || "No token provided"
    );

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
        userId: userId || "guest",
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart",
    });

    console.log("Session Created with Metadata:", session.metadata);
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    console.log("🔹 Received Stripe Webhook Event");

    if (!sig) {
      console.error("Missing Stripe Signature");
      return res.status(400).json({ error: "Missing Stripe Signature" });
    }

    const rawBody = req.body.toString();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("🔹 Webhook Event Type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Payment Success:", session);

      if (!session.metadata?.cart) {
        console.error("Missing cart metadata in session!");
        return res.status(400).json({ error: "Missing cart metadata" });
      }

      const orderItems = JSON.parse(session.metadata.cart);
      console.log("🛒 Items in Order:", orderItems);

      const auth0Id = session.metadata?.userId;
      console.log("🔍 Received auth0Id from metadata:", auth0Id);

      let user = null;

      if (auth0Id && auth0Id !== "guest") {
        console.log("🔹 Fetching user from Auth0...");

        try {
          const auth0Token = await getAuth0Token();
          const auth0Response = await axios.get(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0Id}`,
            {
              headers: { Authorization: `Bearer ${auth0Token}` },
            }
          );
          user = auth0Response.data;
          console.log("Auth0 User Fetched:", user);
        } catch (err) {
          console.error(`Failed to fetch user from Auth0: ${err.message}`);
        }
      }

      for (const item of orderItems) {
        const product = await Product.findById(item.id);
        if (!product) {
          console.error(`Product not found: ${item.id}`);
          continue;
        }

        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
        console.log(`Updated Stock for ${product.name}: ${product.stock}`);
      }

      const newOrder = new Order({
        user: {
          auth0_id: user?.user_id || "guest",
          email: user?.email || "guest@example.com",
        },
        items: orderItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
        total: session.amount_total / 100,
        status: "completed",
        createdAt: new Date(),
      });

      await newOrder.save();
      console.log("Order Saved with User:", user?.email || "Guest Checkout");
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(400).json({ error: err.message });
  }
});

export default router;
