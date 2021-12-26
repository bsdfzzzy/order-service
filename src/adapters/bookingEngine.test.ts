import axios from 'axios';
import { when } from 'jest-when';

import { BookingRequestBody } from '../types/BookingEngine';

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
  });
});
