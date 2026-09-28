import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CONTENT, Lang, SiteContent } from './content';

const STORAGE_KEY = 'portfolio.lang';
const DEFAULT_LANG: Lang = 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _lang = signal<Lang>(this.loadInitial());
  readonly lang = this._lang.asReadonly();
  readonly content = computed<SiteContent>(() => CONTENT[this._lang()]);

  constructor() {
    effect(() => {
      const lang = this._lang();
      if (isPlatformBrowser(this.platformId)) {
        try {
          window.localStorage.setItem(STORAGE_KEY, lang);
        } catch {}
      }
      const html = this.document.documentElement;
      if (html) html.setAttribute('lang', lang);
    });
  }

  /**
   * Updates the language signal and persists the choice. Reloading the page
   * afterwards is intentionally the caller's job so it can play a transition
   * (e.g. a circular reveal from the click point) before the reload.
   */
  set(lang: Lang): void {
    if (lang !== 'en' && lang !== 'es') return;
    if (lang === this._lang()) return;
    this._lang.set(lang);
  }

  toggle(): void {
    this.set(this._lang() === 'en' ? 'es' : 'en');
  }

  private loadInitial(): Lang {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_LANG;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'es') return stored;
    } catch {}
    return DEFAULT_LANG;
  }
}
