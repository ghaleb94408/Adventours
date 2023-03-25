import axios from 'axios';
import { showAlert } from './alerts';
export const updateData = async (data) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/v1/users/update-me',
      data,
    });
    if (result.data.status === 'Success') {
      showAlert('success', 'Data updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response.data.message.replace('Validation failed: ', '').toUpperCase()
    );
  }
};
