import { TLocale } from '../../types/types';
import { i18n } from '../../utils/i18n';

export function lang() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as TLocale;
      i18n.setLocale(lang);
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelector(`[data-lang="${i18n['locale']}"]`)?.classList.add('active');
}
