export function carousel({ favorites, carousel_block, favorite_container, carousel_container, indicators, btn_prev, btn_next }) {
  let current_index = 0;
  let auto_scroll_interval;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          current_index = parseInt(card.id) - 1;
        }
      });
    },
    {
      root: carousel_container,
      threshold: 0.5
    }
  );

  favorite_container.querySelectorAll('.card_container').forEach(card => observer.observe(card));

  btn_prev.addEventListener('click', () => {
    goToSlide(current_index - 1);
  });

  btn_next.addEventListener('click', () => {
    goToSlide(current_index + 1);
  });

  carousel_block.addEventListener('mouseenter', () => {
    clearInterval(auto_scroll_interval);
  });

  carousel_block.addEventListener('mouseleave', () => {
    startAutoScroll();
  });

  startAutoScroll();
  updateIndicator();

  function updateIndicator() {
    indicators.forEach((indicator, index) => {
      if (index === current_index) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  function startAutoScroll() {
    auto_scroll_interval = setInterval(() => {
      goToSlide(current_index + 1);
    }, 3000);
  }

  function goToSlide(index) {
    current_index = (index + favorites.length) % favorites.length;
    favorite_container.style.transform = `translateX(-${current_index * 100}%)`;
    updateIndicator();
  }
}
