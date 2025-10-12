import { burger } from './utils/burger.js';
import { main } from './main.js';
import { menu } from './menu.js';
import { footer } from './utils/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  burger();
  footer();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath.startsWith('/index.html');
  const isMenuPage = currentPath === '/menu' || currentPath.startsWith('/menu.html');

  if (isMainPage) {
    console.log('MAIN');
    main();
  } else if (isMenuPage) {
    console.log('MENU');
    menu();
  }
});
