import { ICart, IOrder } from '../../types/types';
import { Storage } from '../storage/storage';
import trash from '/icons/icon-trash.svg?raw';

export class Cart {
  private root: HTMLDivElement;
  private totalPrice: number;
  private signInBtn!: HTMLButtonElement;
  private signUpBtn!: HTMLButtonElement;
  private totalPriceElement!: HTMLElement;
  private ordersBlock!: HTMLDivElement;
  private test!: ICart;

  constructor(root: HTMLDivElement) {
    this.test = {
      items: [
        {
          productId: 1,
          name: 'Marble cheesecake',
          size: 'm',
          additives: ['Sugar', 'Cinnamon'],
          quantity: 2,
          price: 7.75,
        },
        {
          productId: 1,
          name: 'Marble cheesecake',
          size: 'l',
          additives: ['Sugar'],
          quantity: 3,
          price: 6.5,
        },
      ],
      totalPrice: 35,
    };
    this.root = root;
    this.totalPrice = 0;

    Storage.setCart(this.test);
    this.createStructure();
    this.setupListener();
    this.loadCartItems();
  }

  private createStructure() {
    const totalBlock = document.createElement('div');
    const totalTitle = document.createElement('h3');
    this.totalPriceElement = document.createElement('h3');
    this.ordersBlock = document.createElement('div');
    const btnBlock = document.createElement('div');
    this.signUpBtn = document.createElement('button');
    this.signInBtn = document.createElement('button');

    totalBlock.classList.add('total');
    totalTitle.classList.add('total__title');
    this.totalPriceElement.classList.add('total__price');
    this.ordersBlock.classList.add('total__orders');
    btnBlock.classList.add('total__btn_block');
    this.signUpBtn.classList.add('button_secondary', 'signUp__btn');
    this.signInBtn.classList.add('button_secondary', 'signIn__btn');

    totalTitle.textContent = 'Total:';
    this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;
    this.signUpBtn.textContent = 'Registration';
    this.signInBtn.textContent = 'Sign In';
    totalBlock.append(totalTitle, this.totalPriceElement);
    btnBlock.append(this.signInBtn, this.signUpBtn);
    this.root.append(this.ordersBlock, totalBlock, btnBlock);
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
    img.setAttribute('src', '/images/dessert-2.png');

    title.textContent = `${order.name}`;
    additives.textContent = order.additives.join(', ') || 'No additives';
    price.textContent = `$${order.price?.toFixed(2)}`;

    imageBlock.append(img);
    infoBlock.append(title, additives);
    priceBlock.append(price);
    trashBlock.innerHTML = trash;
    leftBlock.append(trashBlock, imageBlock, infoBlock);
    orderWrapper.append(leftBlock, priceBlock);

    trashBlock.addEventListener('click', this.removeOrderFromCart.bind(this, order));

    return orderWrapper;
  }

  private setupListener() {
    this.signInBtn.addEventListener('click', this.redirectSignIn.bind(this));
    this.signUpBtn.addEventListener('click', this.redirectSignUp.bind(this));
  }

  private redirectSignIn() {
    window.location.href = '/signin';
  }

  private redirectSignUp() {
    window.location.href = '/signup';
  }

  private loadCartItems() {
    const cart = Storage.getCart();
    if (cart && cart.items.length > 0) {
      this.totalPrice = cart.totalPrice;
      this.totalPriceElement.textContent = `$${this.totalPrice.toFixed(2)}`;
      cart.items.forEach(item => {
        const orderElement = this.createStructureOrder(item);
        this.ordersBlock.append(orderElement);
      });
    }
  }

  public removeOrderFromCart(order: IOrder) {
    Storage.removeOrderFromCart(order);
    this.ordersBlock.innerHTML = '';
    this.loadCartItems();
  }
}
