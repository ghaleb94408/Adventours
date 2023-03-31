import axios from 'axios';
import { showAlert } from './alerts';
export const crossUser = async (id) => {
  try {
    const headers = {
      Authorization: 'Bearer paperboy',
    };
    const result = await axios.delete(
      `http://127.0.0.1:8000/api/v1/users/${id}`
    );
    showAlert('success', 'User deleted succcessfully');
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
