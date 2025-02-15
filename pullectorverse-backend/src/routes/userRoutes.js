import express from 'express';
import User from '../models/userModel.js';
import { checkJwt } from '../middleware/checkJwt.js';
import axios from 'axios';

const router = express.Router();

async function findOrCreateUser(userClaims) {
  let userDoc = await User.findOne({ auth0_id: userClaims.sub });

  if (!userDoc) {
    console.log(" Creating new user...");
    userDoc = new User({
      auth0_id: userClaims.sub,
      email: userClaims.email,  
      username: userClaims.nickname || userClaims.name || `user-${userClaims.sub.slice(0, 8)}`,
      cart: [],
      orders: [],
      addresses: [],
    });

    await userDoc.save();
  } else if (userDoc.email !== userClaims.email) {
    console.log(" Updating user email in database:", userClaims.email);
    userDoc.email = userClaims.email;
    await userDoc.save();
  }

  return userDoc;
}

router.get('/:auth0_id', checkJwt, async (req, res) => {
  try {
    console.log(" Auth0 Token Claims:", req.auth);
    const userDoc = await findOrCreateUser(req.auth);

    res.json({
      username: userDoc.username,
      email: userDoc.email,
      addresses: userDoc.addresses,
      cart: userDoc.cart,
    });
  } catch (err) {
    console.error(" Error fetching user profile:", err);
    res.status(500).json({ message: err.message });
  }
});

router.use('/:auth0_id/address', checkJwt, async (req, res, next) => {
  try {
    if (req.params.auth0_id !== req.auth.sub) {
      return res.status(403).json({ message: 'Forbidden: ID mismatch' });
    }
    req.userDoc = await findOrCreateUser(req.auth);
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error validating user', error: err.message });
  }
});

router.get('/:auth0_id/address', async (req, res) => {
  try {
    res.json(req.userDoc.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:auth0_id/address', async (req, res) => {
  try {
    req.userDoc.addresses.push(req.body);
    await req.userDoc.save();
    res.status(201).json(req.userDoc.addresses.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    await axios.post(`https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`, {
      client_id: process.env.AUTH0_CLIENT_ID,  
      email: email,
      connection: 'Username-Password-Authentication' 
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error('Auth0 Password Reset Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to send password reset email.',
      details: error.response?.data?.error_description || error.message
    });
  }
});

export default router;
