export function burger() {
  const selectors = {
    nav: '.nav',
    burger: '.burger',
    nav_list: '.nav_list',
    nav_menu: '.nav_menu'
  };

  const nav = document.querySelector(selectors.nav);
  const burger = document.querySelector(selectors.burger);
  const nav_list = document.querySelectorAll(selectors.nav_list);
  const nav_menu = document.querySelector(selectors.nav_menu);
  console.log(nav_menu)

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
  })
}
