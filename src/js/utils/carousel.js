export function carousel({ favorites, carousel_block, favorite_container, carousel_container, indicators, btn_prev, btn_next }) {
  let currentIndex = 0;
  let autoScrollInterval;
  const scrollTime = 3000;
  let startX = 0;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          currentIndex = parseInt(card.id) - 1;
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
    manualGoToSlide(currentIndex - 1);
  });

  btn_next.addEventListener('click', () => {
    manualGoToSlide(currentIndex + 1);
  });

  carousel_block.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
    pauseIndicatorFill();
  });

  carousel_block.addEventListener('mouseleave', () => {
    resumeIndicatorFill();
    restartAutoScrollAfterPause();
  });

  carousel_block.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  carousel_block.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) {
      goToSlide(currentIndex - 1);
    } else if (diff < -50) {
      goToSlide(currentIndex + 1);
    }
  });

  startAutoScroll();
  updateIndicator(true);

  function updateIndicator(startFill = false) {
    indicators.forEach((indicator, index) => {
      const fill = indicator.querySelector('.indicator_progress');
      if (index === currentIndex) {
        indicator.classList.add('active_indicator');
        if (startFill) startIndicatorFill(fill);
      } else {
        indicator.classList.remove('active_indicator');
        stopIndicatorFill(fill);
      }
    });
  }

  function startIndicatorFill(element) {
    if (!element) return;
    element.style.transition = 'none';
    element.style.width = '0%';
    setTimeout(() => {
      element.style.transition = `width ${scrollTime}ms linear`;
      element.style.width = '100%';
      element.dataset.paused = 'false';
    }, 10);
  }

  function pauseIndicatorFill() {
    const activeFill = indicators[currentIndex]?.querySelector('.indicator_progress');
    if (!activeFill) return;
    const computedWidth = getComputedStyle(activeFill).width;
    activeFill.style.transition = 'none';
    activeFill.style.width = computedWidth;
    activeFill.dataset.paused = 'true';
  }

  function resumeIndicatorFill() {
    const activeFill = indicators[currentIndex]?.querySelector('.indicator_progress');
    if (!activeFill || activeFill.dataset.paused !== 'true') return;

    const computedWidth = parseFloat(getComputedStyle(activeFill).width);
    const totalWidth = activeFill.parentElement.offsetWidth;
    const progress = computedWidth / totalWidth;

    const remainingTime = (1 - progress) * scrollTime;

    activeFill.style.transition = `width ${remainingTime}ms linear`;
    activeFill.style.width = '100%';
    activeFill.dataset.paused = 'false';
  }

  function restartAutoScrollAfterPause() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, scrollTime);
  }

  function stopIndicatorFill(element) {
    if (!element) return;
    element.style.transition = 'none';
    element.style.width = '0%';
    element.dataset.paused = 'false';
  }

  function startAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, scrollTime);
    updateIndicator(true);
  }

  function manualGoToSlide(index) {
    goToSlide(index);
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  function goToSlide(index) {
    currentIndex = (index + favorites.length) % favorites.length;
    favorite_container.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicator(true);
  }
}
