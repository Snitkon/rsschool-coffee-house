import initMain from './main.js';
import initMenu from './menu.js';

if (document.body.id === 'main') {
  initMain();
} else if (document.body.id === 'menu') {
  initMenu();
}
