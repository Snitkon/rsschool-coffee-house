import { main } from './main';
import { burger } from './burger/burger';
import { footer } from './footer/footer';
// import { menu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
  burger();
  footer();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath.startsWith('/index.html');
  const isMenuPage = currentPath === '/menu' || currentPath.startsWith('/menu.html');

  if (isMainPage) {
    main();
  } else if (isMenuPage) {
    // menu();
  }
});
