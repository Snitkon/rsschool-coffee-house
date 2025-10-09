import { FavoriteCard } from './utils/favorite.js';
import { initMain } from './utils/init.js';
import { carousel } from './utils/carousel.js';

export async function main() {
  const favorites = await initMain();
  const carousel_block = document.querySelector('.carousel');
  const carousel_container = document.querySelector('.carousel_container');
  const favorite_container = document.querySelector('.carousel__favorite_wrapper');
  const indicators = document.querySelectorAll('.indicator');
  const btn_prev = document.querySelector('.btn_prev');
  const btn_next = document.querySelector('.btn_next');

  favorites.forEach((data, index) => {
    const id = index + 1;
    const favorite = new FavoriteCard(id, data.image, data.name, data.description, data.price);
    const favoriteCard = favorite.createCards();
    favorite_container.append(favoriteCard);
  });

  carousel({
    favorites,
    carousel_block,
    favorite_container,
    carousel_container,
    indicators,
    btn_prev,
    btn_next
  });
}
