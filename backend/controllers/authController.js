const User = require('../models/User');
const { generateToken, setTokenCookie } = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Log cookie setting for debugging
    console.log('Registration successful - Cookie set:', {
      userId: user._id,
      email: user.email,
      origin: req.headers.origin,
      cookieHeader: res.getHeader('Set-Cookie') ? 'Set' : 'Not set'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
      // Token is stored in httpOnly cookie (secure) - not returned in response
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Log cookie setting for debugging
    console.log('Login successful - Cookie set:', {
      userId: user._id,
      email: user.email,
      origin: req.headers.origin,
      cookieHeader: res.getHeader('Set-Cookie') ? 'Set' : 'Not set'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
      // Token is stored in httpOnly cookie (secure) - not returned in response
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: false, // Always false for localhost development
    sameSite: 'strict',
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};