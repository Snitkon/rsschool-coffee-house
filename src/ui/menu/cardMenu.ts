import { IAdditives, IProduct, ISize, TSize } from '../../types/types';
import { FavoriteCard } from '../favorite/favorite';
import { Modal } from '../modal/modal';

export class MenuCard extends FavoriteCard {
  category: string;
  sizes: Record<TSize, ISize>;
  additives: Array<IAdditives>;
  discountPrice: string | null;
  modal: null;
  constructor({ category, sizes, additives, discountPrice, ...arg }: IProduct) {
    super(...arg);
    this.category = category;
    this.sizes = sizes!;
    this.additives = additives!;
    this.discountPrice = discountPrice;
    this.modal = null;
  }

  createCards() {
    const card = super.createCards();
    const img = card.querySelector<HTMLElement>('.card_image');
    const image_wrapper = document.createElement('div');
    image_wrapper.classList.add('card_image__wrapper');
    image_wrapper.append(img!);
    card.prepend(image_wrapper);
    card.addEventListener('click', () => this.openModal());
    return card;
  }

  openModal() {
    if (this.modal) return;
    const body = document.querySelector<HTMLElement>('.body');
    const modal = new Modal({
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      sizes: this.sizes,
      additives: this.additives,
      discountPrice: this.discountPrice,
    });
    this.modal = modal.createModal();
    body?.prepend(this.modal);

    this.modal.querySelector('.button_secondary').addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.remove();
    this.modal = null;
    document.body.style.overflow = '';
  }
}
