export type BookingRequestBody = {
  orderId: number;
  productId: string;
  personName: string;
  identificationNumber: string;
  mobilePhone: string;
};

export enum OrderBookingStatus {
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
}

export type BookingInfoResponse = {
  finished: boolean;
  result?: OrderBookingStatus;
};
