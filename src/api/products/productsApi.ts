import { apiFetch } from '../apiFetch';
import { IProduct } from '../../types/types';

export async function getAllProducts() {
  const response = await apiFetch<Array<IProduct>>('/products', {
    headers: {
      Accept: 'application/json',
    },
  });

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

export async function getOneProducts(id: number) {
  const response = await apiFetch<IProduct>(`/products/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  return response;
}
