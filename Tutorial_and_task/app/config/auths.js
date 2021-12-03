const Task = require("../models/task.model");
const User = require("../models/user.model");
const jwts=require('jsonwebtoken')

const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
    
  }
  return null;
};

const auths = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    credentialsRequired: true,
    getToken: getTokenFromHeaders,
    algorithms:['RS256']
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms:['RS256']
  }),
};

module.exports = auths;