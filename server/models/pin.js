const mongoose = require('mongoose');

var PinSchema = new mongoose.Schema({
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
});
//make comments array Strings 'object ids' that reference comments in a different model


var Pin = mongoose.model('Pin', PinSchema);

module.exports = {Pin};
