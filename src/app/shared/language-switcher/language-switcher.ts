import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { LanguageService } from '../../core/i18n/language.service';
import { Lang } from '../../core/i18n/content';

interface Option {
  value: Lang;
  label: string;
  flagAlt: string;
  /** Inline SVG flag markup. */
  flag: SafeHtml;
}

const US_FLAG = `
<svg viewBox="0 0 60 40" width="20" height="14" aria-hidden="true" focusable="false">
  <rect width="60" height="40" fill="#B22234"/>
  <g fill="#FFFFFF">
    <rect y="3.08" width="60" height="3.08"/>
    <rect y="9.23" width="60" height="3.08"/>
    <rect y="15.38" width="60" height="3.08"/>
    <rect y="21.54" width="60" height="3.08"/>
    <rect y="27.69" width="60" height="3.08"/>
    <rect y="33.85" width="60" height="3.08"/>
  </g>
  <rect width="24" height="21.54" fill="#3C3B6E"/>
  <g fill="#FFFFFF" font-family="Arial, sans-serif" font-size="3.2" text-anchor="middle">
    <text x="3" y="4">★</text><text x="7" y="4">★</text><text x="11" y="4">★</text><text x="15" y="4">★</text><text x="19" y="4">★</text><text x="23" y="4">★</text>
    <text x="5" y="7">★</text><text x="9" y="7">★</text><text x="13" y="7">★</text><text x="17" y="7">★</text><text x="21" y="7">★</text>
    <text x="3" y="10">★</text><text x="7" y="10">★</text><text x="11" y="10">★</text><text x="15" y="10">★</text><text x="19" y="10">★</text><text x="23" y="10">★</text>
    <text x="5" y="13">★</text><text x="9" y="13">★</text><text x="13" y="13">★</text><text x="17" y="13">★</text><text x="21" y="13">★</text>
    <text x="3" y="16">★</text><text x="7" y="16">★</text><text x="11" y="16">★</text><text x="15" y="16">★</text><text x="19" y="16">★</text><text x="23" y="16">★</text>
    <text x="5" y="19">★</text><text x="9" y="19">★</text><text x="13" y="19">★</text><text x="17" y="19">★</text><text x="21" y="19">★</text>
  </g>
</svg>`;

const ES_FLAG = `
<svg viewBox="0 0 60 40" width="20" height="14" aria-hidden="true" focusable="false">
  <rect width="60" height="40" fill="#AA151B"/>
  <rect y="10" width="60" height="20" fill="#F1BF00"/>
</svg>`;

const FLAGS = { en: US_FLAG, es: ES_FLAG } as const;

const CONFIG = {
  swell: 0.2,
  barge: 6,
  shrink: 0.05,
  jelly: 1,
  bounce: 0.25,
  stagger: 0.022,
  stiffness: 580,
  mass: 0.9
};

