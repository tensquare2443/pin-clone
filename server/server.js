const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var mongoose = require("./db/mongoose");
var {User} = require('../server/models/user');
var {Pin} = require('../server/models/pin');

var app = express();
var port = 3001;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var multer = require('multer');
var upload = multer();

app.post('/pins/filter', (req, res) => {

  //CANNOT GET REQ BODY TO BE SENT HERE...

  var criteria = req.body;
  console.log(criteria);

  // Pin.find({description: {$regex: criteria, $options: 'i'}}).then((pinDocs) => {
  //   console.log({pinDocs});
  //
  //   res.send({pinDocs});
  // }).catch((e) => {
  //   console.log(`e: ${e}`);
  //
  //   res.send({e});
  // });
});

app.get('/users/all', (req, res) => {
  User.find({}).then((userDocs) => {
    userDocs = userDocs.map((userDoc) => {
      return {
        topics: userDoc.topics,
        pins: userDoc.pins,
        _id: userDoc._id,
        email: userDoc.email
      };
    });
    res.send({userDocs});
  }).catch((e) => {
    console.log({e});
    res.send({e});
  })
});

app.get('/pins/get', (req, res) => {
  Pin.find({}).then((pinDocs) => {
    res.send({pinDocs});
  }).catch((e) => {
    console.log(`e: ${e}`);
    res.send(e);
  })
});

app.post('/pins/new', upload.single('image'), (req, res) => {
  const url = req.body.url[0];
  const description = req.body.description[0];
  var response = {
    url: false,
    description: false,
    image: false
  };

  if (req.file && req.file.buffer) {
    var image = req.file.buffer;
  } else response.image = 'Error: please upload an image';

  const isUrlValid = (url) => {
    var test = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

    if(test == null) {
    	return false;
    } else return true;
  }
  if (!isUrlValid(url)) {
    response.url = 'Error: please enter a valid url';
  } else if (url.length === 0) {
    response.url = 'Error: please enter a valid url';
  } else if (url.length > 1024) {
    response.url = 'Error: url must be less than 1024 characters in length';
  } else response.url = false;

  if (description.length > 1024) {
    response.description = 'Error: description must be less than 1024 characters in length';
  } else response.description = false;

  if (!response.image && !response.url && !response.description) {
    new Pin({image, url, description}).save().then((pinDoc) => {
      //send to user's pins array here
      var pins = JSON.parse(req.body.user).pins;

      pins.push(pinDoc._id);

      //SOMEWHERE AROUND HERE

      return User.findByIdAndUpdate(req.body.user._id, {$set: {pins}});
    }).then((userDoc) => {
      //update userDoc
      res.send({userDoc});
    }).catch((e) => {
      console.log(`pinSaveErr: ${e}`);

      res.send({e});
    });
  } else {
    res.send({response});
  }
});

app.post('/user/login', (req, res) => {
  User.findOne({email: req.body.email}).then((userDoc) => {
    if (!userDoc) {
      //email nonexistent
      res.send({email_error: 'Email is incorrect'});
    }
    //email exists
    if (req.body.password === userDoc.password) {
      res.send({userDoc});
    } else {
      res.send({password_error: 'Password is incorrect'});
    }

  }).catch((e) => {
    console.log(`e: ${e}`);
    res.send({server_error: 'Server cannot be reached.'});
  });
});

app.post('/user/new', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  var age = req.body.age;
  var errors = {
    email: false,
    password: false,
    age: false
  };

  const symbols = /[~!@#$%^&*()_+-=]/g;
  if (password.length < 8) {
    errors.password = 'Password must be at least eight characters in length';
  } else if (password.length > 24) {
    errors.password = 'Password must be less than twenty-four characters in length';
  } else if (password === password.toLowerCase()) {
    errors.password = 'Password must contain an upper case letter';
  } else if (password.replace(symbols, '') === password) {
    errors.password = `Password must contain one of the following symbols:\n${symbols}`;
  } else if (password.replace(/[A-Za-z0-9~!@#$%^&*()_+-=]/g, '').length > 0) {
    errors.password = `Password must contain only letters, numbers, and these symbols: ~ ! @ # $ % ^ & * ( ) _ + - =`;
  } else {
    errors.password = false;
  }

  if (isNaN(age) || age.length > 3 || age.length < 1) {
    errors.age = 'Please enter a valid age';
  } else {
    errors.age = false;
  }


  var validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  };
  if (validateEmail(email)) {
    errors.email = false;
    if (!errors.password && !errors.age) {
      console.log('no pword no age errros');
      age = age/1;

      new User({email,password,age}).save().then((doc) => {
        res.send({doc});
      }).catch((e) => {
        if (e.message && e.message.includes('duplicate key') && e.message.includes('email_1')) {
          errors.email = 'Email already in use';
        } else {
          errors.email = 'Unknown server error';
        }
        res.send({errors});
      });
    } else {
      res.send({errors});
    }


  } else {
    errors.email = 'Must enter a valid email';
    res.send({errors});
  }
});

app.listen(3001, () => {
  console.log(`Server live on ${port}`);
});
