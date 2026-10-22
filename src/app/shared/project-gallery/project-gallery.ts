import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core';
import { computed } from '@angular/core';
import { gsap } from 'gsap';
import { ProjectGalleryImage } from '../../core/models/project.model';
import { LanguageService } from '../../core/i18n/language.service';

const AUTOPLAY_DELAY = 4500;

/*
 * Umbrales del gesto táctil del lightbox.
 * - AXIS_LOCK: cuánto hay que mover el dedo antes de decidir si el gesto es
 *   horizontal (pasar foto) o vertical (cerrar).
 * - SWIPE_X / SWIPE_Y: distancia mínima para confirmar "pasar" o "cerrar".
 */
const AXIS_LOCK = 12;
const SWIPE_X = 60;
const SWIPE_Y = 110;

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  axis: 'x' | 'y' | null;
}

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [],
  templateUrl: './project-gallery.html',
  styleUrl: './project-gallery.css'
})
export class ProjectGalleryComponent {
  readonly images = input.required<ProjectGalleryImage[]>();
  readonly title = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly i18n = inject(LanguageService);
  readonly content = computed(() => this.i18n.content());

  readonly activeIndex = signal(0);
  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  /* True mientras el dedo arrastra la imagen: desactiva la transición CSS. */
  readonly dragging = signal(false);

  private autoplayTimer: number | undefined;

  /* Rect de la miniatura pulsada, para la animación de apertura estilo iOS. */
  private openerRect: DOMRect | null = null;
  private gesture: Gesture | null = null;
  private switching = false;
  /* Evita que el "click" posterior a un arrastre cierre el visor sin querer. */
  private suppressClick = false;

