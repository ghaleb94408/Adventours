/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './authenticate';
import { createTour, deleteTour, editTour } from './manageTours';
import { createBooking, crossBooking, updateBooking } from './manageBookings';
import { updateData } from './updateData';
import { bookTour } from './stripe';
import { crossUser } from './usersManagement';
import { formToJSON } from 'axios';
import { crossReview, updateReview, createReview } from './manageReviews';
// DOM ELEMENTS
// These ones are for admins edits
// Users Management
const userEditForm = document.querySelector('.form-user-edit');
const userPasswordEditForm = document.querySelector('.form-user-edit-password');
// Tours Management
const createTourForm = document.querySelector('.form--create-tour');
const editTourForm = document.querySelector('.form--edit-tour');
const deleteTourBtn = document.querySelector('.btn--delete-tour');
const confirmTourDelete = document.querySelector('.btn--tour-confirm-delete');
// Bookings Management
const createBookingForm = document.querySelector('.form--create-booking');
const editBookingForm = document.querySelector('.form--edit-booking');
const deleteBookingBtn = document.querySelector('.btn--delete-booking');
const deleteBooking = document.querySelectorAll('.user__options__li--db');
const editBooking = document.querySelector('.btn--save-booking-data');
// Reviews Management
const deleteReview = document.querySelectorAll('.delete-container');
const deleteReviewBtn = document.querySelector('.btn--delete-review');
const editReviewForm = document.querySelector('.form--edit-review');
const createReviewForm = document.querySelector('.form--create-review');
// userEdits
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const signupForm = document.querySelector('.form--signup');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
const confirmDelete = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const deleteUser = document.querySelectorAll('.user__options__li--du');
const cancelBtn = document.querySelector('.btn--cancel');
const deleteBtn = document.querySelector('.btn--delete');
const toggler = document.querySelector('.toggler');
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
// Tour Creation
if (createTourForm)
  createTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    const form = new FormData();
    const imagesForm = new FormData();
    data.name = document.getElementById('name').value;
    data.price = document.getElementById('price').value;
    data.priceId = document.getElementById('price_id').value;
    data.duration = document.getElementById('duration').value;
    data.maxGroupSize = document.getElementById('max_group_size').value;
    data.difficulty = document.getElementById('difficulty').value;
    data.summary = document.getElementById('summary').value;
    data.description = document.getElementById('description').value;
    data.startDates = [
      document.getElementById('date_1').value,
      document.getElementById('date_2').value,
      document.getElementById('date_3').value,
    ];
    data.startLocation = {};
    data.startLocation.type = 'Point';
    data.startLocation.coordinates = document
      .getElementById('start-location-coordinates')
      .value.split(',');
    data.startLocation.description = document.getElementById(
      'start-location-description'
    ).value;
    data.startLocation.address = document.getElementById(
      'start-location-address'
    ).value;
    data.locations = [
      {
        type: 'point',
        description: document.getElementById('location_1_description').value,
        day: document.getElementById('location_1_day').value,
        coordinates: document.getElementById('location_1').value.split(','),
        type: 'Point',
      },
      {
        type: 'point',
        description: document.getElementById('location_2_description').value,
        day: document.getElementById('location_2_day').value,
        coordinates: document.getElementById('location_2').value.split(','),
        type: 'Point',
      },
      {
        type: 'point',
        description: document.getElementById('location_3_description').value,
        day: document.getElementById('location_3_day').value,
        coordinates: document.getElementById('location_3').value.split(','),
        type: 'Point',
      },
    ];
    data.imageCover = document.getElementById('cover_image').files[0];
    data.images = [
      document.getElementById('image_1').files[0],
      document.getElementById('image_2').files[0],
      document.getElementById('image_3').files[0],
    ];
    form.append('name', data.name);
    form.append('price', data.price);
    form.append('priceId', data.priceId);
    form.append('duration', data.duration);
    form.append('maxGroupSize', data.maxGroupSize);
    form.append('difficulty', data.difficulty);
    form.append('summary', data.summary);
    form.append('description', data.description);
    form.append('startDates', JSON.stringify(data.startDates));
    form.append('startLocation', JSON.stringify(data.startLocation));
    form.append('locations', JSON.stringify(data.locations));
    // form.append('imageCover', data.imageCover);
    imagesForm.append('imageCover', data.imageCover);
    imagesForm.append('image_1', data.images[0]);
    imagesForm.append('image_2', data.images[1]);
    imagesForm.append('image_3', data.images[2]);
    await createTour(form, imagesForm);
  });

// Tour Edit
// A) Tour delete
if (deleteTourBtn)
  deleteTourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    confirmDelete.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });
