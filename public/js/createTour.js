/* eslint-disable */
import axios, { formToJSON } from 'axios';
import { showAlert } from './alerts';
export const createTour = async (data, imagesData) => {
  try {
    console.log('calling tour');
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/tours',
      data: formToJSON(data),
    });
    console.log(result.data.data.id);
    const imgUploadResult = await axios.patch(
      `http://127.0.0.1:8000/api/v1/tours/${result.data.data.id}`,
      imagesData
    );
    if (result.data.status === 'Success') {
      showAlert('success', 'Tour Created Successfully!');
      window.setTimeout(() => {
        location.assign(`/tours/${result.data.data.slug}`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
