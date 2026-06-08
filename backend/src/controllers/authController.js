const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email: normalizedEmail, password });
  const token = signToken(user._id);

  sendSuccess(res, 201, 'Account created successfully', { user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id);
  user.password = undefined;

  sendSuccess(res, 200, 'Logged in successfully', { user, token });
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile fetched successfully', { user: req.user });
});

module.exports = { signup, login, getMe };
