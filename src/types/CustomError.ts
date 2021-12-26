export type ErrorResponse = {
  errorType: ErrorType;
  errorMessage: string;
  errors: string[] | null;
  errorRaw: any;
  errorsValidation: ErrorValidation[] | null;
  stack?: string;
};

export enum ErrorType {
  General = 'General',
  Raw = 'Raw',
  Validation = 'Validation',
  Unauthorized = 'Unauthorized',
  thirdServiceError = '3rdServiceError',
}

export type ErrorValidation = { [key: string]: string };
