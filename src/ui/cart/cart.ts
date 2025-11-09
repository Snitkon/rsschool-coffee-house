import { ICart, IOrder, PaymentMethod } from '../../types/types';
import { Storage } from '../storage/storage';
import trashIcon from '/icons/icon-trash.svg?raw';
import cartIcon from '/icons/icon-cart.svg?raw';
import { Spinner } from '../loader/spinner';
import { ErrorHandling } from '../error/errorHandling';
import { confirmOrder } from '../../api/order/orderApi';
import { removeKeysFromPayload } from '../helper/helper';
import { updateTranslations } from '../../utils/i18n';

export class Cart {
  private root: HTMLDivElement;
  private totalPrice: number;
  private signInBtn?: HTMLButtonElement;
  private signUpBtn?: HTMLButtonElement;
  private confirmBtn?: HTMLButtonElement;
  private totalPriceElement!: HTMLElement;
  private ordersBlock!: HTMLDivElement;
  private isAuth: boolean;
  static navCartBlock: HTMLLinkElement | null = null;

  constructor(root: HTMLDivElement) {
    this.root = root;
    this.totalPrice = 0;
    this.isAuth = false;

    this.init();
  }

  private async init() {
    await this.createStructure();
    this.loadCartItems();
  }

  private async createStructure() {
    const totalBlock = document.createElement('div');
    const totalTitle = document.createElement('h3');
    this.totalPriceElement = document.createElement('h3');
    this.ordersBlock = document.createElement('div');
    const btnBlock = document.createElement('div');

    totalTitle.setAttribute('data-i18n', 'cart.total');

    totalBlock.classList.add('total');
    totalTitle.classList.add('total__title');
    this.totalPriceElement.classList.add('total__price');
    this.ordersBlock.classList.add('total__orders');
    btnBlock.classList.add('btn_block');

    this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;

    const profile = await Storage.getUserProfile();
    this.isAuth = !!profile;

    if (profile) {
      const storeQuantity = Storage.getQuantity();
      this.confirmBtn = document.createElement('button');
      this.confirmBtn.setAttribute('data-i18n', 'cart.confirm');

      const bottomBlock = document.createElement('div');

      const addressBlock = document.createElement('div');
      const addressWrapper = document.createElement('div');
      const addressTitle = document.createElement('h3');
      const address = document.createElement('h3');
      const houseNumber = document.createElement('h3');

      const payByBlock = document.createElement('div');
      const payByTitle = document.createElement('h3');
      const payBy = document.createElement('h3');

      addressTitle.setAttribute('data-i18n', 'cart.address');
      payByTitle.setAttribute('data-i18n', 'cart.pay');
      address.setAttribute(
        'data-i18n',
        `signup.select.city.${profile.city.toLowerCase()} signup.select.street.${profile.city.toLowerCase()}.${profile.street}`,
      );
      payBy.setAttribute('data-i18n', `cart.${PaymentMethod[profile.paymentMethod].toLowerCase()}`);

      bottomBlock.classList.add('bottom_block');
      addressBlock.classList.add('address');
      addressWrapper.classList.add('address_wrapper');
      addressTitle.classList.add('address__title');
      address.classList.add('address__text');
      payByBlock.classList.add('pay_by');
      payByTitle.classList.add('pay_by__title');
      payBy.classList.add('pay_by__text');

      houseNumber.textContent = `${profile.houseNumber}`;
      // address.textContent = `${profile.city}, ${profile.street}, ${profile.houseNumber}`;

      addressWrapper.append(address, houseNumber);
      addressBlock.append(addressTitle, addressWrapper);
      payByBlock.append(payByTitle, payBy);
      bottomBlock.append(totalBlock, addressBlock, payByBlock);

      this.confirmBtn.classList.add('button_secondary', 'confirm__btn');
      if (storeQuantity <= 0) {
        this.confirmBtn.classList.add('hidden');
      }

      btnBlock.append(this.confirmBtn);
      totalBlock.append(totalTitle, this.totalPriceElement);
      this.root.append(this.ordersBlock, bottomBlock, btnBlock);
    } else {
      this.signUpBtn = document.createElement('button');
      this.signInBtn = document.createElement('button');

      this.signUpBtn.setAttribute('data-i18n', 'cart.signup');
      this.signInBtn.setAttribute('data-i18n', 'cart.signin');

      this.signUpBtn.classList.add('button_secondary', 'signUp__btn');
      this.signInBtn.classList.add('button_secondary', 'signIn__btn');

      btnBlock.append(this.signInBtn, this.signUpBtn);
      totalBlock.append(totalTitle, this.totalPriceElement);
      this.root.append(this.ordersBlock, totalBlock, btnBlock);
    }
    updateTranslations();
    this.setupListener();
  }

