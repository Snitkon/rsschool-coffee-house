import { Cart } from './cart/cart';

export function cart() {
  const root = document.querySelector<HTMLDivElement>('.cart');

  if (!root) {
    console.error('Not found root!');
    return;
  }
  new Cart(root);
}
