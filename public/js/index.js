/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
// DOM ELEMENTS
const form = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}
if (logoutBtn) logoutBtn.addEventListener('click', logout);
