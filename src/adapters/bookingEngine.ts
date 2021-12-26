import axios from 'axios';

import { BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, SERVER_ERROR } from '../consts';
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
    throw new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, [
      e.toString(),
    ]);
  }
};
