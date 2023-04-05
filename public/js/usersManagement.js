import axios from 'axios';
import { showAlert } from './alerts';
export const crossUser = async (id) => {
  try {
    const result = await axios.delete(
      `/api/v1/users/${id}`
    );
    showAlert('success', 'User deleted succcessfully');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
