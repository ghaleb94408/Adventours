/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const createReview = async (data) => {
//   try {
//     const result = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:8000/api/v1/bookings/create-booking',
//       data: data,
//     });
//     if (result.data.status === 'Success') {
//       showAlert('success', 'Booking Created Successfully!');
//       window.setTimeout(() => {
//         location.assign(`/manage-bookings`);
//       }, 1000);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
export const crossReview = async (id) => {
  try {
    const result = await axios.delete(
      `http://127.0.0.1:8000/api/v1/reviews/${id}`
    );
    if (result) showAlert('success', 'Review deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const updateReview = async (id, data) => {
  try {
    const result = await axios.patch(
      `http://127.0.0.1:8000/api/v1/reviews/${id}`,
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
