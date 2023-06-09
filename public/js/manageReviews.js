/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (data) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Review Created Successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const crossReview = async (id) => {
  try {
    const result = await axios.delete(
      `/api/v1/reviews/${id}`
    );
    if (result) showAlert('success', 'Review deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const updateReview = async (id, data) => {
  try {
    const result = await axios.patch(
      `/api/v1/reviews/${id}`,
      data
    );
    if (result.data.status === 'Success') {
      showAlert('success', 'Review updated Successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
