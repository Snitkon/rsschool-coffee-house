import { getOneProduct } from '../../api/products/productsApi';
import { IAdditives, IOrder, IProduct, ISize, TSize } from '../../types/types';
import { Cart } from '../cart/cart';
import { ErrorHandling } from '../error/errorHandling';
import { Spinner } from '../loader/spinner';
import { Storage } from '../storage/storage';
import { Switchers } from '../switcher/switcherMenu';

export class Modal {
  id: number;
  overlay!: HTMLDivElement;
  root!: HTMLDivElement;
  body!: HTMLElement | null;
  product!: IProduct | null;
  totalPrice!: number;
  regularPrice!: number;
  isAuth!: boolean;
  selected: { size: TSize; additives: Set<string> } = {
    size: 's',
    additives: new Set(),
  };

  constructor(id: number) {
    this.id = id;
    this.isAuth = false;
    this.createStructure();
    this.getModalData();
  }

  private showLoader() {
    const instanceSpinner = new Spinner();
    const spinner = instanceSpinner.createSpinner();
    this.root.appendChild(spinner);
  }

  private async getModalData() {
    this.showLoader();
    try {
      const product = await getOneProduct(this.id);
      const profile = await Storage.getUserProfile();
      this.isAuth = !!profile;
      const handler = new ErrorHandling({
        isErrorText: '',
        container: this.root,
        data: product,
        renderFn: product => {
          this.product = product;
          this.createModal();
        },
      });
      handler.render();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Loader: unknown error';
      console.error(message);
      this.root.innerHTML = `<div>${message}</div>`;
    }
  }

  private createStructure() {
    this.body = document.querySelector<HTMLElement>('.body');
    if (!this.body) {
      console.error('Not found body!');
      return;
    }
    this.overlay = document.createElement('div');
    this.root = document.createElement('div');

    this.overlay.classList.add('overlay');
    this.root.classList.add('modal');

    this.root.setAttribute('id', `modal_${this.id}`);
    this.overlay.append(this.root);
    this.body.append(this.overlay);
  }

  private createModal() {
    if (!this.product) return;
    this.root.innerHTML = '';
    const transformAdditives = this.product.additives?.reduce<Record<string, IAdditives>>((acc, item, index) => {
      acc[index + 1] = item;
      return acc;
    }, {});

    const sizeSwitcher = new Switchers<TSize, ISize>(this.product.sizes!, {
      default: 's',
      onChange: size => this.setSize(size as TSize),
    });
    const additivesSwitcher = new Switchers<string, IAdditives>(transformAdditives!, {
      default: '0',
      onChange: additives => this.setAdditives(additives as Set<string>),
      multiply: true,
    });

    document.body.style.overflow = 'hidden';

    const image = document.createElement('img');
    const rightWrapper = document.createElement('div');
    const infoBlock = document.createElement('div');
    const sizeBlock = document.createElement('div');
    const additivesBlock = document.createElement('div');
    const priceBlock = document.createElement('div');
    const noteBlock = document.createElement('div');
    const addButton = document.createElement('button');
    const closeButton = document.createElement('button');
    const lineOne = document.createElement('span');
    const lineTwo = document.createElement('span');
    const nameTitle = document.createElement('h3');
    const description = document.createElement('p');
    const sizeSubtitle = document.createElement('p');
    const size = document.createElement('div');
    const additivesSubtitle = document.createElement('p');
    const additives = document.createElement('div');
    const priceTitle = document.createElement('h3');
    const price = document.createElement('h3');
    const noteIcon = document.createElement('div');
    const note = document.createElement('p');

    image.classList.add('modal__image');
    rightWrapper.classList.add('modal__right_wrapper');
    infoBlock.classList.add('right_wrapper__info_block');
    sizeBlock.classList.add('right_wrapper__size_block');
    additivesBlock.classList.add('right_wrapper__additives_block');
    priceBlock.classList.add('right_wrapper__price_block');
    noteBlock.classList.add('right_wrapper__note_block');
    addButton.classList.add('right_wrapper__btn', 'button_secondary');
    closeButton.classList.add('button_secondary', 'modal__close_btn');
    lineOne.classList.add('close_btn_line');
    lineTwo.classList.add('close_btn_line');
    nameTitle.classList.add('info_block__name_title');
    description.classList.add('info_block__description');
    sizeSubtitle.classList.add('size_block__size_subtitle');
    size.classList.add('size_block__size_subtitle');
    additivesSubtitle.classList.add('additives_block__additives_subtitle');
    additives.classList.add('additives_block__additives');
    priceTitle.classList.add('price_block__price_title');
    price.classList.add('price_block__price');
    noteIcon.classList.add('note_block__note_icon');
    note.classList.add('note_block__note');

    image.setAttribute('alt', `modal_${this.product.name}`);
    image.setAttribute('src', `images/${this.product.category}-${this.product.id}.png`);

    nameTitle.textContent = this.product.name;
    description.textContent = this.product.description;
    sizeSubtitle.textContent = 'Size';
    additivesSubtitle.textContent = 'Additives';
    priceTitle.textContent = 'Total:';
    price.textContent =
      this.isAuth && this.product.discountPrice !== null ? `$${this.product.discountPrice}` : `$${this.product.price}`;
    note.textContent =
      'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';
    addButton.textContent = 'Add to cart';
    this.totalPrice =
      this.isAuth && this.product.discountPrice !== null ? this.product.discountPrice : this.product.price;
    this.regularPrice = this.product.price;

    closeButton.addEventListener('click', () => this.closeModal());
    addButton.addEventListener('click', () => this.addToCart());

    this.overlay.addEventListener('click', event => {
      if (event.target === this.overlay) {
        this.closeModal();
      }
    });

    this.root.append(image, rightWrapper, closeButton);
    closeButton.append(lineOne, lineTwo);
    rightWrapper.append(infoBlock, sizeBlock, additivesBlock, priceBlock, noteBlock, addButton);
    infoBlock.append(nameTitle, description);
    sizeBlock.append(sizeSubtitle, sizeSwitcher.createSwitchers());
    additivesBlock.append(additivesSubtitle, additivesSwitcher.createSwitchers());
    priceBlock.append(priceTitle, price);
    noteBlock.append(noteIcon, note);
    this.overlay.append(this.root);
  }

