import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type) => {
  try {
    let url;
    if (type === 'Password')
      url = 'http://127.0.0.1:8000/api/v1/users/update-password';
    else if (type === 'Data')
      url = 'http://127.0.0.1:8000/api/v1/users/update-me';
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
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
