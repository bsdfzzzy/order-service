import axios from 'axios';

import {
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING,
  BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_BOOKING_INFO,
  SERVER_ERROR,
} from '../consts';
import { BookingRequestBody, OrderBookingStatus } from '../types/BookingEngine';
import { ErrorType } from '../types/CustomError';
import { CustomError } from '../utils/response/CustomError';

import { booking, getBookingInfo } from './bookingEngine';

jest.mock('axios');

describe('bookingEngine', () => {
  describe('booking', () => {
    const requestBody: BookingRequestBody = {
      orderId: 1,
      productId: 'product_id',
      personName: 'name',
      identificationNumber: '1111111111111111111111',
      mobilePhone: '13800000000',
    };

    it('should post the request to 3rd service api gateway', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          evidenceId: 'booking_evidence_id',
        },
      });

      const evidenceId = await booking(requestBody);

      expect(axios.post).toHaveBeenCalledWith('https://api-gateway.com/booking-system/bookings', requestBody, {
        headers: { apiKey: 'apiKey' },
      });
      expect(evidenceId).toEqual('booking_evidence_id');
    });

    it('should throw custom error when booking system return error', async () => {
      const errorResponse = {
        errors: {
          errorCode: '0',
          errorMessage: 'Server Error',
        },
      };
      (axios.post as jest.Mock).mockRejectedValue(errorResponse);

      await expect(booking(requestBody)).rejects.toThrow(
        new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, [
          errorResponse.toString(),
        ]),
      );
    });
  });

  describe('get booking information', () => {
    const bookingEvidenceId = 'booking_evidence_id';

    it('should send a get request to 3rd service api gateway', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          finished: true,
          result: OrderBookingStatus.SUCCEED,
        },
      });

      const response = await getBookingInfo(bookingEvidenceId);

      expect(axios.get).toHaveBeenCalledWith('https://api-gateway.com/booking-system/bookings/booking_evidence_id', {
        headers: { apiKey: 'apiKey' },
      });
      expect(response).toEqual({ finished: true, result: OrderBookingStatus.SUCCEED });
    });

    it('should throw custom error when booking system return error', async () => {
      const errorResponse = {
        errors: {
          errorCode: '0',
          errorMessage: 'Server Error',
        },
      };
      (axios.get as jest.Mock).mockRejectedValue(errorResponse);

      await expect(getBookingInfo(bookingEvidenceId)).rejects.toThrow(
        new CustomError(
          SERVER_ERROR,
          ErrorType.thirdServiceError,
          BOOKING_SYSTEM_SERVER_ERROR_WHEN_GETTING_BOOKING_INFO,
          [errorResponse.toString()],
        ),
      );
    });
  });
});
