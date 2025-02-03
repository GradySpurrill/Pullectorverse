import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Booster Box",
      "Blister Pack",
      "Booster Pack",
      "Elite Trainer Box",
      "Collection Box",
      "Theme Deck",
      "Tin",
      "Ungraded Card",
      "Graded Card",
      "Accessory",  
      "Booster Bundle",
    ],
  },
  description: String,
  images: [String], 
  stock: {
    type: Number,
    default: 0,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Fields for Ungraded Cards 
  condition: { type: String, default: null },  
  rarity: { type: String, default: null },

  // Fields for Graded Cards
  gradingCompany: { type: String, default: null },  
  grade: { type: String, default: null },

  // Fields for Accessories 
  accessoryType: { type: String, default: null }, 
  quantityPerPack: { type: Number, default: null }, 

  // Shared 
  details: {
    set: { type: String, default: null },
    expansion: { type: String, default: null },
    cardNumber: { type: String, default: null },
  }
});

export default mongoose.model("Product", ProductSchema);
