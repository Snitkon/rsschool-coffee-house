import { IOrder, PaymentMethod } from '../../types/types';
import { Storage } from '../storage/storage';
import trashIcon from '/icons/icon-trash.svg?raw';
import cartIcon from '/icons/icon-cart.svg?raw';

export class Cart {
  private root: HTMLDivElement;
  private totalPrice: number;
  private signInBtn?: HTMLButtonElement;
  private signUpBtn?: HTMLButtonElement;
  private confirmBtn?: HTMLButtonElement;
  private totalPriceElement!: HTMLElement;
  private ordersBlock!: HTMLDivElement;
  static navCartBlock: HTMLLinkElement | null = null;

  constructor(root: HTMLDivElement) {
    this.root = root;
    this.totalPrice = 0;

    this.createStructure();
    this.loadCartItems();
  }

  private async createStructure() {
    const totalBlock = document.createElement('div');
    const totalTitle = document.createElement('h3');
    this.totalPriceElement = document.createElement('h3');
    this.ordersBlock = document.createElement('div');
    const btnBlock = document.createElement('div');

    totalBlock.classList.add('total');
    totalTitle.classList.add('total__title');
    this.totalPriceElement.classList.add('total__price');
    this.ordersBlock.classList.add('total__orders');
    btnBlock.classList.add('btn_block');

    totalTitle.textContent = 'Total:';
    this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;

    const profile = await Storage.getUserProfile();

    if (profile) {
      const storeQuantity = Storage.getQuantity();
      this.confirmBtn = document.createElement('button');

      const bottomBlock = document.createElement('div');

      const addressBlock = document.createElement('div');
      const addressTitle = document.createElement('h3');
      const address = document.createElement('h3');

      const payByBlock = document.createElement('div');
      const payByTitle = document.createElement('h3');
      const payBy = document.createElement('h3');

      bottomBlock.classList.add('bottom_block');

      addressBlock.classList.add('address');
      addressTitle.classList.add('address__title');
      address.classList.add('address__text');

      payByBlock.classList.add('pay_by');
      payByTitle.classList.add('pay_by__title');
      payBy.classList.add('pay_by__text');

      addressTitle.textContent = 'Address:';
      address.textContent = `${profile.city}, ${profile.street}, ${profile.houseNumber}`;

      payByTitle.textContent = 'Pay By:';
      payBy.textContent = PaymentMethod[profile.paymentMethod];

      addressBlock.append(addressTitle, address);
      payByBlock.append(payByTitle, payBy);
      bottomBlock.append(totalBlock, addressBlock, payByBlock);

      this.confirmBtn.classList.add('button_secondary', 'confirm__btn');
      if (storeQuantity <= 0) {
        this.confirmBtn.classList.add('hidden');
      }
      this.confirmBtn.textContent = 'Confirm';

      btnBlock.append(this.confirmBtn);
      totalBlock.append(totalTitle, this.totalPriceElement);
      this.root.append(this.ordersBlock, bottomBlock, btnBlock);
    } else {
      this.signUpBtn = document.createElement('button');
      this.signInBtn = document.createElement('button');

      this.signUpBtn.classList.add('button_secondary', 'signUp__btn');
      this.signInBtn.classList.add('button_secondary', 'signIn__btn');

      this.signUpBtn.textContent = 'Registration';
      this.signInBtn.textContent = 'Sign In';

      btnBlock.append(this.signInBtn, this.signUpBtn);
      totalBlock.append(totalTitle, this.totalPriceElement);
      this.root.append(this.ordersBlock, totalBlock, btnBlock);
    }
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
    const additives = document.createElement('span');

    orderWrapper.classList.add('order');
    leftBlock.classList.add('order__left');
    trashBlock.classList.add('order__left_trash');
    imageBlock.classList.add('order__left_image');
    infoBlock.classList.add('order__left_info');
    priceBlock.classList.add('order__price');
    img.classList.add('left__image_img');
    title.classList.add('left_info__title');
    additives.classList.add('left_info__additives');

    img.setAttribute('alt', 'order-image');
    img.setAttribute('src', `/images/${order.category}-${order.productId}.png`);

    title.textContent = `${order.name}`;
    additives.textContent = order.additives.join(', ') || 'No additives';
    quantity.textContent = `x${order.quantity}`;
    price.textContent = `$${Number(order.price).toFixed(2)}`;

    imageBlock.append(img);
    infoBlock.append(title, additives);
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
      this.totalPrice = cart.totalPrice;
      this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;
      cart.items.forEach(item => {
        const orderElement = this.createStructureOrder(item);
        this.ordersBlock.append(orderElement);
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

  private confirmOrder() {}
}
