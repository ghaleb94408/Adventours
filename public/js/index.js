/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './authenticate';
import { createTour } from './createTour';
import { updateData } from './updateData';
import { bookTour } from './stripe';
import { crossUser } from './usersManagement';
// DOM ELEMENTS
// These ones are for admins edits
const userEditForm = document.querySelector('.form-user-edit');
const userPasswordEditForm = document.querySelector('.form-user-edit-password');
// userEdits
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const signupForm = document.querySelector('.form--signup');
const createTourForm = document.querySelector('.form--create-tour');
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
if (userEditForm)
  userEditForm.addEventListener('submit', async (e) => {
    // document.querySelector('.btn--save-data').textContent = 'Updating ...';
    // const form = new FormData();
    // form.append('name', document.getElementById('name').value);
    // form.append('email', document.getElementById('email').value);
    // form.append('photo', document.getElementById('photo').files[0]);
    // await updateData(form, 'Data');
    // document.querySelector('.btn--save-data').textContent = 'Save Settings';
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
    console.log(password, passwordConfirm);
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
    console.log(e.target.dataset.tourid);
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
    document.getElementById(id).remove();
    console.log('deleting user...');
    await crossUser(id);
    console.log('user deleted 👍');
    deleteBtn.classList.remove(id);
    confirmDelete.classList.add('hidden');
    overlay.classList.add('hidden');
  });
if (toggler) {
  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.classList.contains('toggler')) toggler.checked = false;
  });
}

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
