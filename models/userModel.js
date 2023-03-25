const crypto = require('crypto');
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
  role: {
    type: String,
    enum: {
      values: ['admin', 'lead-guide', 'guide', 'user'],
      message: 'user role must be (admin, tour-leader, tour-guide, user)',
    },
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    select: false,
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: {
    type: String,
    default: 'default.jpg',
  },
});
userSchema.methods.authenticateUser = async function (
  signInPassword,
  originalUserPassword
) {
  const result = await bcrypt.compare(signInPassword, originalUserPassword);
  return result;
};
userSchema.methods.changedPasswordAfter = function (tokenIat) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenIat < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
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
