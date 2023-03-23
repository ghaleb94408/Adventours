/* eslint-disable no-console */
// This is a script to upload psudo data and delete it from the DB.
// Configure access to evironment variables file for DB Access.
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../../config.env` });

const fs = require('fs');
// set up mongoose.
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// import the tour model
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
// import fs and read the psuedo data file.
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const ReviewsData = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
// Connect to DB.
mongoose.connect(
  `${process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD)}`,
  async () => {
    console.log('Connected to DB');
    // Delete tours documents.
    if (process.argv[2] === '--dt') {
      console.log('Deleting Tours');
      await Tour.deleteMany();
      console.log('Tours Deleted');
    }
    // Import tours Psuedo data.
    if (process.argv[2] === '--it') {
      console.log('Importing Tours');
      Tour.create(toursData);
      console.log('Tours imported');
    }
    // Delete users documents.
    if (process.argv[2] === '--du') {
      console.log('Deleting Users');
      await User.deleteMany();
      console.log('Users Deleted');
    }
    // Import users Psuedo data.
    if (process.argv[2] === '--iu') {
      console.log('Importing Users');
      User.insertMany(usersData, {
        lean: true,
      });
      console.log('Users documents Imported');
    }
    // Delete reviews documents.
    if (process.argv[2] === '--dr') {
      console.log('Deleting Reviews');
      await Review.deleteMany();
      console.log('Reviews Deleted');
    }
    // Import reviews Psuedo data.
    if (process.argv[2] === '--ir') {
      console.log('Importing Reviews');
      Review.insertMany(ReviewsData);
      console.log('Reviews Imported');
    }
  }
);
