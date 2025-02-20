import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    auth0_id: { type: String, required: false },
    email: { type: String, required: false },
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      priceAtPurchase: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "completed"],
    default: "pending",
  },
  shippingAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", OrderSchema);
