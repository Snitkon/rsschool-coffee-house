import { initMenu } from './utils/init.js';
import { MenuCard } from './utils/cardMenu.js';
import { Switchers } from './utils/switcherMenu.js';
import { menuConfig } from './utils/config.js';

let products = [];
const switcherSelector = '.menu_switchers__wrapper';
const cardsSelector = '.menu_cards__wrapper';

export async function menu() {
  products = await initMenu();
  const switchersWrapper = document.querySelector(switcherSelector);
  const switchers = new Switchers(menuConfig, {
    default: 'coffee',
    onChange: category => renderCards(category)
  });
  switchersWrapper.appendChild(switchers.createSwitchers());

  renderCards(switchers.getActive());
}

function renderCards(category) {
  const cardsWrapper = document.querySelector(cardsSelector);
  if (!cardsWrapper) return;
  cardsWrapper.classList.add('fade-out');

  setTimeout(() => {
    cardsWrapper.innerHTML = '';

    const categoryImageCounts = {
      coffee: { count: 0, max: 8 },
      dessert: { count: 0, max: 8 },
      tea: { count: 0, max: 4 }
    };

    products
      .filter(product => product.category === category)
      .forEach(data => {
        const { name, description, price, category, sizes, additives } = data;

        if (!categoryImageCounts[category]) {
          console.error(`This category is not found: ${category}`);
          return;
        }

        categoryImageCounts[category].count = (categoryImageCounts[category].count % categoryImageCounts[category].max) + 1;
        const categoryCount = categoryImageCounts[category].count;
        const id = `${category}-${categoryImageCounts[category].count}`;
        const image = `/images/${category}-${categoryCount}.png`;
        const card = new MenuCard(category, sizes, additives, id, name, description, price, image);
        const menuCard = card.createCards();
        cardsWrapper.appendChild(menuCard);
      });

    cardsWrapper.classList.remove('fade-out');
    cardsWrapper.classList.add('fade-in');

    setTimeout(() => {
      cardsWrapper.classList.remove('fade-in');
    }, 300);
  }, 300);
}
