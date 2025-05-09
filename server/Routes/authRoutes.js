// ==================================================================
// Step 1: Import Required Modules
// ==================================================================
const express = require('express');       // Express framework for handling routes
const axios = require('axios');           // Axios for making HTTP requests (token exchange)
const bcrypt = require('bcryptjs');       // For hashing passwords securely
const User = require('../models/User');   // Ensure you have a User model
const router = express.Router();

// Load environment variables from .env file
const META_CLIENT_ID = process.env.META_CLIENT_ID;
const META_CLIENT_SECRET = process.env.META_CLIENT_SECRET;
const META_REDIRECT_URI = process.env.META_REDIRECT_URI;

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;

// ==================================================================
// Step 2: Standard Login Route (Local Authentication)
// ==================================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // ✅ Retrieve the user from the database
  const user = await User.findOne({ email });
  console.log('DEBUG: Retrieved user:', user); // Debug log

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // ✅ Debugging - Log stored hashed password vs. input password before comparison
  console.log('DEBUG: Hashed password in DB:', user.password);
  console.log('DEBUG: Plain text password from request:', password);

  // ✅ Compare provided password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('DEBUG: bcrypt.compare result:', isMatch);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // ✅ Generate a mock token (Replace with real JWT logic)
  const token = `${user.email}-mockToken`;

  res.status(200).json({ message: 'Login successful', token, user });
});

// ==================================================================
// Step 3: Standard Signup Route (Local Authentication)
// ==================================================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // ✅ Generate salt and hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('DEBUG: Hashed password during signup:', hashedPassword); // Debug log

    // ✅ Store the hashed password in the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// ==================================================================
// Step 4: OAuth Login Routes (Redirect Users to Authentication)
// ==================================================================

// Facebook OAuth login route:
// Redirects users to Facebook's OAuth authentication page
router.get('/login/meta', (req, res) => {
  const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${META_CLIENT_ID}&redirect_uri=${META_REDIRECT_URI}&scope=email,public_profile`;
  res.redirect(authUrl); // Redirects user to Facebook login
});

// TikTok OAuth login route:
// Redirects users to TikTok's OAuth authentication page
router.get('/login/tiktok', (req, res) => {
  const authUrl = `https://www.tiktok.com/auth/authorize?client_key=${TIKTOK_CLIENT_KEY}&redirect_uri=${TIKTOK_REDIRECT_URI}&scope=user.info.basic`;
  res.redirect(authUrl); // Redirects user to TikTok login
});

// ==================================================================
// Step 5: OAuth Callback Routes (Exchange Authorization Code for Access Token)
// ==================================================================

// Facebook OAuth Callback Route:
// Handles the response from Facebook after user login and exchanges the code for an access token
router.get('/meta/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
      params: {
        client_id: META_CLIENT_ID,
        client_secret: META_CLIENT_SECRET,
        redirect_uri: META_REDIRECT_URI,
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch user profile with the access token
    const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json({ user: userResponse.data, accessToken });
  } catch (error) {
    console.error('Facebook OAuth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'OAuth authentication failed' });
  }
});

// TikTok OAuth Callback Route:
// Handles the response from TikTok after user login and exchanges the code for an access token
router.get('/tiktok/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(`https://open.tiktokapis.com/v2/oauth/token`, {
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      redirect_uri: TIKTOK_REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch user profile with the access token
    const userResponse = await axios.get(`https://open.tiktokapis.com/v2/user/info/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json({ user: userResponse.data, accessToken });
  } catch (error) {
    console.error('TikTok OAuth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'OAuth authentication failed' });
  }
});

// ==================================================================
// Step 6: Export Router
// ==================================================================
module.exports = router;