  private createStructureOrder(order: IOrder) {
    const orderWrapper = document.createElement('div');
    const leftBlock = document.createElement('div');
    const trashBlock = document.createElement('div');
    const imageBlock = document.createElement('div');
    const infoBlock = document.createElement('div');
    const priceBlock = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('h3');
    const price = document.createElement('h3');
    const quantity = document.createElement('h3');
    const additivesBlock = document.createElement('div');
    const sizeText = document.createElement('span');
    const additivesText = document.createElement('span');
    const size = document.createElement('span');
    const additives = document.createElement('span');
    const sizeWrapper = document.createElement('div');
    const additivesWrapper = document.createElement('div');

    orderWrapper.classList.add('order');
    leftBlock.classList.add('order__left');
    trashBlock.classList.add('order__left_trash');
    imageBlock.classList.add('order__left_image');
    infoBlock.classList.add('order__left_info');
    priceBlock.classList.add('order__price');
    img.classList.add('left__image_img');
    title.classList.add('left_info__title');
    additivesBlock.classList.add('left_info__additives');
    sizeWrapper.classList.add('size__wrapper');
    additivesWrapper.classList.add('additives__wrapper');

    img.setAttribute('alt', 'order-image');
    img.setAttribute('src', `/images/${order.category}-${order.productId}.png`);
    title.setAttribute('data-i18n', `data.${order.productId}.name`);
    if (order.additives.length > 0) {
      const additivesStr = order.additives.map(item => `cart.additives.${item.toLowerCase()}`).join(' ');
      additives.setAttribute('data-i18n', additivesStr);
    } else {
      additives.setAttribute('data-i18n', 'cart.additives.without');
    }
    sizeText.setAttribute('data-i18n', 'cart.size');
    additivesText.setAttribute('data-i18n', 'cart.additives.text');

    size.textContent = `${order.size.toUpperCase()}`;

    sizeWrapper.append(sizeText, size);
    additivesWrapper.append(additivesText, additives);
    additivesBlock.append(sizeWrapper, additivesWrapper);

    if (this.isAuth && order.discountPrice !== null) {
      price.classList.add('discount_price');
      price.innerHTML = `<span>$${Number(order.discountPrice).toFixed(2)}</span><span class='card_price_discount'>$${Number(order.regularPrice).toFixed(2)}<span>`;
    } else {
      price.textContent = `$${Number(order.price).toFixed(2)}`;
    }

    imageBlock.append(img);
    infoBlock.append(title, additivesBlock);
    priceBlock.append(quantity, price);
    trashBlock.innerHTML = trashIcon;
    leftBlock.append(trashBlock, imageBlock, infoBlock);
    orderWrapper.append(leftBlock, priceBlock);

    trashBlock.addEventListener('click', this.removeOrderFromCart.bind(this, order));

    return orderWrapper;
  }

  static async createHeaderCart() {
    const storeQuantity = Storage.getQuantity();
    const profile = await Storage.getUserProfile();

    this.navCartBlock = document.querySelector<HTMLLinkElement>('.nav_cart');
    const iconWrapper = document.createElement('div');
    const quantityWrapper = document.createElement('div');
    const quantity = document.createElement('span');

    if (!this.navCartBlock) {
      console.error('Container not found!');
      return;
    }

    iconWrapper.classList.add('nav_cart__icon_wrapper');
    quantityWrapper.classList.add('nav_cart__quantity_wrapper');

    this.navCartBlock.href = 'cart';
    quantity.textContent = storeQuantity.toString();
    iconWrapper.innerHTML = cartIcon;

    quantityWrapper.append(quantity);
    this.navCartBlock.append(iconWrapper, quantityWrapper);

    if (profile || storeQuantity > 0) {
      this.navCartBlock.classList.remove('hidden');
    } else {
      this.navCartBlock.classList.add('hidden');
    }
  }

