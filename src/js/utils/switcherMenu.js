import { activeCategory } from './check';

const switcherConfig = {
  coffee: { text: 'Coffee', icon: '/images/coffee.png', active: true },
  tea: { text: 'Tea', icon: '/images/tea.png', active: false },
  dessert: { text: 'Dessert', icon: '/images/dessert.png', active: false }
};

export class Switchers {
  constructor(cardsWrapper) {
    this.config = switcherConfig;
    this.cardsWrapper = cardsWrapper;
    this.activeCategory = activeCategory(this.config);
  }

  switchCard() {
    const cards = Array.from(this.cardsWrapper.children);
    cards.forEach(card => {
      const id = card.getAttribute('id');
      if (id && id.startsWith(this.activeCategory)) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  createSwitcher() {
    const switchers = document.createElement('div');
    switchers.classList.add('switchers');

    Object.keys(this.config).forEach(category => {
      const button = document.createElement('button');
      button.classList.add(category, 'switch_button');

      const icon = document.createElement('img');
      icon.setAttribute('alt', `${category}_icon`);
      icon.setAttribute('src', this.config[category].icon);
      icon.classList.add('switch_icon');

      button.textContent = this.config[category].text;
      button.prepend(icon);

      if (this.config[category].active) {
        button.classList.add('switch_active');
      }

      button.addEventListener('click', () => {
        switchers.querySelectorAll('.switch_button').forEach(btn => btn.classList.remove('switch_active'));
        button.classList.add('switch_active');
        sessionStorage.setItem('category', category);
        this.activeCategory = activeCategory(this.config);
        activeCategory(this.config);
        this.switchCard();
      });

      switchers.append(button);
    });

    this.switchCard();

    return switchers;
  }
}