  private setSize(size: TSize) {
    this.selected.size = size;
    this.updatePrice();
  }

  private setAdditives(additives: Set<string>) {
    this.selected.additives = additives;
    this.updatePrice();
  }

  private updatePrice() {
    if (!this.product) return;
    if (!this.product.sizes || Object.keys(this.product.sizes).length === 0) {
      console.error('Modal: sizes are missing or empty');
      return;
    }

    if (!this.product.additives || this.product.additives.length === 0) {
      console.error('Modal: no additives found');
      return;
    }
    const basicPrice =
      this.isAuth && this.product.discountPrice !== null ? +this.product.discountPrice : +this.product.price;
    const regBasic = +this.product.price;
    const size = this.product.sizes[this.selected.size];
    const regSizeAdd = (() => {
      const baseSize = this.product.sizes?.s;
      const selectedSize = size || baseSize;

      if (!selectedSize) return 0;

      return +selectedSize.price || +baseSize.price || 0;
    })();
    const sizeAdd = (() => {
      const baseSize = this.product.sizes?.s;
      const selectedSize = size || baseSize;

      if (!selectedSize) return 0;

      if (this.isAuth) {
        if (selectedSize.discountPrice != null) {
          return +selectedSize.discountPrice;
        } else if (selectedSize === baseSize && this.product.discountPrice != null) {
          return +this.product.discountPrice;
        }
      }
      return +selectedSize.price || +baseSize.price || 0;
    })();
    let additivesAdd = 0;
    let regularAdditives = 0;
    for (const key of this.selected.additives) {
      const index = Number(key);
      const additive =
        this.isAuth && this.product.discountPrice !== null
          ? this.product.additives[index - 1]['discountPrice'] || this.product.additives[index - 1]['price']
          : this.product.additives[index - 1]['price'];
      additivesAdd += +additive;
      const regAdditives = this.product.additives[index - 1]['price'];
      regularAdditives += +regAdditives;
    }

    this.totalPrice = basicPrice + (sizeAdd - basicPrice) + additivesAdd;
    this.regularPrice = regBasic + (regSizeAdd - regBasic) + regularAdditives;
    const price = document.querySelector<HTMLElement>('.price_block__price');
    price!.textContent = `$${this.totalPrice.toFixed(2)}`;
  }

  private closeModal() {
    if (!this.root || !this.overlay) {
      console.error('Not found root or overlay');
      return;
    }
    this.overlay.remove();
    this.root = null!;
    this.overlay = null!;
    document.body.style.overflow = '';
  }

  private addToCart() {
    if (!this.product) {
      console.error('No product selected');
      return;
    }

    const additives = [];
    for (const key of this.selected.additives) {
      const additiveIndex = +key - 1;
      if (this.product.additives && this.product.additives[additiveIndex]) {
        additives.push(this.product.additives[additiveIndex].name);
      } else {
        console.warn(`Additive with index ${key} not found`);
      }
    }

    console.log(this.regularPrice);
    console.log(this.totalPrice);
    const order: IOrder = {
      name: this.product.name,
      productId: this.product.id,
      size: this.selected.size,
      quantity: 1,
      price: this.totalPrice,
      discountPrice: this.totalPrice,
      regularPrice: this.regularPrice,
      category: this.product.category,
      additives: additives,
    };

    Storage.addOrderToCart(order);
    Cart.updateCartQuantity();
  }
}
