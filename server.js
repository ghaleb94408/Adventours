/* eslint-disable no-console */
const env = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.error('Unhandled rejection! Shutting down...');
});
mongoose.set('strictQuery', false);
env.config({ path: './config.env' });

const URL = process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD);
const port = process.env.PORT;
// Start the server on port 8000
mongoose.connect(URL, (err) => {
  if (err) console.log(err);
  else console.log('Connected to DB.');
});
const server = app.listen(port, () => {
  console.log(`App is listening at port 8000 ...`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.error('Unhandled rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
