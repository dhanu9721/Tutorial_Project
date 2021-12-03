// const User = require("../models/user.model");
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const passport = require('passport');
// const responseTime = require('response-time')
const AUTH=require("../config/auth");
// const otpgt = require("../config/otp");
// const axios = require('axios');
// const redis = require('redis');
// const Redis = require('ioredis');

// // const auth = require('../config/auth');

// const redis = new Redis( {
//   retryStrategy: null
// });

// redis.on('end', () => {
//   log.warn('shutting down service due to lost Redis connection');

//   lightship.shutdown();
// });


// app.use(responseTime());
exports.signup = (req, res, next) => {
    if (!req.body.email) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const user = new Users({
        password: req.body.password,
        role: req.body.role,
        email: req.body.email
        // hash: req.body.hash,
        // salt: req.body.salt
        // isAdmin: req.body.isAdmin
    });
        if(!user.email) {
            return res.status(422).json({
              errors: {
                email: 'is required',
              },
            });
          }
        
          if(!user.password) {
            return res.status(422).json({
              errors: {
                password: 'is required',
              },
            });
          }
        
          const finalUser = new Users(user);
        
          finalUser.setPassword(user.password);
        
          return finalUser.save()
            .then(() => 
            // res.json({ user: finalUser.toAuthJSON() })
            res.json({statusCode:200,message:"Signed Up Successfully"})
            )
            .catch(err => {
              res.status(500).send({message:"User already exist"  });
            });


};

exports.login = (req, res, next) => {
    // const user = { email, password } = req.body;
    const { user } = req.body;
  
    

    if(!user.email) {
        return res.status(422).json({
          errors: {
            email: 'is required',
          },
        });
      }
    
      if(!user.password) {
        return res.status(422).json({
          errors: {
            password: 'is required',
          },
        });
      }
    
      return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
          return next(err);
        }
    
        if(passportUser) {
          const user = passportUser;
          user.token = passportUser.generateJWT();
          // const otp = otpgt.generateOTP();
          // redis.set("otp",otp);
          // redis.expire("otp",300);
          const accesToken = AUTH.generateNewToken({email: user.email}, "secretkey");
          // return res.json({ user: user.toAuthJSON() });
          res.status(200).json({
                    statusCode: 200, message: "Login successfully", data: {
        
                        accesToken
                    }
                });
                return
        }
    
        return res.status(400).send(info);
      })(req, res, next);


}