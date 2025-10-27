import { IError, IErrorTest, ISuccess, TResponseApi } from '../types/types';

const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<TResponseApi<T>> {
  try {
    const res: Response = await fetch(`${BASE_URL}${url}`, options);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));

      if ('isTestError' in errData) {
        return errData as IErrorTest;
      }
      return errData as IError;
    }
    const data: ISuccess<T> = await res.json();
    return data;
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : 'Unknown error',
      error: err instanceof Error ? err.name : 'Error',
    };
  }
}
