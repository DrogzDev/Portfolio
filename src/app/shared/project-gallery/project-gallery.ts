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
import { gsap } from 'gsap';
import { ProjectGalleryImage } from '../../core/models/project.model';

const AUTOPLAY_DELAY = 4500;

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

  readonly activeIndex = signal(0);
  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  private autoplayTimer: number | undefined;

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

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    document.documentElement.classList.add('lightbox-open');
    requestAnimationFrame(() => this.playLightboxEnterAnimation());
  }

  closeLightbox(): void {
    if (!this.lightboxOpen()) return;
    this.playLightboxExitAnimation(() => {
      this.lightboxOpen.set(false);
      document.documentElement.classList.remove('lightbox-open');
    });
  }

  lightboxNext(): void {
    this.shiftLightbox(1);
  }

  lightboxPrevious(): void {
    this.shiftLightbox(-1);
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

  private shift(direction: 1 | -1): void {
    const total = this.images().length;
    if (total <= 0) return;
    this.activeIndex.update(current => (current + direction + total) % total);
  }

  private shiftLightbox(direction: 1 | -1): void {
    const total = this.images().length;
    if (total < 2) return;
    this.lightboxIndex.update(current => (current + direction + total) % total);
  }

  private startAutoplay(): void {
    this.clearAutoplay();
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

  private playLightboxEnterAnimation(): void {
    const overlay = this.host.nativeElement.querySelector<HTMLElement>('.lightbox-overlay');
    const panel = this.host.nativeElement.querySelector<HTMLElement>('.lightbox-panel');
    if (!overlay || !panel) return;

    panel.focus();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(panel, { autoAlpha: 0, scale: 0.92, y: 26 }, {
      autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out'
    });
  }

  private playLightboxExitAnimation(onComplete: () => void): void {
    const overlay = this.host.nativeElement.querySelector<HTMLElement>('.lightbox-overlay');
    const panel = this.host.nativeElement.querySelector<HTMLElement>('.lightbox-panel');

    if (!overlay || !panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    gsap.to(panel, { autoAlpha: 0, scale: 0.94, y: 18, duration: 0.22, ease: 'power2.in' });
    gsap.to(overlay, { autoAlpha: 0, duration: 0.26, ease: 'power2.in', onComplete });
  }
}
