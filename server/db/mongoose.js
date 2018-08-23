var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

mongoose.Promise = global.Promise;

var databaseUri;
if (process.env.MONGODB_URI) {
  databaseUri = process.env.MONGODB_URI;
} else {
  console.log('ENV VAR FALSE');
  databaseUri = 'mongodb://localhost:27017/pint-clone';
}

mongoose.connect(databaseUri, {
  UseMongoClient: true
});

module.exports = {mongoose};
