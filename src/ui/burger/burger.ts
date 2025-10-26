export function burger(): void {
  const selectors = {
    nav: '.nav',
    burger: '.burger',
    nav_list: '.nav_list',
    nav_menu: '.nav_menu',
  };

  const nav = document.querySelector<HTMLElement>(selectors.nav);
  const burger = document.querySelector<HTMLElement>(selectors.burger);
  const nav_list = document.querySelectorAll<HTMLElement>(selectors.nav_list);
  const nav_menu = document.querySelector<HTMLElement>(selectors.nav_menu);

  if (!nav || !burger || !nav_list || !nav_menu) {
    console.error('Burger menu elements not found. Check selectors:', selectors);
    return;
  }

  function toggleBurger(): void {
    const isOpen = nav!.classList.toggle('open');
    burger!.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    toggleBurger();
  });

  nav_list.forEach(nav_item => {
    nav_item.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  nav_menu.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
}
