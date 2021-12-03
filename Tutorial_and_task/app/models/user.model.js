// const mongoose = require('mongoose');
//     const userschema = mongoose.Schema({
        
//         password: { type: String, required: true},
//         username:String,
//         role:String,
//         email:{type:String,required:true,unique:true},
//         // isAdmin: Boolean
//     });

//     module.exports = mongoose.model('users', userschema);




const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    // password: String,

  password: { type: String, required: true},
  // phone: {type: String,required: true,trim: true,unique: true},
  // email: String,
  email: {type:String,required:true,unique:true},
  role: String,
  hash: String,
  salt: String,
  // phone: String,
  task: [String]
});

// UsersSchema.methods.setotp = function(otp){

//   this.phoneOtp = otp.toString();
// };

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate()+1);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('Users', UsersSchema);
// module.exports = mongoose.model('users', UsersSchema);