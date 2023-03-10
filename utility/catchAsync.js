module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
  //the function will automatically call next with the parameter err (err=>next(err))
};