const springDuration = (k: number, m: number, bounce: number): number => {
  const damping = 2 * Math.sqrt(k * m) * (1 - bounce);
  const zeta = damping / (2 * Math.sqrt(k * m));
  const omega = Math.sqrt(k / m);
  const target = 0.014;
  const t = -Math.log(target) / Math.max(zeta * omega, 0.0001);
  return Math.min(1.2, Math.max(0.3, t));
};

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcherComponent {
  readonly lang = inject(LanguageService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  readonly options: Option[] = [
    { value: 'en', label: 'EN', flagAlt: 'English', flag: this.sanitizer.bypassSecurityTrustHtml(FLAGS.en) },
    { value: 'es', label: 'ES', flagAlt: 'Español', flag: this.sanitizer.bypassSecurityTrustHtml(FLAGS.es) }
  ];

  @ViewChild('group', { static: true }) groupRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('chip') chipRefs!: QueryList<ElementRef<HTMLButtonElement>>;

  private widths: number[] = [];
  private reduceMotion = false;

  constructor() {
    afterNextRender(() => {
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.measure();
      this.apply(this.selectedIndex(), true);

      const observer = new ResizeObserver(() => {
        this.measure();
        this.apply(this.selectedIndex(), true);
      });
      observer.observe(this.groupRef.nativeElement);

      const off = document.fonts?.ready.then(() => {
        this.measure();
        this.apply(this.selectedIndex(), true);
      });

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        off?.catch(() => {});
      });
    });
  }

  trackByValue(_: number, opt: Option): string {
    return opt.value;
  }

  selectedIndex(): number {
    return this.options.findIndex(o => o.value === this.lang.lang());
  }

  isActive(index: number): boolean {
    return index === this.selectedIndex();
  }

  select(index: number, event?: MouseEvent | KeyboardEvent): void {
    const opt = this.options[index];
    if (!opt || opt.value === this.lang.lang()) return;

    this.apply(index, false);

    const origin = this.pointerOrigin(event, index);
    this.playCircleReveal(origin, () => {
      this.lang.set(opt.value);
      window.location.reload();
    });
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const total = this.options.length;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % total;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + total) % total;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = total - 1;
    else if (event.key === ' ' || event.key === 'Enter') next = index;
    if (next === null) return;
    event.preventDefault();
    this.select(next, event);
    this.chipRefs.get(next)?.nativeElement.focus();
  }

  private pointerOrigin(
    event: MouseEvent | KeyboardEvent | undefined,
    index: number
  ): { x: number; y: number } {
    if (event && 'clientX' in event && event.clientX && event.clientY) {
      return { x: event.clientX, y: event.clientY };
    }
    const el = this.chipRefs?.get(index)?.nativeElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  private playCircleReveal(origin: { x: number; y: number }, onDone: () => void): void {
    if (typeof document === 'undefined') {
      onDone();
      return;
    }
    if (this.reduceMotion) {
      onDone();
      return;
    }

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2000',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at center, #d7ff3f 0%, #b8e232 60%, #111111 100%)',
      willChange: 'clip-path',
      clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`
    } as CSSStyleDeclaration);
    document.body.appendChild(overlay);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(origin.x, vw - origin.x),
      Math.max(origin.y, vh - origin.y)
    ) + 24;

    const state = { radius: 0 };
    gsap.to(state, {
      radius: maxRadius,
      duration: 0.7,
      ease: 'power3.inOut',
      onUpdate: () => {
        overlay.style.clipPath = `circle(${state.radius}px at ${origin.x}px ${origin.y}px)`;
      },
      onComplete: () => onDone()
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.measure();
    this.apply(this.selectedIndex(), true);
  }

  private measure(): void {
    const group = this.groupRef?.nativeElement;
    if (!group) return;
    const chips = this.chipRefs?.toArray().map(c => c.nativeElement) ?? [];
    this.widths = chips.map(el => el?.offsetWidth ?? 0);
    const chipH = chips[0]?.offsetHeight ?? 0;
    const maxW = Math.max(0, ...this.widths);
    group.style.setProperty('--jr-pad-x', `${Math.ceil((maxW * CONFIG.swell * 1.3) / 2 + CONFIG.barge) + 2}px`);
    group.style.setProperty('--jr-pad-y', `${Math.ceil((chipH * CONFIG.swell) / 2) + 2}px`);
  }

  private apply(selected: number, instant: boolean): void {
    const chips = this.chipRefs?.toArray().map(c => c.nativeElement) ?? [];
    if (!chips.length) return;

    const push = ((this.widths[selected] ?? 0) * CONFIG.swell) / 2 + CONFIG.barge;

    chips.forEach((chip, i) => {
      const on = i === selected;
      const far = Math.abs(i - selected);
      const dir = Math.sign(i - selected);
      const x = dir * push;
      const s = on ? 1 + CONFIG.swell : 1 - CONFIG.shrink;

      if (instant || this.reduceMotion) {
        gsap.set(chip, { x, scaleX: s, scaleY: s });
        return;
      }

      const k = CONFIG.stiffness * (1 - 0.12 * Math.min(far, 3));
      const delay = (far * CONFIG.stagger);
      const dur = springDuration(k, CONFIG.mass, CONFIG.bounce);
      const j = CONFIG.jelly;
      const durX = springDuration(k * (1 + 0.24 * j), CONFIG.mass - 0.1 * j, Math.min(0.85, CONFIG.bounce + 0.3 * j));
      const durY = springDuration(k * (1 - 0.14 * j), CONFIG.mass + 0.05 * j, CONFIG.bounce);
      const ease = `elastic.out(1, ${0.3 + CONFIG.bounce})`;

      gsap.to(chip, { x, duration: dur, ease, delay, overwrite: 'auto' });
      gsap.to(chip, { scaleX: s, duration: durX, ease, delay, overwrite: false });
      gsap.to(chip, { scaleY: s, duration: durY, ease, delay: delay + 0.05 * j, overwrite: false });
    });
  }
}
