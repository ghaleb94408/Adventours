// This is a script to upload psudo data and delete it from the DB.
// Configure access to evironment variables file for DB Access.
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
// set up mongoose.
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// import the tour model
const Tour = require('../../models/tourModel');
// import fs and read the psuedo data file.
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
// Connect to DB.
mongoose.connect(
  `${process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD)}`,
  async () => {
    console.log('Connected to DB');
    // Delete all documents.
    if (process.argv[2] === '--d') {
      console.log('Deleting Tours');
      await Tour.deleteMany();
      console.log('Tours Deleted');
    }
    // Import Psuedo data.
    if (process.argv[2] === '--i') {
      console.log('Importing Tours');
      Tour.insertMany(data);
    }
  }
);
