export function burger() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const burger_line = document.querySelectorAll('.line');

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
    for (let i = 0; i <= burger_line.length - 1; i++) {
      burger_line[i].classList.toggle(`line_${i + 1}`);
    }
  });
}
