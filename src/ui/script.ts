import { main } from './main';
import { burger } from './burger/burger';
import { footer } from './footer/footer';
import { signUp } from './signup';
import { signIn } from './signin';
import { cart } from './cart';
// import { menu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
  burger();
  footer();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath.startsWith('/index.html');
  const isMenuPage = currentPath === '/menu' || currentPath.startsWith('/menu.html');
  const isSignUp = currentPath === '/signup' || currentPath.startsWith('/signup.html');
  const isSignIn = currentPath === '/signin' || currentPath.startsWith('/signin.html');
  const isCart = currentPath === '/cart' || currentPath.startsWith('/cart.html');

  if (isMainPage) {
    main();
  } else if (isMenuPage) {
    // menu();
  } else if (isSignUp) {
    signUp();
  } else if (isSignIn) {
    signIn();
  } else if (isCart) {
    cart();
  }
});
