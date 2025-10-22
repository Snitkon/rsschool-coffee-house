import { IProduct } from '../../types/types';

interface IFavoriteCard extends IProduct {
  image?: string;
}

export class FavoriteCard {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;

  constructor(favorite: IFavoriteCard) {
    this.id = favorite.id;
    this.name = favorite.name;
    this.description = favorite.description;
    this.price = favorite.price;
    this.image = favorite.image || 'images/logo.png';
  }

  createCards(): HTMLElement {
    const container = document.createElement('div');
    const info_wrapper = document.createElement('div');
    const image = document.createElement('img');
    const name = document.createElement('h3');
    const description = document.createElement('p');
    const price = document.createElement('span');

    container.setAttribute('id', `${this.id}`);
    image.setAttribute('alt', `card_${this.name}`);
    image.setAttribute('src', `images/coffee-${this.id}.png`);

    container.classList.add('card_container');
    info_wrapper.classList.add('card_info__wrapper');
    image.classList.add('card_image');
    name.classList.add('card_name');
    description.classList.add('card_description');
    price.classList.add('card_price');

    name.textContent = this.name;
    description.textContent = this.description;
    price.textContent = `$${this.price}`;

    info_wrapper.append(name, description, price);
    container.append(image, info_wrapper);
    return container;
  }
}
