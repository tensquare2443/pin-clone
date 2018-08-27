const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var mongooseTypes = require('mongoose').Types;
var mongoose = require("./db/mongoose");
var {User} = require('../server/models/user');
var {Pin} = require('../server/models/pin');
var {Topic} = require('../server/models/topic');
var {Board} = require('../server/models/board');
var encode = require('base64-arraybuffer').encode;
var {imgurClientId} = require('../src/vars');

var app = express();
var port = 3001;

var axios = require('axios');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var multer = require('multer');
var upload = multer();

app.post('/pins/filter', (req, res) => {
  var allPinDocs = [];
  var query = new RegExp(req.body.filterCriteria, 'i');

  Pin.find({url: query}).then((urlPinDocs) => {
    urlPinDocs.forEach((urlPinDoc) => {
      allPinDocs.push(urlPinDoc);
    });

    return Pin.find({description: query});
  }).then((descPinDocs) => {
    descPinDocs.forEach((descPinDoc) => {
      allPinDocs.push(descPinDoc);
    });

    res.send({allPinDocs});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  })
});

app.post('/user/unfollow', (req, res) => {
  var userEmailToUnfollow = req.body.userEmailToUnfollow;
  var newUserDoc = req.body.newUserDoc;

  User.findOne({email: userEmailToUnfollow}).then((userDoc) => {
    if (userDoc.followedBy && userDoc.followedBy.includes(newUserDoc.email)) {
      userDoc.followedBy.splice(userDoc.followedBy.indexOf(newUserDoc.email), 1);
    }

    return User.findByIdAndUpdate(userDoc._id, userDoc, {new: true});
  }).then((userDoc) => {
    return User.findByIdAndUpdate(newUserDoc._id, newUserDoc, {new: true});
  }).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });
});

app.post('/user/follow', (req, res) => {
  var userToFollow = req.body.userToFollow;
  var newUserDoc = req.body.newUserDoc;

  User.findOne({email: userToFollow}).then((userDoc) => {
    if (userDoc.followedBy) {
      userDoc.followedBy.push(newUserDoc.email);
    } else {
      userDoc.followedBy = [newUserDoc.email];
    }
    return User.findByIdAndUpdate(userDoc._id, userDoc, {new: true});
  }).then((userDoc) => {
    return User.findByIdAndUpdate(newUserDoc._id, newUserDoc, {new: true});
  }).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });
});

app.post('/user/update-and-check-pins-collection', (req, res) => {
  var user = req.body.user;
  var pinsToCheck = req.body.pinsToDelete;

  console.log(pinsToCheck);

  pinsToCheck.forEach((pinId, index) => {

    Pin.findOne({_id: pinId}).then((pinDoc) => {
      for (var i = 0; i < pinDoc.posters.length; i++) {
        if (pinDoc.posters[i] === user.email) {
          pinDoc.posters.splice(i, 1);
          break;
        }
      }
      if (pinDoc.posters.length === 0) {
        //remove pin from Pin
        return Pin.findOneAndRemove({_id: pinId});
      } else {
        //keep pin in Pin
        return 'pin kept';
      }
    }).then((response) => {
      if (index === pinsToCheck.length - 1) {
        return User.findByIdAndUpdate(user._id, user, {new: true});
      }
    }).then((userDoc) => {
      if (userDoc) {
        res.send({userDoc});
      }
    }).catch((e) => {
      console.log({e});

      res.send({e});
    });
  });

});

app.post('/pin/remove/from-board', (req, res) => {
  var user = req.body.user;
  var pin = req.body.pin;
  var pinExistsInOtherBoards = req.body.pinExistsInOtherBoards;

  if (!pinExistsInOtherBoards || pinExistsInOtherBoards === 'false') {
    Pin.findById(pin._id).then((pinDoc) => {
      for (var i = 0; i < pinDoc.posters.length; i++) {
        if (pinDoc.posters[i] === user.email) {
          pinDoc.posters.splice(i, 1);
          break;
        }
      }
      if (pinDoc.posters.length === 0) {
        //remove pinDoc
        return Pin.findOneAndRemove({_id: pin._id});
      } else {
        return Pin.findByIdAndUpdate(pin._id, pinDoc, {new: true});
      }
    }).then((pinDoc) => {
      return User.findByIdAndUpdate(user._id, user, {new: true});
    }).then((userDoc) => {
      res.send({userDoc});
    }).catch((e) => {
      console.log({e});

      res.send({e});
    })
  }
});

