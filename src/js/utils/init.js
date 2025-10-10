import products from '../../data/products.json';
import favorites from '../../data/favorites.json';

function getProducts() {
  try {
    if (!products) {
      throw new Error('Products data is not available');
    }
    return Promise.resolve(products);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading products:', error);
      return Promise.reject(error);
    }
  }
}

function getFavorites() {
  try {
    if (!favorites) {
      throw new Error('Products data is not available');
    }
    return Promise.resolve(favorites);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error loading favorites:', error);
      return Promise.reject(error);
    }
  }
}

export async function initMain() {
  const favorites = await getFavorites();

  return favorites;
}

export async function initMenu() {
  const products = await getProducts();

  return products;
}