  constructor() {
    afterNextRender(() => this.startAutoplay());
    this.destroyRef.onDestroy(() => {
      this.clearAutoplay();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('lightbox-open');
      }
    });
  }

  next(event?: Event): void {
    event?.stopPropagation();
    this.shift(1);
    this.restartAutoplay();
  }

  previous(event?: Event): void {
    event?.stopPropagation();
    this.shift(-1);
    this.restartAutoplay();
  }

  select(index: number, event?: Event): void {
    event?.stopPropagation();
    this.activeIndex.set(index);
    this.restartAutoplay();
  }

  pause(): void {
    this.clearAutoplay();
  }

  resume(): void {
    this.startAutoplay();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }
  }

  openLightbox(index: number, event?: Event): void {
    this.clearAutoplay();
    const trigger = event?.currentTarget as HTMLElement | undefined;
    const img = trigger?.querySelector('img');
    this.openerRect = img?.getBoundingClientRect() ?? null;

    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('lightbox-open');
    }
    requestAnimationFrame(() => this.playLightboxEnterAnimation());
  }

  closeLightbox(): void {
    if (!this.lightboxOpen()) return;
    this.playLightboxExitAnimation(() => {
      this.lightboxOpen.set(false);
      this.openerRect = null;
      document.documentElement.classList.remove('lightbox-open');
    });
  }

  lightboxNext(): void {
    this.animateSwitch(1);
  }

  lightboxPrevious(): void {
    this.animateSwitch(-1);
  }

  onViewportClick(event: MouseEvent): void {
    if (this.suppressClick) return;
    const target = event.target as HTMLElement;
    if (target.closest('.lightbox-nav')) return;
    this.closeLightbox();
  }

  goToLightbox(index: number): void {
    if (index === this.lightboxIndex()) return;
    this.lightboxIndex.set(index);
    this.activeIndex.set(index);
    const figure = this.figure();
    if (figure) gsap.set(figure, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
    this.setBackdropOpacity(1);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.lightboxOpen()) this.closeLightbox();
  }

  @HostListener('document:keydown.arrowright')
  handleLightboxArrowRight(): void {
    if (this.lightboxOpen()) this.lightboxNext();
  }

  @HostListener('document:keydown.arrowleft')
  handleLightboxArrowLeft(): void {
    if (this.lightboxOpen()) this.lightboxPrevious();
  }

  /* ----------------------------- Gestos táctiles ---------------------------- */

  onPointerDown(event: PointerEvent): void {
    if (!event.isPrimary || this.switching) return;
    const figure = this.figure();
    if (!figure) return;
    gsap.killTweensOf(figure);
    try {
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {
      /* pointerId no capturable (p. ej. eventos sintéticos): se ignora. */
    }
    this.gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, axis: null };
  }

  onPointerMove(event: PointerEvent): void {
    const g = this.gesture;
    if (!g || event.pointerId !== g.pointerId) return;

    const dx = event.clientX - g.startX;
    const dy = event.clientY - g.startY;

    if (!g.axis) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      this.dragging.set(true);
    }

    const figure = this.figure();
    if (!figure) return;

    if (g.axis === 'y') {
      // Solo se permite arrastrar hacia abajo para cerrar (como en iOS).
      const offset = Math.max(dy, dy * 0.3);
      const progress = Math.min(Math.abs(offset) / 320, 1);
      gsap.set(figure, { x: 0, y: offset, scale: 1 - progress * 0.12 });
      this.setBackdropOpacity(1 - progress * 0.6);
    } else {
      // Resistencia en los bordes cuando no hay a dónde avanzar.
      const atEdge = this.images().length < 2;
      gsap.set(figure, { x: atEdge ? dx * 0.25 : dx, y: 0, scale: 1 });
    }
  }

  onPointerUp(event: PointerEvent): void {
    const g = this.gesture;
    if (!g || event.pointerId !== g.pointerId) return;
    this.gesture = null;
    this.dragging.set(false);

    if (g.axis) {
      // Hubo arrastre: ignora el click que el navegador dispara justo después.
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false));
    }

    const figure = this.figure();
    if (!figure) return;

    const dx = event.clientX - g.startX;
    const dy = event.clientY - g.startY;

    if (g.axis === 'y' && dy > SWIPE_Y) {
      this.dismissDown(dy);
      return;
    }

    if (g.axis === 'x' && Math.abs(dx) > SWIPE_X && this.images().length > 1) {
      this.animateSwitch(dx < 0 ? 1 : -1, true);
      return;
    }

    // Vuelve a su sitio.
    this.setBackdropOpacity(1);
    if (this.reduceMotion()) {
      gsap.set(figure, { x: 0, y: 0, scale: 1 });
    } else {
      gsap.to(figure, { x: 0, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' });
    }
  }

  /* ----------------------------- Animaciones -------------------------------- */

  private shift(direction: 1 | -1): void {
    const total = this.images().length;
    if (total <= 0) return;
    this.activeIndex.update(current => (current + direction + total) % total);
  }

  private shiftLightbox(direction: 1 | -1): void {
    const total = this.images().length;
    if (total < 1) return;
    this.lightboxIndex.update(current => (current + direction + total) % total);
  }

  private animateSwitch(direction: 1 | -1, fromDrag = false): void {
    if (this.images().length < 2) {
      // Nada a dónde ir: rebote.
      const figure = this.figure();
      if (figure) gsap.to(figure, { x: 0, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      this.setBackdropOpacity(1);
      return;
    }

    const figure = this.figure();
    if (!figure || this.reduceMotion()) {
      this.shiftLightbox(direction);
      if (figure) gsap.set(figure, { x: 0, y: 0, scale: 1 });
      this.setBackdropOpacity(1);
      return;
    }

    this.switching = true;
    const width = this.host.nativeElement.ownerDocument.defaultView?.innerWidth ?? 1000;
    const out = -direction * width * 0.32;

    gsap.to(figure, {
      x: out,
      autoAlpha: 0,
      duration: fromDrag ? 0.16 : 0.2,
      ease: 'power2.in',
      onComplete: () => {
        this.shiftLightbox(direction);
        gsap.fromTo(
          figure,
          { x: direction * width * 0.32, y: 0, scale: 1, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.32,
            ease: 'power3.out',
            onComplete: () => {
              this.switching = false;
            }
          }
        );
      }
    });
  }

  private dismissDown(dy: number): void {
    const figure = this.figure();
    const view = this.host.nativeElement.ownerDocument.defaultView;
    const finish = () => {
      this.lightboxOpen.set(false);
      this.openerRect = null;
      document.documentElement.classList.remove('lightbox-open');
    };

    if (!figure || this.reduceMotion()) {
      finish();
      return;
    }

    const target = (view?.innerHeight ?? 900) + 100;
    gsap.to(figure, {
      y: Math.max(target, dy + 200),
      scale: 0.8,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
    this.animateBackdrop(0, 0.3, finish);
  }

  private playLightboxEnterAnimation(): void {
    const backdrop = this.backdrop();
    const figure = this.figure();
    const panel = this.host.nativeElement.querySelector<HTMLElement>('.lightbox');
    if (!figure || !backdrop) return;

    panel?.focus();

    if (this.reduceMotion()) {
      gsap.set(figure, { clearProps: 'all' });
      gsap.set(backdrop, { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });

    const last = figure.getBoundingClientRect();
    const first = this.openerRect;

    if (first && last.width && last.height) {
      // FLIP: la imagen "crece" desde la miniatura pulsada, como el peek de iOS.
      const dx = first.left + first.width / 2 - (last.left + last.width / 2);
      const dy = first.top + first.height / 2 - (last.top + last.height / 2);
      const scale = Math.min(first.width / last.width, first.height / last.height) || 0.35;
      gsap.fromTo(
        figure,
        { x: dx, y: dy, scale, autoAlpha: 0.5, transformOrigin: 'center center' },
        { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.fromTo(
        figure,
        { autoAlpha: 0, scale: 0.9, y: 24 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  private playLightboxExitAnimation(onComplete: () => void): void {
    const backdrop = this.backdrop();
    const figure = this.figure();

    if (!figure || !backdrop || this.reduceMotion()) {
      onComplete();
      return;
    }

    gsap.to(figure, { autoAlpha: 0, scale: 0.9, duration: 0.24, ease: 'power2.in' });
    this.animateBackdrop(0, 0.28, onComplete);
  }

  /* ------------------------------- Helpers ---------------------------------- */

  private figure(): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>('.lightbox-figure');
  }

  private backdrop(): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>('.lightbox-backdrop');
  }

  private setBackdropOpacity(value: number): void {
    const backdrop = this.backdrop();
    if (backdrop) gsap.set(backdrop, { autoAlpha: value });
  }

  private animateBackdrop(to: number, duration: number, onComplete?: () => void): void {
    const backdrop = this.backdrop();
    if (!backdrop) {
      onComplete?.();
      return;
    }
    gsap.to(backdrop, { autoAlpha: to, duration, ease: 'power2.in', onComplete });
  }

  private reduceMotion(): boolean {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    return !!view?.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private startAutoplay(): void {
    this.clearAutoplay();
    if (this.lightboxOpen()) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || this.images().length < 2) return;
    this.autoplayTimer = window.setInterval(() => this.shift(1), AUTOPLAY_DELAY);
  }

  private restartAutoplay(): void {
    this.startAutoplay();
  }

  private clearAutoplay(): void {
    if (this.autoplayTimer !== undefined) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }
}
