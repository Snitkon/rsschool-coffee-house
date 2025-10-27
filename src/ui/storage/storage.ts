import { getProfile } from '../../api/auth/authApi';
import { ICart, IOrder, IProfile } from '../../types/types';
import { isErrorResponse, isTestErrorResponse } from '../helper/typeGuards';

export class Storage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly CART_KEY = 'cart';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  static setCart(order: ICart): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(order));
  }

  static getCart(): ICart | null {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : null;
  }

  static getQuantity(): number {
    let quantity = 0;
    const cart = this.getCart();
    if (!cart) return quantity;
    cart.items.forEach(item => (quantity += item.quantity));
    return quantity;
  }

  static addOrderToCart(order: IOrder): void {
    const cart = this.getCart() || ({ items: [], totalPrice: 0 } as ICart);

    const find = cart.items.findIndex(
      item =>
        item.productId === order.productId &&
        item.size === order.size &&
        item.additives.length === order.additives.length &&
        item.additives.every(i => order.additives.includes(i)),
    );

    if (find !== -1) {
      cart.items[find].quantity += order.quantity;
    } else {
      cart.items.push(order);
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.totalDiscountPrice = cart.items.reduce((acc, item) => acc + item.discountPrice! * item.quantity, 0);

    this.setCart(cart);
  }

  static removeOrderFromCart(order: IOrder) {
    const cart = this.getCart();
    if (!cart) return;

    cart.items = cart.items.filter(item => {
      if (
        item.productId === order.productId &&
        item.size === order.size &&
        item.additives.length === order.additives.length &&
        item.additives.every(i => order.additives.includes(i)) &&
        item.quantity === 1
      ) {
        return false;
      } else if (
        item.productId === order.productId &&
        item.size === order.size &&
        item.additives.length === order.additives.length &&
        item.additives.every(i => order.additives.includes(i)) &&
        item.quantity > 1
      ) {
        item.quantity -= 1;
        return true;
      }
      return true;
    });

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.totalDiscountPrice = cart.items.reduce((acc, item) => acc + item.discountPrice! * item.quantity, 0);

    this.setCart(cart);
  }

  static async getUserProfile(): Promise<IProfile | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const profile = await getProfile(token);
      if (isErrorResponse(profile)) {
        throw new Error(profile.message);
      }
      if (isTestErrorResponse(profile)) {
        throw new Error('Test Error!');
      }
      return profile.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Error';
      console.error(message);
      this.clearToken();
      return null;
    }
  }
}
