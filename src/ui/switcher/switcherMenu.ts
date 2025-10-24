import { IAdditives, IMenu, ISize } from '../../types/types';

type SwitchersOptions = {
  multiply?: boolean;
  default?: string;
  onChange?: (value: Set<string> | string) => void;
};

type IUnite = ISize | IAdditives | IMenu;

export class Switchers<K extends string, V extends IUnite> {
  config: Record<K, V>;
  switchers: HTMLElement | null;
  buttons: { [key: string]: HTMLElement };
  multiply: boolean;
  activeKey: string;
  activeKeys: Set<string> | null;
  onChange: (value: Set<string> | string) => void;

  constructor(config: Record<K, V>, options: SwitchersOptions = {}) {
    this.config = config;
    this.switchers = null;
    this.buttons = {};
    this.multiply = options.multiply ?? false;
    this.activeKey = options.default ?? Object.keys(config)[0];
    this.activeKeys = options.multiply ? new Set() : null;
    this.onChange = options.onChange ?? (() => {});
  }

  createSwitchers() {
    const switchers = document.createElement('div');
    switchers.classList.add('switchers');

    Object.keys(this.config).forEach(key => {
      const value = this.config[key as K];
      const button = document.createElement('button');
      button.classList.add(key, 'switch_button');
      let icon;
      if ('icon' in value && typeof value.icon === 'string') {
        icon = document.createElement('img');
        icon.setAttribute('alt', `${key}_icon`);
        icon.setAttribute('src', value.icon);
        icon.classList.add('switch_icon');
      } else {
        icon = document.createElement('div');
        icon.classList.add('switch_icon');
        icon.textContent = key.toUpperCase();
      }
      if ('text' in value) {
        button.textContent = value.text as string;
      }
      if ('name' in value) {
        button.textContent = value.name as string;
      }
      if ('size' in value) {
        button.textContent = value.size as string;
      }
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

  setActive(key: string) {
    if (this.multiply && this.activeKeys !== null) {
      const btn = this.buttons[key];
      const isActive = btn.classList.toggle('switch_active');

      if (isActive) {
        this.activeKeys.add(key);
      } else {
        this.activeKeys.delete(key);
      }

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
