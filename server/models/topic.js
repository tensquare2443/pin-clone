const mongoose = require('mongoose');

var TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

/*
        "Technology",
        "Travel",
        "Food and drink",
        "Men's apparel", 
        "Art"
*/

var Topic = mongoose.model('Topic', TopicSchema);

module.exports = {Topic};
