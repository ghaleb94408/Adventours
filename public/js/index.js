/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './authenticate';
import { createTour } from './createTour';
import { updateData } from './updateData';
import { bookTour } from './stripe';
// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const signupForm = document.querySelector('.form--signup');
const createTourForm = document.querySelector('.form--create-tour');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup({ name, email, password, passwordConfirm });
  });
}
if (userForm)
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-data').textContent = 'Updating ...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateData(form, 'Data');
    document.querySelector('.btn--save-data').textContent = 'Save Settings';
  });
if (createTourForm)
  createTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    data.form = new FormData();
    data.name = document.getElementById('name').value;
    data.price = document.getElementById('price').value;
    data.duration = document.getElementById('duration').value;
    data.maxGroupSize = document.getElementById('max-group-size').value;
    data.difficulty = document.getElementById('difficulty').value;
    data.summary = document.getElementById('summary').value;
    data.description = document.getElementById('description').value;
    data.startDates = [document.getElementById('date').value];
    data.locationDescription = document.getElementById(
      'start-location-description'
    ).value;
    data.adress = document.getElementById('start-location-address').value;
    data.coordinates = document.getElementById(
      'start-location-coordinates'
    ).value;
    data.startLocation = {
      description: document.getElementById('start-location-description').value,
      type: 'Point',
      coordinates: document
        .getElementById('start-location-coordinates')
        .value.split(','),
      address: document.getElementById('start-location-address').value,
    };
    data.imageCover = document.getElementById('photo').files[0];
    createTour(data);
  });
// if (createTourForm)
//   createTourForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('name', document.getElementById('name').value);
//     form.append('price', document.getElementById('price').value);
//     form.append('duration', document.getElementById('duration').value);
//     form.append(
//       'maxGroupSize',
//       document.getElementById('max-group-size').value
//     );
//     form.append('difficulty', document.getElementById('difficulty').value);
//     form.append('summary', document.getElementById('summary').value);
//     form.append('description', document.getElementById('description').value);
//     form.append('startDate', document.getElementById('date').value);
//     form.append(
//       'locationDescription',
//       document.getElementById('start-location-description').value
//     );
//     form.append(
//       'adress',
//       document.getElementById('start-location-address').value
//     );
//     form.append(
//       'coordinates',
//       document.getElementById('start-location-coordinates').value
//     );
//     form.append('imageCover', document.getElementById('photo').files[0]);
//     console.log(form.get('price'));
//     console.log(form.get('summary'));
//     createTour(form);
//   });
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating ...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData(
      { currentPassword, password, passwordConfirm },
      'Password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
  });
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    console.log(e.target.dataset.tourid);
    const { tourid } = e.target.dataset;
    bookTour(tourid);
  });
if (logoutBtn) logoutBtn.addEventListener('click', logout);
