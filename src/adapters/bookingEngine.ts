import axios from 'axios';

import {
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING,
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_CANCELLING,
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_BOOKING_INFO,
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_CANCELLATION_INFO,
  SERVER_ERROR,
} from '../consts';
import {
  BookingInfoResponse,
  BookingRequestBody,
  CancellationInfoResponse,
  CancelRequestBody,
} from '../types/BookingEngine';
import { ErrorType } from '../types/CustomError';
import { CustomError } from '../utils/response/CustomError';

export const booking = async (requestBody: BookingRequestBody): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:4000/v1/booking-system/bookings', requestBody, {
      headers: { apiKey: 'apiKey' },
    });
    return response.data.evidenceId;
  } catch (e) {
    throw new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, [
      e.toString(),
    ]);
  }
};

export const getBookingInfo = async (bookingEvidenceId): Promise<BookingInfoResponse> => {
  try {
    const {
      data: { id, finished, result },
      // This url should be https://api-gateway.com in real. Here is a mock.
    } = await axios.get(`http://localhost:4000/v1/booking-system/bookings/${bookingEvidenceId}`, {
      headers: { apiKey: 'apiKey' },
    });
    return {
      id,
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

export const cancel = async (requestBody: CancelRequestBody): Promise<string> => {
  try {
    const {
      data: { evidenceId },
      // This url should be https://api-gateway.com in real. Here is a mock.
    } = await axios.post('http://localhost:4000/v1/booking-system/cancellations', requestBody, {
      headers: { apiKey: 'apiKey' },
    });
    return evidenceId;
  } catch (e) {
    throw new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, BOOKING_SYSTEM_SERVER_ERROR_WHEN_CANCELLING, [
      e.toString(),
    ]);
  }
};

export const getCancellationInfo = async (cancellationEvidenceId: string): Promise<CancellationInfoResponse> => {
  try {
    const {
      data: { id, finished, result },
      // This url should be https://api-gateway.com in real. Here is a mock.
    } = await axios.get(`http://localhost:4000/v1/booking-system/cancellations/${cancellationEvidenceId}`, {
      headers: { apiKey: 'apiKey' },
    });
    return {
      id,
      finished,
      result,
    };
  } catch (e) {
    throw new CustomError(
      SERVER_ERROR,
      ErrorType.thirdServiceError,
      BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_CANCELLATION_INFO,
      [e.toString()],
    );
  }
};
