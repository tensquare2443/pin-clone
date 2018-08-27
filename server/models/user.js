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
    image: {
      type: String
    },
    url: {
      type: String,
      maxLength: 1024
    },
    description: {
      type: String,
      maxLength: 1024
    },
    creator: {
      type: String
    },
    comments: [{
      comment: {type: String},
      user: {type: String}
    }],
    posters: [{
      type: String
    }]
  }],
  boards: [{
    name: {
      type: String
    },
    followers: [{
      type: String
    }],
    pins: [{
      image: {
        type: String
      },
      url: {
        type: String
      },
      description: {
        type: String
      },
      creator: {
        type: String
      },
      comments: [{
        comment: {type: String},
        user: {type: String}
      }],
      posters: [{
        type: String
      }]
    }]
  }],
  usersFollowing: [{
    type: String
  }],
  boardsFollowing: [{
    name: {type: String},
    creator: {type: String}
  }],
  followedBy: [{
    type: String
  }]
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
