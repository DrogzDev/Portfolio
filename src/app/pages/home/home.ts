import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../../data/projects.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Dependencias
  private readonly title = inject(Title);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  // Constantes de animación
  private readonly HERO_SWAP_DURATION = 0.22;
  private readonly HERO_RESIZE_DURATION = 0.72;
  private readonly GALLERY_DELAY = 4500;
  private readonly galleryTimers = new Map<string, number>();
  private heroVisualAnimating = false;
  private mediaContext: ReturnType<typeof gsap.matchMedia> | null = null;

  // Estados
  readonly menuOpen = signal(false);
  readonly portraitVisible = signal(false);
  readonly galleryIndexes = signal<Record<string, number>>({});

  // Datos
  readonly projects = PROJECTS;
  readonly currentYear = new Date().getFullYear();
  readonly email = 'migueluna0723@gmail.com';
  readonly cvUrl = '/cv/miguel-luna-cv.pdf';
  readonly githubUrl = 'https://github.com/DrogzDev';
  readonly marqueeSkills = ['Angular', 'TypeScript', 'Python', 'Django', 'REST APIs', 'PostgreSQL', 'Redis', 'Celery', 'Web Push', 'GSAP'] as const;
  readonly capabilities = [
    { number: '01', title: 'Frontend', description: 'Interfaces responsive y accesibles construidas con Angular, TypeScript y CSS moderno.', technologies: ['Angular', 'TypeScript', 'HTML', 'CSS'] },
    { number: '02', title: 'Backend', description: 'APIs, autenticación, lógica de negocio y procesamiento de datos con Python y Django.', technologies: ['Python', 'Django', 'DRF', 'PostgreSQL'] },
    { number: '03', title: 'DevOps', description: 'Tareas programadas, caché, procesos en segundo plano, contenedores y despliegue.', technologies: ['Redis', 'Celery', 'Podman', 'Git'] }
  ] as const;
  readonly workflow = [
    { number: '01', title: 'Entender', description: 'Defino el problema, los usuarios y la información que realmente necesita el producto.' },
    { number: '02', title: 'Diseñar', description: 'Organizo la experiencia, los componentes y la arquitectura antes de desarrollar.' },
    { number: '03', title: 'Construir', description: 'Desarrollo la interfaz, la API, la base de datos y las integraciones necesarias.' },
    { number: '04', title: 'Mejorar', description: 'Pruebo el producto, corrijo problemas y optimizo rendimiento y usabilidad.' }
  ] as const;

  constructor() {
    this.title.setTitle('Miguel Luna | Full Stack Developer');
    afterNextRender(() => {
      this.initializeAnimations();
      this.initializeGalleryAutoplay();
    });
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  // ---- Menú ----
  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
  }
  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeMenu();
  }

  // ---- Easter Egg del Hero ----
  toggleHeroVisual(): void {
    if (this.heroVisualAnimating) return;

    const nextState = !this.portraitVisible();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.portraitVisible.set(nextState);
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const visual = this.host.nativeElement.querySelector<HTMLElement>('.hero-visual');
    const currentView = visual?.querySelector<HTMLElement>('.hero-visual-content');
    if (!visual || !currentView) {
      this.portraitVisible.set(nextState);
      return;
    }

    this.heroVisualAnimating = true;
    gsap.killTweensOf(visual, 'height');
    gsap.killTweensOf(currentView);
    gsap.set(visual, { height: visual.offsetHeight });
    gsap.to(currentView, {
      y: nextState ? -22 : 22,
      autoAlpha: 0,
      duration: this.HERO_SWAP_DURATION,
      ease: 'power2.in',
      onComplete: () => this.renderHeroVisual(visual, nextState)
    });
  }

  private renderHeroVisual(visual: HTMLElement, showPortrait: boolean): void {
    this.portraitVisible.set(showPortrait);
    requestAnimationFrame(() => {
      const nextView = visual.querySelector<HTMLElement>('.hero-visual-content');
      if (!nextView) {
        this.finishHeroVisualAnimation(visual);
        return;
      }

      const targetHeight = this.getHeroVisualHeight(visual, nextView);
      gsap.set(nextView, {
        y: showPortrait ? 28 : -22,
        autoAlpha: 0,
        clipPath: showPortrait ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)'
      });

      gsap.timeline({
        onComplete: () => this.finishHeroVisualAnimation(visual, nextView)
      })
        .to(visual, {
          height: targetHeight,
          duration: this.HERO_RESIZE_DURATION,
          ease: 'power3.inOut'
        }, 0)
        .to(nextView, {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0 0)',
          duration: this.HERO_RESIZE_DURATION * 0.82,
          ease: 'power3.out'
        }, 0.12);

      if (showPortrait) {
        this.animatePortraitReveal(nextView);
      } else {
        this.animateCodeReveal(nextView);
      }
    });
  }

  private getHeroVisualHeight(visual: HTMLElement, view: HTMLElement): number {
    const header = visual.querySelector<HTMLElement>('.visual-header');
    const status = visual.querySelector<HTMLElement>('.visual-status');
    return (header?.offsetHeight ?? 0) + view.offsetHeight + (status?.offsetHeight ?? 0);
  }

  private finishHeroVisualAnimation(visual: HTMLElement, view?: HTMLElement): void {
    gsap.set(visual, { clearProps: 'height' });
    if (view) gsap.set(view, { clearProps: 'transform,opacity,visibility,clipPath' });
    this.heroVisualAnimating = false;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  handleHeroVisualKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleHeroVisual();
    }
  }

  private animatePortraitReveal(view: HTMLElement): void {
    const image = view.querySelector<HTMLImageElement>('.hero-portrait-image');
    const badge = view.querySelector<HTMLElement>('.hero-render-badge');
    const caption = view.querySelector<HTMLElement>('.hero-portrait-caption');

    if (image) {
      gsap.fromTo(image, { scale: 1.13, clipPath: 'inset(0 0 100% 0)' }, {
        scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'power4.out'
      });
    }
    if (badge) {
      gsap.from(badge, { y: -14, autoAlpha: 0, duration: 0.45, delay: 0.45, ease: 'power3.out' });
    }
    if (caption) {
      gsap.from(caption, { y: 20, autoAlpha: 0, duration: 0.55, delay: 0.55, ease: 'power3.out' });
    }
  }

  private animateCodeReveal(view: HTMLElement): void {
    const lines = view.querySelectorAll('.code-line');
    gsap.from(lines, { x: 18, autoAlpha: 0, stagger: 0.055, duration: 0.35, ease: 'power2.out' });
  }

  // ---- Galerías ----
  getGalleryIndex(slug: string): number {
    return this.galleryIndexes()[slug] ?? 0;
  }

  nextGallery(slug: string, total: number, event?: Event): void {
    event?.stopPropagation();
    this.changeGalleryImage(slug, total, 1);
    if (event) this.restartGalleryAutoplay(slug, total);
  }

  previousGallery(slug: string, total: number, event?: Event): void {
    event?.stopPropagation();
    this.changeGalleryImage(slug, total, -1);
    if (event) this.restartGalleryAutoplay(slug, total);
  }

  selectGalleryImage(slug: string, index: number, total: number, event?: Event): void {
    event?.stopPropagation();
    this.galleryIndexes.update(v => ({ ...v, [slug]: index }));
    this.restartGalleryAutoplay(slug, total);
  }

  pauseGallery(slug: string): void {
    this.clearGalleryTimer(slug);
  }

  resumeGallery(slug: string, total: number): void {
    this.startGalleryTimer(slug, total);
  }

  handleGalleryKeydown(event: KeyboardEvent, slug: string, total: number): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextGallery(slug, total);
      this.restartGalleryAutoplay(slug, total);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousGallery(slug, total);
      this.restartGalleryAutoplay(slug, total);
    }
  }

  private initializeGalleryAutoplay(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.projects.forEach(project => {
      if (!project.gallery?.length) return;
      this.galleryIndexes.update(v => ({ ...v, [project.slug]: v[project.slug] ?? 0 }));
      if (!reduceMotion && project.gallery.length > 1) {
        this.startGalleryTimer(project.slug, project.gallery.length);
      }
    });
  }

  private changeGalleryImage(slug: string, total: number, direction: 1 | -1): void {
    if (total <= 0) return;
    const current = this.getGalleryIndex(slug);
    const next = (current + direction + total) % total;
    this.galleryIndexes.update(v => ({ ...v, [slug]: next }));
  }

  private startGalleryTimer(slug: string, total: number): void {
    this.clearGalleryTimer(slug);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || total < 2) return;
    const timerId = window.setInterval(() => this.changeGalleryImage(slug, total, 1), this.GALLERY_DELAY);
    this.galleryTimers.set(slug, timerId);
  }

  private restartGalleryAutoplay(slug: string, total: number): void {
    this.startGalleryTimer(slug, total);
  }

  private clearGalleryTimer(slug: string): void {
    const timerId = this.galleryTimers.get(slug);
    if (timerId !== undefined) {
      window.clearInterval(timerId);
      this.galleryTimers.delete(slug);
    }
  }

  private clearAllGalleryTimers(): void {
    this.galleryTimers.forEach(timer => window.clearInterval(timer));
    this.galleryTimers.clear();
  }

  // ---- Animaciones GSAP ----
  private initializeAnimations(): void {
    const root = this.host.nativeElement;
    ScrollTrigger.config({ ignoreMobileResize: true });
    this.mediaContext = gsap.matchMedia();
    this.mediaContext.add(
      { desktop: '(min-width: 801px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
      (media) => {
        if (media.conditions?.['reduceMotion']) return;

        const desktop = !!media.conditions?.['desktop'];
        const ctx = gsap.context(() => {
          // Above-the-fold: corre de inmediato para que la entrada del hero
          // no compita por el hilo principal con el resto de la página.
          this.animateScrollProgress();
          this.animateHero(desktop);
          this.animateMarquee();

          // Below-the-fold: se difiere para no robarle frames a la animación
          // del hero en dispositivos lentos (móviles de gama media/baja).
          this.scheduleIdle(() => {
            this.animateSections();
            this.animateProjects(desktop);
            this.animateCapabilities();
            this.animateWorkflow();
            this.animateContact();
            if (desktop) this.animateDesktopParallax();
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });
        }, root);

        return () => ctx.revert();
      }
    );
  }

  private scheduleIdle(callback: () => void): void {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 120);
    }
  }

  private animateScrollProgress(): void {
    gsap.set('.scroll-progress', { scaleX: 0 });
    gsap.to('.scroll-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.15 }
    });
  }

  private animateHero(desktop: boolean): void {
    document.documentElement.classList.remove('gsap-hero-pending');

    const root = this.host.nativeElement;
    const header = root.querySelector<HTMLElement>('.site-header');
    const copyElements = root.querySelectorAll<HTMLElement>(
      '.eyebrow, .hero h1, .hero-description, .hero-actions .button, .hero-meta > div'
    );
    const visual = root.querySelector<HTMLElement>('.hero-visual');
    const visualElements = root.querySelectorAll<HTMLElement>(
      '.visual-header, .hero-code-view, .visual-status'
    );

    if (!header || !visual) return;

    gsap.set(header, { y: -40, autoAlpha: 0 });
    gsap.set(copyElements, { y: 34, autoAlpha: 0 });
    // El filtro blur es carísimo de componer en CPUs móviles y es la causa
    // principal de que la entrada del hero se sienta como un salto en vez de
    // una animación en gama baja/media: en mobile solo se anima posición/opacidad.
    gsap.set(visual, desktop ? { autoAlpha: 0, filter: 'blur(12px)' } : { autoAlpha: 0, y: 16 });
    gsap.set(visualElements, { y: 18, autoAlpha: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(header, { y: 0, autoAlpha: 1, duration: 0.7 })
      .to(copyElements, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.09,
        duration: 0.72
      }, 0.18)
      .to(visual, desktop
        ? { autoAlpha: 1, filter: 'blur(0px)', duration: 1.05, ease: 'power2.out' }
        : { autoAlpha: 1, y: 0, duration: 0.62, ease: 'power2.out' }
      , 0.28)
      .to(visualElements, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.62
      }, 0.48)
      .set(visual, { clearProps: desktop ? 'filter' : 'transform' });
  }

  private animateMarquee(): void {
    gsap.to('.tech-track', { xPercent: -50, duration: 26, repeat: -1, ease: 'none' });
  }

  private animateSections(): void {
    const sections = gsap.utils.toArray<HTMLElement>('.intro, .section-heading, .about-heading, .about-content');
    sections.forEach(section => {
      gsap.from(Array.from(section.children), {
        y: 48, autoAlpha: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 82%', once: true }
      });
    });
  }

  private animateProjects(desktop: boolean): void {
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    cards.forEach(card => {
      const media = card.querySelector<HTMLElement>('.project-media');
      const content = card.querySelector<HTMLElement>('.project-content');
      const singleImage = card.querySelector<HTMLImageElement>('.project-single-image');

      if (media) {
        gsap.from(media, {
          clipPath: 'inset(0 0 100% 0)', y: 45, duration: 1.15, ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 78%', once: true }
        });
      }
      if (content) {
        gsap.from(Array.from(content.children), {
          y: 34, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 72%', once: true }
        });
      }
      if (singleImage && desktop) {
        gsap.fromTo(singleImage, { scale: 1.12, yPercent: -4 }, {
          scale: 1, yPercent: 5, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
    });
  }

  private animateCapabilities(): void {
    gsap.from('.capability-card', {
      y: 65, autoAlpha: 0, stagger: 0.15, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.capabilities-grid', start: 'top 78%', once: true }
    });
  }

  private animateWorkflow(): void {
    const items = gsap.utils.toArray<HTMLElement>('.workflow-item');
    items.forEach((item, i) => {
      gsap.from(item, {
        x: i % 2 === 0 ? -35 : 35, autoAlpha: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      });
    });
  }

  private animateContact(): void {
    gsap.from(['.contact .section-label', '.contact h2', '.contact-container > p', '.contact-link', '.contact-footer'], {
      y: 55, autoAlpha: 0, stagger: 0.11, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact', start: 'top 72%', once: true }
    });
  }

  private animateDesktopParallax(): void {
    gsap.to('.hero-copy', {
      yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
    });
    gsap.to('.hero-visual', {
      yPercent: 13, rotate: -1.5, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 }
    });
  }

  private cleanup(): void {
    this.mediaContext?.revert();
    this.mediaContext = null;
    this.clearAllGalleryTimers();
  }
}