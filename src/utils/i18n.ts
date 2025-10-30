import en from '../locales/en.json';
import ru from '../locales/ru.json';
import { TLocale } from '../types/types';

const locales = { en, ru };

class I18n {
  private locale: TLocale = 'en';

  constructor() {
    this.init();
  }

  private init() {
    const saved = localStorage.getItem('lang') as TLocale;
    const browserLang = navigator.language.split('-')[0] as TLocale;

    this.locale = saved || (browserLang === 'en' ? 'en' : 'ru');
  }

  public t(path: string): string {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = locales[this.locale];
    for (const key of keys) {
      result = result?.[key];
    }
    return result || path;
  }

  setLocale(lang: TLocale) {
    this.locale = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    this.updatePage();
  }

  private updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = this.t(key);
    });
  }
}

export const i18n = new I18n();
