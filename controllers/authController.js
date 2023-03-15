const User = require('../models/userModel');
const catchAsync = require('../utility/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const user = await User.create(data);
  res.status(200).json({
    status: 'Success',
    user,
  });
});
