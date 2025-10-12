export class Switchers {
  config;
  options;
  activeKey;
  onChange;

  constructor(config, options = {}) {
    this.config = config;
    this.switchers = null;
    this.buttons = {};
    this.multiply = options.multiply || false;
    this.activeKey = options.default || Object.keys(config)[0];
    this.activeKeys = options.multiply ? new Set() : null;
    this.onChange = options.onChange || (() => {});
  }

  createSwitchers() {
    const switchers = document.createElement('div');
    switchers.classList.add('switchers');

    Object.keys(this.config).forEach(key => {
      const button = document.createElement('button');
      button.classList.add(key, 'switch_button');
      let icon;
      if (Object.hasOwn(this.config[key], 'icon')) {
        icon = document.createElement('img');
        icon.setAttribute('alt', `${key}_icon`);
        icon.setAttribute('src', this.config[key].icon);
        icon.classList.add('switch_icon');
      } else {
        icon = document.createElement('div');
        icon.classList.add('switch_icon');
        icon.textContent = key.toUpperCase();
      }

      const firstKey = Object.keys(this.config[key])[0];
      const text = this.config[key][firstKey];
      button.textContent = text;
      button.prepend(icon);

      if (key === this.activeKey) {
        button.classList.add('switch_active');
      }

      button.addEventListener('click', () => this.setActive(key));
      this.buttons[key] = button;
      switchers.appendChild(button);
    });
    this.switchers = switchers;
    return switchers;
  }

  setActive(key) {
    if (this.multiply) {
      const btn = this.buttons[key];
      const isActive = btn.classList.toggle('switch_active');
      console.log('isActive:', isActive);

      isActive ? this.activeKeys.add(key) : this.activeKeys.delete(key);

      this.onChange(this.activeKeys);
    } else {
      if (key === this.activeKey) return;
      if (this.buttons[this.activeKey]) this.buttons[this.activeKey].classList.remove('switch_active');
      this.buttons[key].classList.add('switch_active');
      this.activeKey = key;
      this.onChange(key);
    }
  }

  getActive() {
    return this.activeKey;
  }
}
