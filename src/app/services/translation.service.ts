import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal<Lang>('en');

  /** Observable-like signal for current language */
  lang = this.currentLang.asReadonly();

  /** Is the current language RTL? */
  isRtl = computed(() => this.currentLang() === 'ar');

  constructor() {
    // Load saved language preference
    const saved = localStorage.getItem('dar-lang') as Lang;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang.set(saved);
    }
    this.applyDirection();
  }

  get current(): Lang {
    return this.currentLang();
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem('dar-lang', lang);
    this.applyDirection();
  }

  toggle() {
    this.setLang(this.currentLang() === 'en' ? 'ar' : 'en');
  }

  /** Get a translated value from a translation object */
  t(translations: Record<string, string>): string {
    return translations[this.currentLang()] || translations['en'] || '';
  }

  private applyDirection() {
    const html = document.documentElement;
    if (this.currentLang() === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      document.body.style.fontFamily = "'Cairo', 'Tajawal', sans-serif";
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }
}
