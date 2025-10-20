import { apiFetch } from '../../js/utils/apiFetch';
import { IConfirmOrder, IConfirmOrderRequest } from '../../types/types';

export async function confirmOrder(data: IConfirmOrderRequest) {
  const jsonData = JSON.stringify(data);
  const response = await apiFetch<IConfirmOrder>('/orders/confirm', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });

  return response;
}
