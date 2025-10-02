import { burger } from './main.js';
import initMenu from './menu.js';

if (document.body.id === 'main') {
  burger();
} else if (document.body.id === 'menu') {
  initMenu();
}
