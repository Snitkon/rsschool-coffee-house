import en from '../locales/en.json';
import ru from '../locales/ru.json';
import { Locales, TLocale } from '../types/types';

const locales = { en, ru };

class I18n {
  private locale: TLocale = Locales.en;

  constructor() {
    this.init();
  }

  private init() {
    const saved = localStorage.getItem('lang') as TLocale | null;
    this.locale = saved || Locales.en;
    this.updatePage();
  }

  public t(path: string): string {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = locales[this.locale];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  }

  public setLocale(lang: TLocale) {
    this.locale = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    this.updatePage();
  }

  public updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;

      const translation = this.t(key);

      if (el.children[0] instanceof SVGElement) {
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.remove();
        });

        el.insertAdjacentHTML('beforeend', translation);
      } else {
        el.innerHTML = translation;
      }
    });
  }

  public get currentLocale() {
    return this.locale;
  }
}

export const i18n = new I18n();
export const updateTranslations = i18n.updatePage.bind(i18n);
