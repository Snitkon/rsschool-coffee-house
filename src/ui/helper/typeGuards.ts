import { IError, IErrorTest, ISuccess, TResponseApi } from '../../types/types';

export function isSuccessResponse<T>(data: TResponseApi<T>): data is ISuccess<T> {
  return typeof data === 'object' && data !== null && 'data' in data;
}

export function isErrorResponse<T>(data: TResponseApi<T>): data is IError {
  return typeof data === 'object' && data !== null && ('error' in data || ('message' in data && 'statusCode' in data));
}

export function isTestErrorResponse<T>(data: TResponseApi<T>): data is IErrorTest {
  return typeof data === 'object' && data !== null && 'isTestError' in data;
}
