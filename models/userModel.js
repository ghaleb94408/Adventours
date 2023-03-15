const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  photo: String,
});
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
