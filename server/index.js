var express = require('express');
var db = require('../database/index.js');
var bodyParser = require('body-parser');
const difference = require('underscore').difference;

var fs = require('fs');
var crypto = require('crypto');

// converts png files to icon files
var pngToIco = require('png-to-ico');

var session = require('express-session');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json({limit: '5mb'}));

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var router = express.Router();
var session = require('express-session');
require('../config/passport.js')(passport);

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));


app.get('/profile', isLoggedIn, function(req, res) {
  res.redirect('/?username=' + req.user[0]['name']);
});


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

var testConversion = function(){
  console.log(__dirname);
  pngToIco('server/favicon.png')
    .then(buf => {
      fs.writeFileSync('server/favicon.ico', buf);
    })
    .catch(console.error);
}
// call on client request
// testConversion();

var generateFilename = (fileData) => {
  var hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
}

app.get('/gallery', (req, res) => {
  var username = req.query.username;
  db.getUserId(username, artistId => {
    db.getAllFinalImagesOfArtist(artistId, galleryImages => {
      res.end(JSON.stringify(galleryImages));
    });
  });
});

app.get('/generate', (req, res) => {
  if (req.query.part) {
    var userPart = req.query.part;
    var diff = difference(['head', 'torso', 'legs'], [userPart])
    db.getImages(diff, (data) => {
      res.send(JSON.stringify(data));
    });
  } else {
    var fixedParts = [];
    if (req.query.headIsFixed === 'false') { fixedParts.push('head') }
    if (req.query.torsoIsFixed === 'false') { fixedParts.push('torso') }
    if (req.query.legsIsFixed === 'false') { fixedParts.push('legs') }
    console.log('fixedParts', fixedParts);
    db.getImages(fixedParts, (data) => {
      res.send(JSON.stringify(data));
    });
  }
});

app.post('/save', (req, res) => {
  var base64Data = req.body[req.query.part].path
  // .split(',')[1];
  // var fileName = generateFilename(base64Data);
  var username = req.body.head.artist;
  req.body[req.query.part].path = base64Data;
  // fs.writeFile(`./server/images/${fileName}.png`, base64Data, 'base64', (err) => {
  //   if (err) console.log(err);
  //   req.body[req.query.part].path = `./images/${fileName}.png`;
  //   let thePath = `images?path=${fileName}.png`;
  db.saveImageToFinalImage(req.body, req.query.part, base64Data, (data) => {
    res.end();
  });
  // });
});

app.get('/images', (req, res) => {
  var file = req.query.path;
  res.sendFile(`${__dirname}/images/${file}`, () => res.end());
});

app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});
