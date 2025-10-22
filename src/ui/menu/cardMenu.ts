import { FavoriteCard } from './favorite';
import { Modal } from './modal';

export class MenuCard extends FavoriteCard {
  constructor(category, sizes, additives, ...arg) {
    super(...arg);
    this.category = category;
    this.size = sizes;
    this.additives = additives;
    this.modal = null;
  }

  createCards() {
    const card = super.createCards();
    const img = card.querySelector('.card_image');
    const image_wrapper = document.createElement('div');
    image_wrapper.classList.add('card_image__wrapper');
    image_wrapper.append(img);
    card.prepend(image_wrapper);
    card.addEventListener('click', () => this.openModal());
    return card;
  }

  openModal() {
    if (this.modal) return;
    const body = document.querySelector('.body');
    const modal = new Modal({
      id: this.id,
      image: this.image,
      name: this.name,
      description: this.description,
      price: this.price,
      size: this.size,
      additives: this.additives,
    });
    this.modal = modal.createModal();
    body.prepend(this.modal);

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
