import { burger } from './utils/burger.js';
import { main } from './main.js';
import { menu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
  burger();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath === '/index.html';
  const isMenuPage = currentPath === '/menu.html' || currentPath === 'menu';

  if (isMainPage) {
    main();
  } else if (isMenuPage) {
    menu();
  }
});
