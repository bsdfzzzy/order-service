export type BookingRequestBody = {
  orderId: number;
  productId: string;
  personName: string;
  identificationNumber: string;
  mobilePhone: string;
};

export type CancelRequestBody = {
  orderId: number;
  bookingEvidenceId: string;
};

export enum OrderBookingStatus {
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
}

export enum OrderCancellationStatus {
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
}

export type BookingInfoResponse = {
  id: string;
  finished: boolean;
  result?: OrderBookingStatus;
};

export type CancellationInfoResponse = {
  id: string;
  finished: boolean;
  result?: OrderCancellationStatus;
};
