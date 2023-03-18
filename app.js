const express = require('express');
const morgan = require('morgan');
const AppError = require('./utility/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routers/usersRoutes');
const toursRouter = require('./routers/toursRoutes');

const app = express();
// Middlewares
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
// express.json is a middleware that enable us to read json data from the request body
app.use(express.json());
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
// Handle non-existing routes
app.all('*', (req, res, next) => {
  const err = new AppError(`The route ${req.originalUrl} does not exist.`, 404);
  next(err);
});

// Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
