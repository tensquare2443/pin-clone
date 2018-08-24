const mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  creator: {
    type: String
  },
  followers: [{
    type: String
  }],
  pins: [{
    image: {
      data: Buffer,
      contentType: String
    },
    url: {
      type: String
    },
    description: {
      type: String
    },
    comments: [{
      comment: {type: String},
      user: {type: String}
    }]
  }]
});
//make comments array Strings 'object ids' that reference comments in a different model


var Board = mongoose.model('Board', BoardSchema);

module.exports = {Board};
