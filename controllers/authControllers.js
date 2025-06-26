const User = require('../models/Users');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
const { generateToken, generateRefreshToken } = require('../services/tokenService');

// @desc    Register a new user (HR Personnel)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    position: 'HR Personnel' 
  });

  // Generate verification token
  const verificationToken = await Token.create({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
  });


  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${user._id}/${verificationToken.token}`;
  
  await sendEmail({
    email: user.email,
    subject: 'Verify Your Account',
    message: `Please click on the following link to verify your account: ${verificationUrl}`,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      position: user.position,
    },
    message: 'Verification email sent. Please check your email to verify your account.'
  });
});

// @desc    Verify user account
// @route   GET /api/auth/verify/:userId/:token
// @access  Public
const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(400);
    throw new Error('Invalid link');
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!token) {
    res.status(400);
    throw new Error('Invalid or expired link');
  }

  user.isVerified = true;
  await user.save();
  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Account verified successfully. You can now log in.',
  });
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select the password field
  const user = await User.findOne({ email }).select('+password');


  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password exists (defensive programming)
  if (!user.password) {
    res.status(401);
    throw new Error('Authentication method not supported');
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Please verify your email before logging in');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Generate tokens (exclude sensitive data)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    position: user.position
  };

  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set secure cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    ...userData,
    accessToken,
    refreshToken
  });
});

const loginCandidate = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select the password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Optional: Check if user is a candidate (adjust according to your schema)
  if (user.position !== 'Candidate') {
    res.status(403);
    throw new Error('Access denied: Not a candidate');
  }

  if (!user.password) {
    res.status(401);
    throw new Error('Authentication method not supported');
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Please verify your email before logging in');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Generate tokens (exclude sensitive data)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    position: user.position
  };

  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set secure cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    ...userData,
    accessToken,
    refreshToken
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Public - because access token has expired
const refreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401);
    throw new Error('No refresh token found');
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        res.status(403);
        throw new Error('Invalid refresh token');
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      const accessToken = generateToken(user._id);

      res.json({ accessToken });
    }
  );
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `You are receiving this email because you (or someone else) has requested a password reset. Please click on the following link to reset your password: \n\n ${resetUrl} \n\n This link will expire in 10 minutes.`,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  loginCandidate,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};