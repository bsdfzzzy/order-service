import axios from 'axios';

import { BookingRequestBody } from '../types/BookingEngine';
import { ErrorType } from '../types/CustomError';
import { CustomError } from '../utils/response/CustomError';

export const book = async (requestBody: BookingRequestBody): Promise<string> => {
  try {
    const {
      data: { evidenceId },
    } = await axios.post('https://api-gateway.com/booking-system/bookings', requestBody, {
      headers: { apiKey: 'apiKey' },
    });
    return evidenceId;
  } catch (e) {
    throw new CustomError(500, ErrorType.thirdServiceError, 'Booking order failed when calling booking system.', [
      e.toString(),
    ]);
  }
};
