const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      // Clear invalid token from cookies
      res.cookie('token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        expires: new Date(0)
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token invalid or expired. Please login again.'
      });
    }
    
    // Get user from token (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found'
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { protect };