  private async changeQuantity() {
    const storeQuantity = Storage.getQuantity();
    const profile = await Storage.getUserProfile();
    const cart = (this.constructor as typeof Cart).navCartBlock;
    if (!cart) {
      console.error('Container not found!');
      return;
    }
    cart.children[1].innerHTML = `<span>${storeQuantity}</span>`;
    if (storeQuantity > 0) {
      cart.classList.remove('hidden');
      if (this.confirmBtn) {
        this.confirmBtn.classList.remove('hidden');
      }
    } else {
      cart.classList.add('hidden');
      if (this.confirmBtn) {
        this.confirmBtn.classList.add('hidden');
      }
    }

    if (profile || storeQuantity > 0) {
      cart.classList.remove('hidden');
    } else {
      cart.classList.add('hidden');
    }
  }

  static async updateCartQuantity() {
    const storeQuantity = Storage.getQuantity();
    const profile = await Storage.getUserProfile();
    if (!this.navCartBlock) {
      console.error('Container not found!');
      return;
    }
    const quantityWrapper = this.navCartBlock.querySelector('.nav_cart__quantity_wrapper');
    if (quantityWrapper) {
      quantityWrapper.innerHTML = `<span>${storeQuantity}</span>`;
    }

    if (profile || storeQuantity > 0) {
      this.navCartBlock.classList.remove('hidden');
    } else {
      this.navCartBlock.classList.add('hidden');
    }
  }

  private setupListener() {
    if (this.signInBtn) {
      this.signInBtn.addEventListener('click', this.redirectSignIn.bind(this));
    }
    if (this.signUpBtn) {
      this.signUpBtn.addEventListener('click', this.redirectSignUp.bind(this));
    }
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', this.confirmOrder.bind(this));
    }
  }

  private redirectSignIn() {
    window.location.href = '/signin';
  }

  private redirectSignUp() {
    window.location.href = '/signup';
  }

  private loadCartItems() {
    const cart = Storage.getCart();
    if (cart && cart.items.length >= 0) {
      this.totalPrice = this.isAuth ? cart.totalDiscountPrice! : cart.totalPrice;
      this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;
      cart.items.forEach(item => {
        const orderElement = this.createStructureOrder(item);
        this.ordersBlock.append(orderElement);
        updateTranslations();
      });
    }
  }

  public async removeOrderFromCart(order: IOrder) {
    Storage.removeOrderFromCart(order);
    this.ordersBlock.innerHTML = '';
    this.loadCartItems();
    await this.changeQuantity();
    await (this.constructor as typeof Cart).updateCartQuantity();
  }

  private async confirmOrder() {
    const cartData = Storage.getCart();
    if (!cartData) return;
    const formatData = removeKeysFromPayload<IOrder, keyof IOrder>(
      { items: cartData.items, totalPrice: cartData.totalPrice },
      ['discountPrice', 'name', 'regularPrice', 'category', 'price'],
    );
    const container = document.createElement('div');
    const element = this.ordersBlock.parentElement;
    element?.insertAdjacentElement('beforeend', container);
    const spinner = new Spinner();
    const loader = spinner.createSpinner();

    try {
      container.append(loader);
      const data = await confirmOrder(formatData as ICart);
      const handling = new ErrorHandling({
        isErrorText: 'Something went wrong. Please, try again',
        container: container,
        data: data,
        renderFn: () => {
          this.totalPriceElement.innerHTML = '$0.00';
          this.ordersBlock.innerHTML = '';
          container.innerHTML = '';
          this.ordersBlock.setAttribute('data-i18n', 'cart.text');
          // this.ordersBlock.innerText = 'Thank you for your order! Our manager will contact you shortly.'
          Storage.clearCart();
          this.changeQuantity();
          updateTranslations();
        },
      });
      handling.render();
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Unknown Error');
    }
  }
}
