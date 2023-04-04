/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const signup = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const result = await axios({
      method: 'Get',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => {
        location.assign('/overview'); //we set the reload flag to true so we have a fresh page from the server and not the cache
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Error logging out, please try again!');
  }
};
