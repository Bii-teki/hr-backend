const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // 1 hour
  },
});

module.exports = mongoose.model('Token', TokenSchema);