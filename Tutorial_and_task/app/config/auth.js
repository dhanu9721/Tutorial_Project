const Task = require("../models/task.model");
const User = require("../models/user.model");
const jwts=require('jsonwebtoken')

const mongoose = require('mongoose');
const Users = mongoose.model('Users');
// const jwt = require('express-jwt');

// const tokens = 

exports.verifyToken=function(req, res, next){
    // get auth header value
    email = req.body.email
    // console.log("verify token")
    const bearerHeader = req.headers['authorization'];
    
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined')
    {
        // split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;

        jwts.verify(req.token, 'secretkey', (err,decode) => {
            // if(err){
            //   console.log(err)
            //     res.json({
            //         message: 'Token invalid'
            //     });
            // }
            // else{
            //     next();
            // }

            if(decode.email === email){
              next();
            }
            else{
              res.json({
                        message: 'Token invalid'
                    });
            }


        });
        //middleware
       
    }
    else{
        //forbidden
        res.sendStatus(403);
        // res.json({message: "invalid"});
    }
}
exports.generateNewToken = function(paylod,secretKey)
{
  const token=  jwts.sign(paylod, secretKey)
  return token
    
}





// const getTokenFromHeaders = (req) => {
//   const { headers: { authorization } } = req;

//   if(authorization && authorization.split(' ')[0] === 'Token') {
//     return authorization.split(' ')[1];
    
//   }
//   return null;
// };

// const auth = {
//   required: jwt({
//     secret: 'secret',
//     userProperty: 'payload',
//     credentialsRequired: true,
//     getToken: getTokenFromHeaders,
//     algorithms:['RS256']
//   }),
//   optional: jwt({
//     secret: 'secret',
//     userProperty: 'payload',
//     getToken: getTokenFromHeaders,
//     credentialsRequired: false,
//     algorithms:['RS256']
//   }),
// };

// module.exports = auth;