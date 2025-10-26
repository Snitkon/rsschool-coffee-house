import { Carousel } from './carousel/carousel';

import { Loader } from './loader/loader';

export function main() {
  const carousel = document.querySelector<HTMLElement>('.carousel');

  if (!carousel) {
    console.error('Container not found!');
    return;
  }

  try {
    const instanceCarousel = new Carousel(carousel, 3);
    const favoriteContainer = instanceCarousel.cardContainer;
    const destroy = instanceCarousel.destroy.bind(instanceCarousel);
    const loaderWrapper = new Loader({
      container: favoriteContainer,
      mainContainer: carousel,
      destroy: destroy,
    });
    loaderWrapper.load();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Main: unknown error';
    console.error({ message: message, error: err });
  }
}
