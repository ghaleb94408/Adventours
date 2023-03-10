const express = require('express');
const morgan = require('morgan');
const AppError = require('./utility/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
const toursRouter = require('./routers/toursRoutes');
// express.json is a middleware that enable us to read json data from the request body
app.use(express.json());
app.use('/api/v1/tours', toursRouter);
// Handle non-existing routes
app.all('*', (req, res, next) => {
  const err = new AppError(`The route ${req.originalUrl} does not exist.`, 404);
  next(err);
});
// Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
