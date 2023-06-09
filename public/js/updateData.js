import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type, id) => {
  try {
    let url;
    if (type === 'Password')
      url = '/api/v1/users/update-password';
    else if (type === 'Data')
      url = '/api/v1/users/update-me';
    else if (type === 'adminData')
      url = `/api/v1/users/${id}`;
    else if (type === 'adminPassword')
      url = `/api/v1/users/passwordUpdate/${id}`;
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Data updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    let errString = err.response.data.message.replace(
      'Validation failed: ',
      ''
    );
    if (errString.startsWith('User validation failed:'))
      errString = errString.split(':')[2];
    showAlert('error', errString.toUpperCase());
  }
};
