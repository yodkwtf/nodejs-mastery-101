const mongoose = require('mongoose');
const validator = require('validator');

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, 'Please provide an email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 3,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', UserSchema);