import { initMenu } from './init.js';
import { MenuCard } from './ui/cardMenu.js';
import { Switchers } from './switcher/switcherMenu.js';
import { getOrCreateLoaderBtn, handleResize } from './helper/helper.js';

let products = [];
const visibleCount = { count: 0 };
const itemsPerPage = { items: window.innerWidth <= 768 ? 4 : 8 };
const switcherSelector = '.menu__switchers__wrapper';
const cardsSelector = '.menu__cards__wrapper';

export async function menu() {
  products = await initMenu();
  const switchersWrapper = document.querySelector(switcherSelector);
  const switchers = new Switchers(menuConfig, {
    default: 'coffee',
    onChange: category => renderCards(category, true),
  });
  switchersWrapper.appendChild(switchers.createSwitchers());

  renderCards(switchers.getActive(), true);

  window.addEventListener('resize', () => {
    handleResize(itemsPerPage, () => renderCards(switchers.getActive(), true));
  });
}

export function renderCards(category, reset = false) {
  const cardsWrapper = document.querySelector(cardsSelector);
  if (!cardsWrapper) return;
  cardsWrapper.classList.add('fade-out');

  setTimeout(() => {
    if (reset) visibleCount.count = 0;

    const filtered = products.filter(product => product.category === category);
    const loaderBtn = getOrCreateLoaderBtn(cardsWrapper, category);

    const maxToShow = Math.min(visibleCount.count + itemsPerPage.items, filtered.length);
    const itemsToRender = filtered.slice(0, maxToShow);

    cardsWrapper.innerHTML = '';

    const categoryImageCounts = {
      coffee: { count: 0, max: 8 },
      dessert: { count: 0, max: 8 },
      tea: { count: 0, max: 4 },
    };

    itemsToRender.forEach(data => {
      const { name, description, price, category, sizes, additives } = data;
      if (!categoryImageCounts[category]) {
        console.error(`This category is not found: ${category}`);
        return;
      }

      categoryImageCounts[category].count =
        (categoryImageCounts[category].count % categoryImageCounts[category].max) + 1;
      const categoryCount = categoryImageCounts[category].count;
      const id = `${category}-${categoryImageCounts[category].count}`;
      const image = `/images/${category}-${categoryCount}.png`;
      const card = new MenuCard(category, sizes, additives, id, name, description, price, image);
      const menuCard = card.createCards();
      cardsWrapper.appendChild(menuCard);
    });

    visibleCount.count = maxToShow;

    if (visibleCount.count >= filtered.length) {
      loaderBtn.style.display = 'none';
    } else {
      loaderBtn.style.display = 'flex';
    }

    cardsWrapper.classList.remove('fade-out');
    cardsWrapper.classList.add('fade-in');

    setTimeout(() => {
      cardsWrapper.classList.remove('fade-in');
    }, 300);
  }, 300);
}
