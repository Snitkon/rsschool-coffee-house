import { main } from './main';
import { burger } from './burger/burger';
import { footer } from './footer/footer';
import { signUp } from './signup';
import { signIn } from './signin';
import { cart } from './cart';
import { Cart } from './cart/cart';
import { menu } from './menu';
import { Storage } from './storage/storage';

document.addEventListener('DOMContentLoaded', () => {
  burger();
  footer();
  Cart.createHeaderCart();

  const currentPath = window.location.pathname;

  const isMainPage = currentPath === '/' || currentPath.startsWith('/index.html');
  const isMenuPage = currentPath === '/menu' || currentPath.startsWith('/menu.html');
  const isSignUp = currentPath === '/signup' || currentPath.startsWith('/signup.html');
  const isSignIn = currentPath === '/signin' || currentPath.startsWith('/signin.html');
  const isCart = currentPath === '/cart' || currentPath.startsWith('/cart.html');
  const token = Storage.getToken();

  if (isMainPage) {
    const hasVisitedMainPage = sessionStorage.getItem('hasVisitedMainPage');

    if (!token && !hasVisitedMainPage) {
      sessionStorage.setItem('hasVisitedMainPage', 'true');
      window.location.href = '/signin.html';
      return;
    }
    main();
  } else if (isMenuPage) {
    menu();
  } else if (isSignUp) {
    signUp();
  } else if (isSignIn) {
    signIn();
  } else if (isCart) {
    cart();
  }
});