if (confirmTourDelete) {
  confirmTourDelete.addEventListener('click', async (e) => {
    e.preventDefault();
    await deleteTour(e.target.dataset.id);
  });
}
// B) Tour Edit
if (editTourForm)
  editTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    const form = new FormData();
    const imagesForm = new FormData();
    data.name = document.getElementById('name').value;
    data.price = document.getElementById('price').value;
    data.priceId = document.getElementById('price_id').value;
    data.duration = document.getElementById('duration').value;
    data.maxGroupSize = document.getElementById('max_group_size').value;
    data.difficulty = document.getElementById('difficulty').value;
    data.summary = document.getElementById('summary').value;
    data.description = document.getElementById('description').value;
    data.startDates = [
      document.getElementById('date_1').value,
      document.getElementById('date_2').value,
      document.getElementById('date_3').value,
    ];
    data.startLocation = {};
    data.startLocation.type = 'Point';
    data.startLocation.coordinates = document
      .getElementById('start-location-coordinates')
      .value.split(',');
    data.startLocation.description = document.getElementById(
      'start-location-description'
    ).value;
    data.startLocation.address = document.getElementById(
      'start-location-address'
    ).value;
    data.locations = [
      {
        type: 'point',
        description: document.getElementById('location_1_description').value,
        day: document.getElementById('location_1_day').value,
        coordinates: document.getElementById('location_1').value.split(','),
        type: 'Point',
      },
      {
        type: 'point',
        description: document.getElementById('location_2_description').value,
        day: document.getElementById('location_2_day').value,
        coordinates: document.getElementById('location_2').value.split(','),
        type: 'Point',
      },
      {
        type: 'point',
        description: document.getElementById('location_3_description').value,
        day: document.getElementById('location_3_day').value,
        coordinates: document.getElementById('location_3').value.split(','),
        type: 'Point',
      },
    ];
    data.imageCover = document.getElementById('cover_image').files[0];
    data.images = [
      document.getElementById('image_1').files[0],
      document.getElementById('image_2').files[0],
      document.getElementById('image_3').files[0],
    ];
    form.append('name', data.name);
    form.append('price', data.price);
    form.append('priceId', data.priceId);
    form.append('duration', data.duration);
    form.append('maxGroupSize', data.maxGroupSize);
    form.append('difficulty', data.difficulty);
    form.append('summary', data.summary);
    form.append('description', data.description);
    form.append('startDates', JSON.stringify(data.startDates));
    form.append('startLocation', JSON.stringify(data.startLocation));
    form.append('locations', JSON.stringify(data.locations));
    if (data.imageCover) imagesForm.append('imageCover', data.imageCover);
    if (data.images) {
      imagesForm.append('image_1', data.images[0]);
      imagesForm.append('image_2', data.images[1]);
      imagesForm.append('image_3', data.images[2]);
    }
    await editTour(form, imagesForm, editTourForm.dataset.id);
  });
// for user management page
if (toggler) {
  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.classList.contains('toggler')) toggler.checked = false;
  });
}
if (userEditForm)
  userEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    const id = userEditForm.dataset.id;
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateData(form, 'adminData', id);
  });
if (userPasswordEditForm)
  userPasswordEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = userPasswordEditForm.dataset.id;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData({ password, passwordConfirm }, 'adminPassword', id);
  });
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
    const { tourid } = e.target.dataset;
    bookTour(tourid);
  });
if (logoutBtn) logoutBtn.addEventListener('click', logout);
/* eslint-disable */
if (deleteUser)
  deleteUser.forEach((de) => {
    de.addEventListener('click', (e) => {
      deleteBtn.dataset.id = de.dataset.id;
      confirmDelete.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });
if (overlay)
  overlay.addEventListener('click', () => {
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
if (cancelBtn)
  cancelBtn.addEventListener('click', () => {
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
if (deleteBtn)
  deleteBtn.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    await crossUser(id);
    document.getElementById(id).remove();
    deleteBtn.classList.remove(id);
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
// Bookings Management
// A) Create booking
if (createBookingForm)
  createBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      tour: document.getElementById('tour').value,
      user: document.getElementById('user').value,
      price: document.getElementById('price').value,
      paid: document.getElementById('paid').value,
    };
    console.log(data);
    createBooking(data);
  });
if (deleteBooking)
  deleteBooking.forEach((de) => {
    de.addEventListener('click', (e) => {
      deleteBookingBtn.dataset.id = de.dataset.id;
      confirmDelete.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });
// B) Delete booking
if (deleteBookingBtn)
  deleteBookingBtn.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    await crossBooking(id);
    document.getElementById(id).remove();
    deleteBookingBtn.classList.remove(id);
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
// C) Edit Booking
if (editBookingForm)
  editBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editBookingForm.dataset.id;
    const data = {
      tour: document.getElementById('tour').value,
      user: document.getElementById('user').value,
      price: document.getElementById('price').value,
      paid: document.getElementById('paid').value === 'false' ? '' : 'true',
    };
    await updateBooking(id, data);
  });
// Reviews management
// A) Delete Review
if (deleteReview)
  deleteReview.forEach((de) => {
    de.addEventListener('click', (e) => {
      console.log('hello');
      deleteReviewBtn.dataset.id = de.dataset.id;
      confirmDelete.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });
if (deleteReviewBtn)
  deleteReviewBtn.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    await crossReview(id);
    document.getElementById(id).remove();
    deleteReviewBtn.classList.remove(id);
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
// Edit Reveiw
if (editReviewForm)
  editReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editReviewForm.dataset.id;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    await updateReview(id, { review, rating });
  });
// Create review
if (createReviewForm)
  createReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tour = createReviewForm.dataset.tour_id;
    const user = createReviewForm.dataset.user_id;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    await createReview({ tour, user, review, rating });
  });
// View for select menu
let x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName('custom-select');
if (x) {
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement('DIV');
    a.setAttribute('class', 'select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement('DIV');
    b.setAttribute('class', 'select-items select-hide');
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
    create a new DIV that will act as an option item: */
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function (e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName('select')[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName('same-as-selected');
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function (e) {
      /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
  except the current select box: */
    let x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }

  /* If the user clicks anywhere outside the select box,
then close all select boxes: */
  document.addEventListener('click', closeAllSelect);
}
