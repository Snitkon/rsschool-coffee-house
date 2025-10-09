export class FavoriteCard {
  constructor(id, image, name, description, price) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.description = description;
    this.price = price;
  }

  createCards() {
    const container = document.createElement('div');
    const info_wrapper = document.createElement('div');
    const image = document.createElement('img');
    const name = document.createElement('h3');
    const description = document.createElement('p');
    const price = document.createElement('span');

    container.setAttribute('id', this.id);
    image.setAttribute('alt', `card_${this.name}`);
    image.setAttribute('src', this.image);

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
