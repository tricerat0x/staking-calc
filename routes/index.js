var express = require('express');
var router = express.Router();
const passport = require('passport');
var session = require('express-session');
var {totalReturnCalc} = require('../controllers/strategy');

router.get('/', function(req, res, next) {
  let isUserAuthenticated = req.isAuthenticated();
  console.log("Authenticated:", req.isAuthenticated()); 
  res.render('index', { title: 'Staking Total Returns Calculator', results: null, isUserAuthenticated: isUserAuthenticated });
});


router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

router.post('/', totalReturnCalc);

module.exports = router;
