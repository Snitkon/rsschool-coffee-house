import { getFavoriteProducts } from '../../api/products/productsApi';
import { IProduct } from '../../types/types';
import { ErrorHandling } from '../error/errorHandling';
import { FavoriteCard } from '../favorite/favorite';
import { Spinner } from './spinner';

export class Loader {
  private container: HTMLElement;
  private mainContainer: HTMLElement;
  private destroy: () => void;

  constructor({
    container,
    mainContainer,
    destroy,
  }: {
    container: HTMLElement;
    mainContainer: HTMLElement;
    destroy: () => void;
  }) {
    this.container = container;
    this.mainContainer = mainContainer;
    this.destroy = destroy;
  }

  private showLoader() {
    const instanceSpinner = new Spinner();
    const spinner = instanceSpinner.createSpinner();
    this.container.appendChild(spinner);
  }

  async load() {
    this.showLoader();
    try {
      const data = await getFavoriteProducts();
      const handler = new ErrorHandling({
        isErrorText: '',
        container: this.container,
        mainContainer: this.mainContainer,
        data: data,
        renderFn: (favorites: Array<IProduct>) => {
          favorites.forEach(favorite => {
            const instanceFavoriteCard = new FavoriteCard(favorite);
            const favoriteCard = instanceFavoriteCard.createCards(false);
            this.container.appendChild(favoriteCard);
          });
        },
        destroyFn: this.destroy,
      });
      handler.render();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Loader: unknown error';
      console.error(message);
      this.container.innerHTML = `<div>${message}</div>`;
    }
  }
}
