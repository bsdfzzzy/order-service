import axios from 'axios';

import {
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING,
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_BOOKING_INFO,
  SERVER_ERROR,
} from '../consts';
import { BookingInfoResponse, BookingRequestBody } from '../types/BookingEngine';
import { ErrorType } from '../types/CustomError';
import { CustomError } from '../utils/response/CustomError';

export const booking = async (requestBody: BookingRequestBody): Promise<string> => {
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

export const getBookingInfo = async (bookingEvidenceId): Promise<BookingInfoResponse> => {
  try {
    const {
      data: { finished, result },
    } = await axios.get(`https://api-gateway.com/booking-system/bookings/${bookingEvidenceId}`, {
      headers: { apiKey: 'apiKey' },
    });
    return {
      finished,
      result,
    };
  } catch (e) {
    throw new CustomError(
      SERVER_ERROR,
      ErrorType.thirdServiceError,
      BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_BOOKING_INFO,
      [e.toString()],
    );
  }
};
