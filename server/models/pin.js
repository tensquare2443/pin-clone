const mongoose = require('mongoose');

var PinSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  url: {
    type: String,
    required: true,
    maxLength: 1024
  },
  description: {
    type: String,
    maxLength: 1024
  },
  comments: [{
    comment: {type: String},
    user: {type: String}
  }]
});
//make comments array Strings 'object ids' that reference comments in a different model


var Pin = mongoose.model('Pin', PinSchema);

module.exports = {Pin};