app.post('/pin/remove/general', (req, res) => {
  var user = req.body.user;
  var pin = req.body.pin;

  //Board collection is not updated, should maybe be, or should maybe just be removed entirely.

  Pin.findById(pin._id).then((pinDoc) => {

    if (pinDoc.posters) {
      for (var i = 0; i < pinDoc.posters.length; i++) {
        if (pinDoc.posters[i] === user.email) {
          pinDoc.posters.splice(i, 1);
          break;
        }
      }
      if (pinDoc.posters.length === 0) {
        //remove pinDoc
        return Pin.findOneAndRemove({_id: pin._id});
      } else {
        return Pin.findByIdAndUpdate(pin._id, pinDoc, {new: true});
      }
    }

  }).then((pinDoc) => {
    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });

});

app.post('/boards/new-and-save-pin', (req, res) => {
  var oldUser = req.body.user;
  var _id = oldUser._id;
  var board = req.body.board;
  var pin = req.body.board.pins[0];
  var newUser;

  new Board(board).save().then((boardDoc) => {
    oldUser.boards.push(boardDoc);
    oldUser.pins.push(pin);

    return User.findByIdAndUpdate(_id, oldUser, {new: true});
  }).then((userDoc) => {
    // res.send({userDoc});
    newUser = userDoc;

    if (pin.posters && !pin.posters.includes(oldUser.email)) {
      pin.posters.push(oldUser.email);
    }

    return Pin.findByIdAndUpdate(pin._id, pin, {new: true});
  }).then((pinDoc) => {
    res.send({userDoc: newUser});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });
});

app.post('/pins/save', (req, res) => {
  var user = req.body.user;
  var board = req.body.board;
  var pin = req.body.pin

  Board.findByIdAndUpdate(board._id, board, {new: true}).then((boardDoc) => {
    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    // res.send({userDoc});
    user = userDoc;

    //update posters arr in pin
    if (pin.posters && !pin.posters.includes(user.email)) {
      pin.posters.push(user.email);
    }

    return Pin.findByIdAndUpdate(pin._id, pin, {new: true});
  }).then((pinDoc) => {
    res.send({userDoc: user});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });
});

app.post('/board/new', (req, res) => {
  var board = new Board({
    name: req.body.board,
    creator: req.body.user.email,
    followers: [req.body.user.email],
    pins: []
  });

  board.save().then((boardDoc) => {
    if (!boardDoc) {return res.send({error: 404});}

    var user = req.body.user;
    if (!user.boards) {
      user.boards = [boardDoc];
    } else {
      user.boards.push(boardDoc);
    }

    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    if (!userDoc) {return res.send({error: 404});}

    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  })
});

app.post('/user/update', (req, res) => {
  var user = req.body.user;
  var _id = user._id;

  User.findByIdAndUpdate(_id, user, {new: true}).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  });
});

app.get('/topics', (req, res) => {
  Topic.find({}).then((topicDocs) => {
    res.send({topicDocs});
  }).catch((e) => {
    console.log({e});
    res.send({e});
  });
});

app.get('/topics/new/:topic', (req, res) => {
  var topic = new Topic({
    name: req.params.topic
  });

  topic.save().then((topicDoc) => {
    if (!topicDoc) {return res.send({error: 404});}
    res.send({topicDoc});
  }).catch((e) => {
    console.log({e});
    res.send({e});
  })
});

