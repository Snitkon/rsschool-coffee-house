export class Modal {
  modalData;

  constructor({ id, image, name, description, size, additives, price }) {
    this.modalData = { id, image, name, description, size, additives, price };
  }

  createModal() {
    document.body.style.overflow = 'hidden';
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    const image = document.createElement('img');
    const rightWrapper = document.createElement('div');
    const infoBlock = document.createElement('div');
    const sizeBlock = document.createElement('div');
    const additivesBlock = document.createElement('div');
    const priceBlock = document.createElement('div');
    const noteBlock = document.createElement('div');
    const button = document.createElement('button');
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

    overlay.classList.add('overlay');
    modal.classList.add('modal');
    image.classList.add('modal__image');
    rightWrapper.classList.add('modal__right_wrapper');
    infoBlock.classList.add('right_wrapper__info_block');
    sizeBlock.classList.add('right_wrapper__size_block');
    additivesBlock.classList.add('right_wrapper__additives_block');
    priceBlock.classList.add('right_wrapper__price_block');
    noteBlock.classList.add('right_wrapper__note_block');
    button.classList.add('right_wrapper__btn', 'button_secondary');
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

    modal.setAttribute('id', `modal_${this.modalData.id}`);
    image.setAttribute('alt', `modal_${this.modalData.name}`);
    image.setAttribute('src', this.modalData.image);

    nameTitle.textContent = this.modalData.name;
    description.textContent = this.modalData.description;
    sizeSubtitle.textContent = 'Size';
    additivesSubtitle.textContent = 'Additives';
    priceTitle.textContent = 'Total:';
    price.textContent = `$${this.modalData.price}`;
    note.textContent =
      'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';
    button.textContent = 'Close';

    overlay.append(modal);
    modal.append(image, rightWrapper);
    rightWrapper.append(infoBlock, sizeBlock, additivesBlock, priceBlock, noteBlock, button);
    infoBlock.append(nameTitle, description);
    sizeBlock.append(sizeSubtitle);
    additivesBlock.append(additivesSubtitle);
    priceBlock.append(priceTitle, price);
    noteBlock.append(noteIcon, note);
    return overlay;
  }
}
