/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createBooking = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/bookings/create-booking',
      data: data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Tour Created Successfully!');
      window.setTimeout(() => {
        location.assign(`/manage-bookings`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const crossBooking = async (id) => {
  try {
    const result = await axios.delete(
      `http://127.0.0.1:8000/api/v1/bookings/${id}`
    );
    showAlert('success', 'Booking deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const updateBooking = async (id, data) => {
  try {
    const result = await axios.patch(
      `http://127.0.0.1:8000/api/v1/bookings/edit-booking/${id}`,
      data
    );
    showAlert('success', 'Booking deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
