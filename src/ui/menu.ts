import { Switchers } from './switcher/switcherMenu.js';
import { debounce, handleResize } from './helper/helper.js';
import { MenuCard } from './menu/cardMenu.js';
import { IMenuSwitch, TCategory } from '../types/types.js';
import { menuConfig } from './helper/config';

const itemsPerPage = { items: window.innerWidth <= 768 ? 4 : 8 };
const switcherSelector = '.menu__switchers__wrapper';

export async function menu() {
  const switchersWrapper = document.querySelector<HTMLElement>(switcherSelector);
  const switchers = new Switchers<TCategory, IMenuSwitch>(menuConfig, {
    default: 'coffee',
    onChange: category => MenuCard.changeCategory(category as TCategory, true),
  });
  switchersWrapper!.appendChild(switchers.createSwitchers());

  await MenuCard.changeCategory(switchers.getActive() as TCategory, true);

  window.addEventListener(
    'resize',
    debounce(async () => {
      const newItemsPerPage = window.innerWidth <= 768 ? 4 : 8;
      if (newItemsPerPage !== itemsPerPage.items) {
        itemsPerPage.items = newItemsPerPage;
        MenuCard.itemsPerPage.items = newItemsPerPage;
        handleResize(async () => {
          const activeCategory = switchers.getActive();
          if (activeCategory) {
            await MenuCard.changeCategory(switchers.getActive() as TCategory, true);
          }
        });
      }
    }, 200),
  );
}
