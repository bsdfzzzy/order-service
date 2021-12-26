import axios from 'axios';

import { BookingRequestBody } from '../types/BookingEngine';

export const book = async (requestBody: BookingRequestBody): Promise<string> => {
  const {
    data: { evidenceId },
  } = await axios.post('https://api-gateway.com/booking-system/bookings', requestBody, {
    headers: { apiKey: 'apiKey' },
  });
  return evidenceId;
};
