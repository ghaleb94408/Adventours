/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createBooking = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/bookings/create-booking',
      data: data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Booking Created Successfully!');
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
      `/api/v1/bookings/${id}`
    );
    if (result) showAlert('success', 'Booking deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const updateBooking = async (id, data) => {
  try {
    const result = await axios.patch(
      `/api/v1/bookings/edit-booking/${id}`,
      data
    );
    if (result.data.status === 'Success') {
      showAlert('success', 'Booking updated Successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
