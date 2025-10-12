import { renderCards } from '../menu';
import loader from '/icons/icon-loader.svg?raw';

export function handleResize(itemsPerPage, callback) {
  const newProductPerPage = window.innerWidth <= 768 ? 4 : 8;
  if (newProductPerPage !== itemsPerPage.items) {
    itemsPerPage.items = newProductPerPage;
    callback();
  }
}

export function getOrCreateLoaderBtn(container, currentCategory) {
  let btn = document.querySelector('.loader');
  if (!btn) {
    btn = document.createElement('button');
    btn.classList.add('button_secondary', 'loader');
    btn.innerHTML = loader;
    btn.addEventListener('click', () => {
      renderCards(currentCategory, false);
    });
    container.insertAdjacentElement('afterend', btn);
  }
  return btn;
}
