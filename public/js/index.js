/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateData } from './updateData';
// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
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
if (logoutBtn) logoutBtn.addEventListener('click', logout);
