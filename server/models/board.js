const mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
  name: {
    type: String
  },
  creator: {
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
});
//make comments array Strings 'object ids' that reference comments in a different model


var Board = mongoose.model('Board', BoardSchema);

module.exports = {Board};
