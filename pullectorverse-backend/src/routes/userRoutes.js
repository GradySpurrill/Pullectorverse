import express from "express";
import User from "../models/userModel.js";
import { checkJwt } from "../middleware/checkJwt.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

async function getAuth0Token() {
  try {
    const auth0Response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: process.env.AUTH0_M2M_CLIENT_ID,
        client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Retrieved Auth0 Token:", auth0Response.data.access_token);
    return auth0Response.data.access_token;
  } catch (err) {
    console.error("Auth0 Token Error:", err.response?.data || err.message);
    throw new Error("Failed to retrieve Auth0 token");
  }
}

async function findOrCreateUser(userClaims) {
  let userDoc = await User.findOne({ auth0_id: userClaims.sub });

  if (!userDoc) {
    console.log("Creating new user...");
    userDoc = new User({
      auth0_id: userClaims.sub,
      email: userClaims.email,
      username:
        userClaims.nickname ||
        userClaims.name ||
        `user-${userClaims.sub.slice(0, 8)}`,
      cart: [],
      orders: [],
      addresses: [],
    });

    await userDoc.save();
  }

  return userDoc;
}

router.get("/:auth0_id", checkJwt, async (req, res) => {
  try {
    const { auth0_id } = req.params;
    console.log("🔍 Fetching user from DB with Auth0 ID:", auth0_id);

    let userDoc = await User.findOne({ auth0_id });

    if (!userDoc) {
      console.log("User not found in DB, creating new user...");

      const authToken = req.headers.authorization?.split(" ")[1];

      if (!authToken) {
        console.error("No Authorization Token Provided.");
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }

      const auth0UserRes = await axios.get(
        `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const auth0User = auth0UserRes.data;
      console.log("🔹 Auth0 User Data Retrieved:", auth0User);

      userDoc = new User({
        auth0_id: auth0User.sub,
        email: auth0User.email || `${auth0User.sub}@temp.pullectorverse`,
        username:
          auth0User.nickname ||
          auth0User.name ||
          `user-${auth0User.sub.slice(0, 8)}`,
        cart: [],
        orders: [],
        addresses: [],
      });

      await userDoc.save();
      console.log("New User Created in DB:", userDoc);
    } else {
      console.log("Found existing user:", userDoc);
    }

    res.json({
      auth0_id: userDoc.auth0_id,
      username: userDoc.username,
      email: userDoc.email,
      addresses: userDoc.addresses,
      cart: userDoc.cart,
    });
  } catch (err) {
    console.error("Error fetching user:", err.response?.data || err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/me", checkJwt, async (req, res) => {
  try {
    console.log("🔍 Received request to /me");
    console.log("🔹 Auth0 Token Claims:", req.auth);

    if (!req.auth) {
      console.error("No Auth0 token found in request!");
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "No authentication provided" });
    }

    const userAuth0Id = req.auth.sub;
    console.log("🔍 Searching user in DB for Auth0 ID:", userAuth0Id);

    const userDoc = await User.findOne({ auth0_id: userAuth0Id });

    if (!userDoc) {
      console.error("User not found in database!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found user:", userDoc);
    res.json({
      auth0_id: userDoc.auth0_id,
      username: userDoc.username,
      email: userDoc.email,
      addresses: userDoc.addresses,
      cart: userDoc.cart,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

router.use("/:auth0_id/address", checkJwt, async (req, res, next) => {
  try {
    if (req.params.auth0_id !== req.auth.sub) {
      return res.status(403).json({ message: "Forbidden: ID mismatch" });
    }
    req.userDoc = await findOrCreateUser(req.auth);
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error validating user", error: err.message });
  }
});

router.get("/:auth0_id/address", async (req, res) => {
  try {
    res.json(req.userDoc.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:auth0_id/address", async (req, res) => {
  try {
    req.userDoc.addresses.push(req.body);
    await req.userDoc.save();
    res.status(201).json(req.userDoc.addresses.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        email: email,
        connection: "Username-Password-Authentication",
      }
    );

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(
      "Auth0 Password Reset Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to send password reset email.",
      details: error.response?.data?.error_description || error.message,
    });
  }
});

export default router;
