import { initMenu } from './utils/init.js';
import { MenuCard } from './utils/cardMenu.js';
import { Switchers } from './utils/switcherMenu.js';

export async function menu() {
  const products = await initMenu();
  const menu_cards__wrapper = document.querySelector('.menu_cards__wrapper');
  const menu_switchers__wrapper = document.querySelector('.menu_switchers__wrapper');
  const categoryImageCounts = {
    coffee: { count: 0, max: 8 },
    dessert: { count: 0, max: 8 },
    tea: { count: 0, max: 4 }
  };

  products.forEach(data => {
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
    menu_cards__wrapper.append(menuCard);
  });

  const switchers = new Switchers(menu_cards__wrapper);
  const createSwitchers = switchers.createSwitcher();
  menu_switchers__wrapper.append(createSwitchers);
}
