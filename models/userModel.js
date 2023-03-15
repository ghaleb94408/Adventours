const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
// const AppError = require('../utility/appError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a username'],
    maxLength: [50, 'name must be less than 50 charcters'],
  },
  email: {
    type: String,
    required: [true, 'please provide a valid email address'],
    unique: [true, 'a user with this email already exists'],
    lowerCase: true,
    validate: [validator.isEmail, 'please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // 1) compare password and passwordConfirm, if they are not matching return an error (only works on save and create functions)
      validator: function (el) {
        return el === this.password;
      },
      message: 'The password and the Password confirmation do not match',
    },
  },
  photo: String,
});
userSchema.pre('save', async function (next) {
  // 1) If the password is not modified don't execute this function
  if (!this.isModified('password')) return next();
  // 2) Generate the Password hash with 12 rounds of salting and store it in the DB
  this.password = await bcrypt.hash(this.password, 12);
  // 3) Remove password Confirm from DB
  this.passwordConfirm = undefined;
  next();
});
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
