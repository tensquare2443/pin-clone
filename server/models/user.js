const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 24
  },
  age: {
    type: Number,
    required: true
  },
  createdAt: {
    type: String
  },
  photo: {
    type: String
  },
  topics: [{
    type: String
  }],
  pins: [{
    type: String
  }]
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
