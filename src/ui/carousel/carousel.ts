import arrowIcon from '/icons/icon-arrow.svg?raw';

interface CarouselOptions {
  autoScrollTime?: number;
  showIndicators?: boolean;
}

export class Carousel {
  private carouselLength: number;
  private root: HTMLElement;
  private currentIndex = 0;
  private autoScrollInterval: number | null = null;
  private scrollTime: number;
  private observer!: IntersectionObserver;
  private startX = 0;

  private container!: HTMLElement;
  private favoriteContainer!: HTMLElement;
  private indicatorContainer!: HTMLElement;
  private indicators: HTMLElement[] = [];
  private btnPrev!: HTMLElement;
  private btnNext!: HTMLElement;

  constructor(carouselBlock: HTMLElement, carouselLength: number, options: CarouselOptions = {}) {
    this.carouselLength = carouselLength;
    this.root = carouselBlock;
    this.scrollTime = options.autoScrollTime || 3000;

    this.createStructure();
    this.attachEventListeners();
    this.startAutoScroll();
    this.updateIndicator(true);
  }

  private createStructure() {
    this.btnPrev = document.createElement('button');
    this.btnNext = document.createElement('button');
    this.container = document.createElement('div');
    this.favoriteContainer = document.createElement('div');
    this.indicatorContainer = document.createElement('div');

    this.btnPrev.classList.add('button_secondary', 'btn_prev');
    this.btnNext.classList.add('button_secondary', 'btn_next');
    this.container.classList.add('carousel_container');
    this.favoriteContainer.classList.add('carousel__favorite_wrapper');
    this.indicatorContainer.classList.add('carousel__indicator_wrapper');

    Array.from({ length: this.carouselLength }, (_, i) => i).forEach((_, i) => {
      const indicator = document.createElement('div');
      const progress = document.createElement('div');
      indicator.dataset.index = i.toString();
      indicator.classList.add('indicator');
      progress.classList.add('indicator_progress');
      indicator.appendChild(progress);
      this.indicators.push(indicator);
      this.indicatorContainer.append(indicator);
    });

    this.btnPrev.innerHTML = arrowIcon;
    this.btnNext.innerHTML = arrowIcon;

    this.container.append(this.favoriteContainer, this.indicatorContainer);

    this.root.append(this.btnPrev, this.container, this.btnNext);
  }

  public get cardContainer() {
    return this.favoriteContainer;
  }

  public setupObserver(className: string) {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            this.currentIndex = parseInt(card.id) - 1;
          }
        });
      },
      {
        root: this.root,
        threshold: 0.5,
      },
    );
    this.favoriteContainer.querySelectorAll(className).forEach(card => this.observer.observe(card));
  }

  private attachEventListeners() {
    this.btnPrev.addEventListener('click', () => {
      this.manualGoToSlide(this.currentIndex - 1);
    });

    this.btnNext.addEventListener('click', () => {
      this.manualGoToSlide(this.currentIndex + 1);
    });

    this.container.addEventListener('mouseenter', () => {
      this.clearAutoScroll();
      this.pauseIndicatorFill();
    });

    this.container.addEventListener('mouseleave', () => {
      this.resumeIndicatorFill();
      this.restartAutoScrollAfterPause();
    });

    this.container.addEventListener('touchstart', e => {
      this.startX = e.touches[0].clientX;
    });

    this.container.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - this.startX;

      if (diff > 50) {
        this.goToSlide(this.currentIndex - 1);
      } else if (diff < -50) {
        this.goToSlide(this.currentIndex + 1);
      }
    });
  }

  private updateIndicator(startFill = false) {
    this.indicators.forEach((indicator, index) => {
      const fill = indicator.querySelector<HTMLElement>('.indicator_progress');
      if (!fill) return;
      if (index === this.currentIndex) {
        indicator.classList.add('active_indicator');
        if (startFill) this.startIndicatorFill(fill);
      } else {
        indicator.classList.remove('active_indicator');
        this.stopIndicatorFill(fill);
      }
    });
  }

  private startIndicatorFill(element: HTMLElement) {
    if (!element) return;
    element.style.transition = 'none';
    element.style.width = '0%';
    setTimeout(() => {
      element.style.transition = `width ${this.scrollTime}ms linear`;
      element.style.width = '100%';
      element.dataset.paused = 'false';
    }, 10);
  }

  private pauseIndicatorFill() {
    const activeFill = this.indicators[this.currentIndex]?.querySelector<HTMLElement>('.indicator_progress');
    if (!activeFill) return;
    const computedWidth = getComputedStyle(activeFill).width;
    activeFill.style.transition = 'none';
    activeFill.style.width = computedWidth;
    activeFill.dataset.paused = 'true';
  }

  private resumeIndicatorFill() {
    const activeFill = this.indicators[this.currentIndex]?.querySelector<HTMLElement>('.indicator_progress');
    if (!activeFill || !activeFill.parentElement || activeFill.dataset.paused !== 'true') return;

    const computedWidth = parseFloat(getComputedStyle(activeFill).width);
    const totalWidth = activeFill.parentElement.offsetWidth;
    const progress = computedWidth / totalWidth;

    const remainingTime = (1 - progress) * this.scrollTime;

    activeFill.style.transition = `width ${remainingTime}ms linear`;
    activeFill.style.width = '100%';
    activeFill.dataset.paused = 'false';
  }

  private restartAutoScrollAfterPause() {
    this.clearAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      this.goToSlide(this.currentIndex + 1);
    }, this.scrollTime);
  }

  private stopIndicatorFill(element: HTMLElement) {
    if (!element) return;
    element.style.transition = 'none';
    element.style.width = '0%';
    element.dataset.paused = 'false';
  }

  private startAutoScroll() {
    this.clearAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      this.goToSlide(this.currentIndex + 1);
    }, this.scrollTime);
    this.updateIndicator(true);
  }

  private manualGoToSlide(index: number) {
    this.goToSlide(index);
    this.clearAutoScroll();
    this.startAutoScroll();
  }

  private goToSlide(index: number) {
    this.currentIndex = (index + this.carouselLength) % this.carouselLength;
    this.favoriteContainer.style.transform = `translateX(calc(-${this.currentIndex * 100}% - ${this.currentIndex * 20}px))`;
    this.updateIndicator(true);
  }

  private clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  public destroy() {
    this.clearAutoScroll();
    this.root.innerHTML = '';
  }
}
