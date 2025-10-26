import { apiFetch } from '../apiFetch';
import { IProduct, TCategory } from '../../types/types';
import { isSuccessResponse } from '../../ui/helper/typeGuards';

export async function getAllProducts(category: TCategory) {
  const response = await apiFetch<Array<IProduct>>('/products', {
    headers: {
      Accept: 'application/json',
    },
  });
  if (isSuccessResponse(response)) {
    const filtered = response.data.filter(item => item.category === category);
    return { ...response, data: filtered };
  }
  return response;
}

export async function getFavoriteProducts() {
  const response = await apiFetch<Array<IProduct>>('/products/favorites', {
    headers: {
      Accept: 'application/json',
    },
  });
  return response;
}

export async function getOneProduct(id: number) {
  const response = await apiFetch<IProduct>(`/products/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  return response;
}