app.get('/users/all', (req, res) => {
  User.find({}).then((userDocs) => {
    userDocs = userDocs.map((userDoc) => {
      return {
        topics: userDoc.topics,
        pins: userDoc.pins,
        _id: userDoc._id,
        email: userDoc.email,
        photo: userDoc.photo
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


app.post('/profile-photo/upload', upload.single('profileImage'), (req, res) => {
  var user = JSON.parse(req.body.user);
  var base64Image = encode(req.file.buffer);

  axios({
    url: 'https://api.imgur.com/3/image',
    method: 'post',
    headers: {
      Authorization: `Client-ID ${imgurClientId}`
    },
    data: {
      image: base64Image
    }
  }).then((response) => {
    var imageUrl = response.data.data.link;

    user.photo = imageUrl;
    //save user
    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  })
});

app.post('/pins/create-and-create-new-board', upload.single('image'), (req, res) => {
  var user = JSON.parse(req.body.user).oldUser;
  var boardName = req.body.boardName;
  var url = req.body.url[0];
  var description = req.body.description[0];
  var base64Image = encode(req.file.buffer);

  //first create pin, send to Pin collection to get id
  //then create board, and send pin with it.
  //then push board into user, and pin into user
  axios({
    url: 'https://api.imgur.com/3/image',
    method: 'post',
    headers: {
      Authorization: `Client-ID ${imgurClientId}`
    },
    data: {
      image: base64Image
    }
  }).then((response) => {
    var imageUrl = response.data.data.link;
    var pin = {
      url,
      description,
      image: imageUrl,
      creator: user.email,
      comments: [],
      posters: [user.email]
    };

    return new Pin(pin).save();
  }).then((pinDoc) => {
    var board = {
      name: boardName,
      creator: user.email,
      followers: [user.email],
      pins: [pinDoc]
    };

    user.pins.push(pinDoc);

    return new Board(board).save();
  }).then((boardDoc) => {
    user.boards.push(boardDoc);

    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    res.send({userDoc});
  }).catch((e) => {
    console.log(`e: ${e}`);

    res.send({e});
  });
});

app.post('/pins/create-and-add-to-board', upload.single('image'), (req, res) => {
  var user = JSON.parse(req.body.user).oldUser;
  var board = JSON.parse(req.body.board).oldBoard;
  var url = req.body.url[0];
  var description = req.body.description[0];
  var base64Image = encode(req.file.buffer);

  // console.log(user);
  // console.log(board);
  // console.log(url);
  // console.log(description);
  // return;


  axios({
    url: 'https://api.imgur.com/3/image',
    method: 'post',
    headers: {
      Authorization: `Client-ID ${imgurClientId}`
    },
    data: {
      image: base64Image
    }
  }).then((response) => {
    var imageUrl = response.data.data.link;
    var pin = {
      url,
      description,
      image: imageUrl,
      creator: user.email,
      comments: [],
      posters: [user.email]
    };
    console.log(pin.posters);
    console.log(pin.posters);
    console.log(pin.posters);

    return new Pin(pin).save();
  }).then((pinDoc) => {
    user.pins.push(pinDoc);
    board.pins.push(pinDoc);

    for (var i = 0; i < user.boards.length; i++) {
      if (user.boards[i]._id === board._id) {
        user.boards.splice(i, 1, board);
        break;
      }
    }

    return User.findByIdAndUpdate(user._id, user, {new: true});
  }).then((userDoc) => {
    user = userDoc;

    return Board.findByIdAndUpdate(board._id, board, {new: true});
  }).then((boardDoc) => {
    res.send({userDoc: user});
  }).catch((e) => {
    console.log({e});

    res.send({e});
  })
});

app.post('/pins/new', upload.single('image'), (req, res) => {
  var user = JSON.parse(req.body.user);
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
    var base64Image = encode(req.file.buffer);

    axios({
      url: 'https://api.imgur.com/3/image',
      method: 'post',
      headers: {
        Authorization: `Client-ID ${imgurClientId}`
      },
      data: {
        image: base64Image
      }
    }).then((response) => {
      var imageUrl = response.data.data.link;
      var pin = {
        url,
        description,
        image: imageUrl,
        creator: user.email,
        comments: [],
        posters:[user.email]
      };

      return new Pin(pin).save();
    }).then((pinDoc) => {
      user.pins.push(pinDoc);

      return User.findByIdAndUpdate(user._id, user, {new: true});
    }).then((userDoc) => {
      res.send({userDoc});
    }).catch((e) => console.log(`e: ${e}`));
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
