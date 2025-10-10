import { burger } from './utils/burger.js';
import { main } from './main.js';
import { menu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
  burger();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath.startsWith('/index.html');
  const isMenuPage = currentPath === '/menu.html' && currentPath.startsWith('/menu.html');

  if (isMainPage) {
    console.log('MAIN');
    main();
  } else if (isMenuPage) {
    console.log('MENU');
    menu();
  }
});
