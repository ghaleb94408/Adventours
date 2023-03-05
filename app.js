const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))
const toursRouter = require('./routers/toursRoutes');
// express.json is a middleware that enable us to read json data from the request body
app.use(express.json());
app.use('/api/v1/tours', toursRouter);
module.exports = app;
