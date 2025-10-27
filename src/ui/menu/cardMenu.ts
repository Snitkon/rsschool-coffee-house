import { IAdditives, IProduct, ISize, TCategory, TSize } from '../../types/types';
import { FavoriteCard } from '../favorite/favorite';
import { Modal } from '../modal/modal';
import { getAllProducts } from '../../api/products/productsApi';
import { ErrorHandling } from '../error/errorHandling';
import loader from '/icons/icon-loader.svg?raw';
import { Spinner } from '../loader/spinner';
import { Storage } from '../storage/storage';

export class MenuCard extends FavoriteCard {
  static cardsElement: HTMLDivElement | null;
  static products = [];
  static visibleCount = { count: 0 };
  static itemsPerPage = { items: window.innerWidth <= 768 ? 4 : 8 };
  static cardsSelector = '.menu__cards__wrapper';
  static currentCategory: TCategory | null = null;
  static categoryImageCounts: Record<TCategory, { count: number; max: number }> = {
    coffee: { count: 0, max: 0 },
    dessert: { count: 0, max: 0 },
    tea: { count: 0, max: 0 },
  };

  sizes: Record<TSize, ISize>;
  additives: Array<IAdditives>;
  modal: HTMLDivElement | null;

  constructor({ sizes, additives, ...arg }: IProduct) {
    super(arg);
    this.sizes = sizes!;
    this.additives = additives!;
    this.modal = null;
  }

  static getOrCreateLoaderBtn(container: HTMLDivElement): HTMLButtonElement {
    let btn = document.querySelector<HTMLButtonElement>('.loader_btn');
    if (btn) {
      btn.remove();
    }
    btn = document.createElement('button');
    btn.classList.add('button_secondary', 'loader_btn');
    btn.innerHTML = loader;
    btn.addEventListener('click', () => {
      if (this.currentCategory) {
        this.changeCategory(this.currentCategory, false);
      }
    });
    container.insertAdjacentElement('afterend', btn);

    return btn;
  }

  static showLoader(element: HTMLDivElement) {
    const instanceSpinner = new Spinner();
    const spinner = instanceSpinner.createSpinner();
    element.appendChild(spinner);
  }

  static async changeCategory(category: TCategory, reset: boolean) {
    this.currentCategory = category;
    this.cardsElement = document.querySelector<HTMLDivElement>(this.cardsSelector);
    if (!this.cardsElement) {
      console.error('Container not found!');
      return;
    }
    this.showLoader(this.cardsElement);
    try {
      const products = await getAllProducts(category);
      const handler = new ErrorHandling({
        isErrorText: '',
        container: this.cardsElement,
        data: products,
        renderFn: (products: Array<IProduct>) => {
          this.renderCards(products, reset);
        },
        destroyFn: this.removeLoaderBtn.bind(this),
      });
      handler.render();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Loader: unknown error';
      console.error(message);
      this.cardsElement.innerHTML = `<div>${message}</div>`;
    }
  }

  static removeLoaderBtn() {
    const loaderBtn = document.querySelector<HTMLButtonElement>('.loader_btn');
    if (loaderBtn) {
      loaderBtn.remove();
    }
  }

  private static async renderCards(products: Array<IProduct>, reset = false) {
    const isAuthenticated = await Storage.getUserProfile();
    const _this = MenuCard;

    _this.cardsElement!.classList.add('fade-out');

    setTimeout(async () => {
      if (reset) _this.visibleCount.count = 0;

      const filtered = products;

      if (!_this.categoryImageCounts[_this.currentCategory!]) {
        console.error(`This category is not found: ${_this.currentCategory}`);
        return;
      }
      _this.categoryImageCounts[_this.currentCategory!].max = filtered.length;
      _this.categoryImageCounts[_this.currentCategory!].count = 0;

      const maxToShow = Math.min(_this.visibleCount.count + _this.itemsPerPage.items, filtered.length);
      const itemsToRender = filtered.slice(0, maxToShow);

      _this.cardsElement!.innerHTML = '';

      itemsToRender.forEach(data => {
        const { id, name, description, price, category, sizes, additives, discountPrice } = data;
        _this.categoryImageCounts[category].count =
          (_this.categoryImageCounts[category].count % _this.categoryImageCounts[category].max) + 1;
        const card = new MenuCard({ category, sizes, additives, id, name, description, price, discountPrice });
        const menuCard = card.createCards(!!isAuthenticated);
        _this.cardsElement!.appendChild(menuCard);
      });

      _this.visibleCount.count = maxToShow;

      if (filtered.length > _this.itemsPerPage.items) {
        const loaderBtn = this.getOrCreateLoaderBtn(_this.cardsElement!);
        loaderBtn.style.display = _this.visibleCount.count >= filtered.length ? 'none' : 'flex';
      } else {
        this.removeLoaderBtn();
      }

      _this.cardsElement!.classList.remove('fade-out');
      _this.cardsElement!.classList.add('fade-in');

      setTimeout(() => {
        _this.cardsElement!.classList.remove('fade-in');
      }, 300);
    }, 300);
  }

  public createCards(isAuthenticated: boolean) {
    const card = super.createCards(isAuthenticated);
    const img = card.querySelector<HTMLElement>('.card_image');
    const image_wrapper = document.createElement('div');
    image_wrapper.classList.add('card_image__wrapper');
    image_wrapper.append(img!);
    card.prepend(image_wrapper);
    card.addEventListener('click', () => this.openModal());
    return card;
  }

  private openModal() {
    new Modal(this.id);
  }
}
