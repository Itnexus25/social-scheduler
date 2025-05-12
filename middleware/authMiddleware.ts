const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token only

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request (optional: exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Go to the next middleware/route
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

module.exports = protect;
