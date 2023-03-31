const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const env = require('dotenv');

env.config({ path: './config.env' });

const AppError = require('./utility/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routers/usersRoutes');
const toursRouter = require('./routers/toursRoutes');
const reviewRouter = require('./routers/reviewsRoutes');
const bookingRouter = require('./routers/bookingsRoutes');
const viewRouter = require('./routers/viewsRoutes');

const app = express();

// Setting view engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Middlewares
// Set security http headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       frameGuard: false,
//       'Cross-Origin-Opener-Policy': false,
//       directives: {
//         'default-src': ['*'],
//         'script-src': [
//           "'self'",
//           'https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js',
//           'https://js.stripe.com/v3/',
//         ],
//       },
//     },
//   })
// );
// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip. Please try again later',
});
// Logging for development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api', limiter);
// express.json is a middleware that enable us to read json data from the request body
app.use(cors());
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);
app.use(cookieParser());
// Data sanitization against noSQL query injection attacks
app.use(mongoSanitize());
// Data sanitization against noSQL XSS attacks
app.use(xss());
// prevent Parameter pollution
app.use(
  hpp({
    // Fields that are allowed to be duplicated in the URL
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);
// API Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
// Handle non-existing routes
app.all('*', (req, res, next) => {
  const err = new AppError(`The route ${req.originalUrl} does not exist.`, 404);
  next(err);
});

// Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
