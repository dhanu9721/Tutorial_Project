const express = require('express');
const auths = require('../config/auths')
// const router = express.Router();
const router = express.Router();
const userController=require("../controllers/user.controller");
// const passport = require("../config/authn");
// const passport = require('passport');
// var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;


router.post("/signup",auths.optional,userController.signup)

router.post("/login",auths.optional,userController.login)
// router.post("/verify",auths.optional,userController.verifyPhoneOtp);
// // router.post('/login',passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login',failureFlash: true }));

// router.get('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err); }
//       if (!user) { return res.redirect('/login'); }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         return res.redirect('/users/' + user.username);
//       });
//     })(req, res, next);
//   });

module.exports = router;