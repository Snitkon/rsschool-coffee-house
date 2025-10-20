export type TPayment = 'card' | 'cash';

export type TSize = 's' | 'm' | 'l';

export type TResponseApi<T> = ISuccess<T> | IErrorTest | IError;

export interface ISuccess<T> {
  data: T;
  message?: string;
}

export interface IErrorTest {
  error: string;
  isTestError: boolean;
  timestamp: string;
}

export interface IError {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface ISize {
  size: string;
  price: string;
  discountPrice: string;
}

export interface IAdditives {
  name: string;
  price: string;
  discountPrice: string;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: string;
  size?: Record<TSize, ISize>;
  additives?: Array<IAdditives>;
}

export interface IProfile {
  id: number;
  login: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: TPayment;
  createdAt: string;
}

export interface IOrder {
  productId: number;
  size: TSize;
  additives: Array<string>;
  quantity: number;
}

export interface IConfirmOrder {
  message: string;
  orderId: string;
}

export interface ILogInOrSignIn {
  access_token: string;
  user: IProfile;
}

export interface ILogInRequest {
  login: string;
  password: string;
}

export interface ISignUpRequest extends ILogInRequest {
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: TPayment;
}

export interface IConfirmOrderRequest {
  items: Array<IOrder>;
  totalPrice: number;
}
