/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51MpzyOGBjBj74gbshAy3sNmRXNH5fpI9PSynP3byxUDh0zwyCsQf0HSDZ0zkHkzh5SXjFI6P7xIIG9TdPxBTOa4s00Dxp1NtVT'
);
export const bookTour = async (tourId) => {
  try {
    // 1) Get session from Server
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout form + recieve payment
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
