/* eslint-disable */
import axios, { formToJSON } from 'axios';
import { showAlert } from './alerts';
export const createTour = async (data, imagesData) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/tours',
      data: formToJSON(data),
    });
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
export const editTour = async (data, imagesData, id) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/tours/${id}`,
      data: formToJSON(data),
    });
    const imgUploadResult = await axios.patch(
      `http://127.0.0.1:8000/api/v1/tours/${id}`,
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
export const deleteTour = async (id) => {
  try {
    const result = await axios.delete(
      `http://127.0.0.1:8000/api/v1/tours/${id}`
    );
    if (result.status === 204) {
      showAlert('success', 'Tour Deleted Successfully!');
      window.setTimeout(() => {
        location.assign(`/manage-tours`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
