import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
});

const UserSchema = new mongoose.Schema({
  auth0_id: {
    type: String,
    required: [true, 'Auth0 ID is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (v) => /.+@.+\..+/.test(v),
      message: 'Invalid email format'
    }
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    minLength: [3, 'Username must be at least 3 characters']
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  addresses: [AddressSchema], 
});

export default mongoose.model("User", UserSchema);
