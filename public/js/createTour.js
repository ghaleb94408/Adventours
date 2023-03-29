/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const createTour = async (data) => {
  // const startLocation = {
  //   description: data.get('description'),
  //   type: 'Point',
  //   coordinates: data.get('coordinates'),
  //   address: data.get('coordinates'),
  // };
  // data.set('startLocation', startLocation);
  // console.log(data)
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/tours',
      data,
    });
    console.log(result.data.data.slug);
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
