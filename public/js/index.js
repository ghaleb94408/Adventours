/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}
