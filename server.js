const app = require('./app');
const env = require('dotenv');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
env.config({ path: './config.env' });

const URL = process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD);
const port = process.env.PORT;
// Start the server on port 8000
mongoose.connect(URL, (err) => {
  if(err) console.log(err)
  else console.log('Connected to DB.')
});
app.listen(port, () => {
  console.log(`App is listening at port 8000 ...`);
});
