export function burger() {
  const selectors = {
    nav: '.nav',
    burger: '.burger'
  };

  const nav = document.querySelector(selectors.nav);
  const burger = document.querySelector(selectors.burger);

  if (!nav || !burger) {
    console.warn('Burger menu elements not found. Check selectors:', selectors);
    return;
  }

  function toggleBurger() {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    toggleBurger();
  });
}
