const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

// # REGISTER USER
const register = async (req, res) => {
  // get the email
  const { name, password, email } = req.body;

  // find a user by email entered
  const emailAlreadyExists = await User.findOne({ email });

  // if user found, throw duplicate register error
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // set up first account as admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // create a user with specific properties
  const user = await User.create({ name, email, password, role });

  // create a token user to send token specific properties
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  // create and send cookies with response[utils]
  attachCookiesToResponse({ res, user: tokenUser });

  // send back the user as a response
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// # LOGIN
const login = async (req, res) => {
  // get email and pass
  const { email, password } = req.body;

  // if no email/password entered
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  // find user by email
  const user = await User.findOne({ email });

  // if no such user found
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // compare password using instacne method
  const isPasswordCorrect = await user.comparePassword(password);

  // if password is incorrect
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // if user found, create a token user to send token specific properties
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  // create and send cookies with response[utils]
  attachCookiesToResponse({ res, user: tokenUser });

  // send back the user as a response
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// # LOGOUT
const logout = async (req, res) => {
  res.send('the LOGOUT controller');
};

module.exports = {
  register,
  login,
  logout,
};
