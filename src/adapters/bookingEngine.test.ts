import axios from 'axios';

import { BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, SERVER_ERROR } from '../consts';
import { BookingRequestBody } from '../types/BookingEngine';
import { ErrorType } from '../types/CustomError';
import { CustomError } from '../utils/response/CustomError';

import { book } from './bookingEngine';

jest.mock('axios');

const requestBody: BookingRequestBody = {
  productId: 'product_id',
  name: 'name',
  identificationNumber: '1111111111111111111111',
  mobilePhone: '13800000000',
};

describe('bookingEngine', () => {
  describe('book', () => {
    it('should post the request to 3rd service api gateway', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          evidenceId: 'booking_evidence_id',
        },
      });

      const evidenceId = await book(requestBody);

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

      await expect(book(requestBody)).rejects.toThrow(
        new CustomError(SERVER_ERROR, ErrorType.thirdServiceError, BOOKING_SYSTEM_SERVER_ERROR_WHEN_BOOKING, [
          errorResponse.toString(),
        ]),
      );
    });
  });
});
