// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const sendEmail = require('../utility/email');

const signJWT = async (id) => {
  const token = await promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
const createAndSendToken = async (user, statusCode, res) => {
  // 1) Sign the token
  const token = await signJWT(user._id);
  // 2)don't send the user password
  user.password = undefined;
  // 3) Send the token in an http only cookie
  res.cookie('jwt', token, {
    expires: new Date(
      // current date + expiry date transformed into  hours
      (Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000) * 1
    ),
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
  });
  // 4) Send response
  res.status(statusCode).json({
    status: 'Success',
    data: user,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = req.body;
  const user = await User.create({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    passwordConfirm: newUser.passwordConfirm,
  });
  await createAndSendToken(user, 201, res);
});
exports.signIn = catchAsync(async (req, res, next) => {
  // 1) Get the email and password
  const { email: signInEmail, password: signInPassword } = req.body;
  if (!signInEmail || !signInPassword)
    return next(
      new AppError('Please provide an email address and a password', 400)
    );
  // 2) Check if a user exists with the same email address and that the password is correct
  const user = await User.findOne({ email: signInEmail }).select('+password');
  if (!user)
    return next(
      new AppError('Wrong password or email address, please try again'),
      401
    );
  const correct = await user.authenticateUser(signInPassword, user.password);
  if (!correct)
    return next(
      new AppError('Wrong password or email address, please try again'),
      401
    );

  // 4) Sign a JWT Token and send back the response
  await createAndSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('You are not logged in! please log in to get access'),
      401
    );
  // 2) Verify token (check if the token hasn't expired and has not been modified)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const tokenUser = await User.findById(decoded.id);
  if (!tokenUser) return next(new AppError('This user does not exist', 401));
  // 4) Check if user has changed his password after the token was issued
  if (tokenUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed the password, please log in again'),
      401
    );
  // Grant access to the route
  req.user = tokenUser;
  next();
});
exports.restrictTo = (allowedArr) => (req, res, next) => {
  if (!allowedArr.includes(req.user.role))
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  next();
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user email and check if user exists
  const { email } = req.body;
  const user = await User.findOne({ email });
  // if no user with this email exists, stop the function and send a response
  if (!user)
    return res.status(200).json({
      status: 'Success',
      message:
        'A reset token has been sent to this email if it exists in our Database',
    });
  // 2) Generate reset token and URL
  const token = user.createPasswordResetToken();
  await user.save({ validateModifiedOnly: true });
  const text = `you have requested a password reset please follow this URL ${
    req.protocol
  }://${req.get(
    'host'
  )}/api/v1/users/reset-password/${token}\nif you didn't request this password reset please just ignore this email`;
  // 3) send reset URL to user's email
  try {
    await sendEmail({
      email,
      text,
      subject: 'Password reset (ONLY VALID FOR 10 MINUTES)',
    });
    // 4) respond to user
    res.status(200).json({
      status: 'Success',
      message:
        'A reset token has been sent to this email if it exists in our Database',
    });
  } catch (err) {
    // if an error happens while sending the email reset the following fields and respond to user
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateModifiedOnly: true });
    return next(
      new AppError(
        'There was an error sending the reset Email, please try again later.',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //Odd4CNpajEfl12nQrRQzUeX4djb9AhBXAqxuk76kYnCzwdCCkvqee
  if (!user) return next(new AppError('This reset token is invalid', 403));
  // 2) update the password and the passwordChangedAt fields
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // 3) remove the passwordResetToken and passwordResetExires fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateModifiedOnly: true });
  // 4) sign a new Token and send it back
  await createAndSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user
  const user = await User.findById(req.user._id).select('+password');
  // 2) check if old password is correct
  if (!(await user.authenticateUser(req.body.currentPassword, user.password)))
    return next(
      new AppError(
        'The password you have provided is wrong, please try again',
        401
      )
    );
  // 3) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateModifiedOnly: true });
  // 4) sign token and send respond
  await createAndSendToken(user, 200, res);
});
