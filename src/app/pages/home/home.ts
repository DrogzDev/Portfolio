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
import { PortfolioProject, ProjectGalleryImage } from '../../core/models/project.model';

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
  readonly lightbox = signal<{ title: string; images: ProjectGalleryImage[]; index: number } | null>(null);

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
    if (this.lightbox()) {
      this.closeLightbox();
      return;
    }
    this.closeMenu();
  }

  @HostListener('document:keydown.arrowright')
  handleLightboxArrowRight(): void {
    if (this.lightbox()) this.lightboxNext();
  }

  @HostListener('document:keydown.arrowleft')
  handleLightboxArrowLeft(): void {
    if (this.lightbox()) this.lightboxPrevious();
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

    // Una sola timeline en vez de tweens sueltos con `delay`: mismo timing,
    // pero queda como una única unidad controlable/cancelable.
    const timeline = gsap.timeline();

    if (image) {
      timeline.fromTo(image, { scale: 1.13, clipPath: 'inset(0 0 100% 0)' }, {
        scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'power4.out'
      }, 0);
    }
    if (badge) {
      timeline.from(badge, { y: -14, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, 0.45);
    }
    if (caption) {
      timeline.from(caption, { y: 20, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, 0.55);
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

  // ---- Lightbox de fotos ----
  openLightbox(project: PortfolioProject, index: number): void {
    const images = project.gallery?.length
      ? project.gallery
      : [{ number: '01', label: project.title, src: project.image, alt: project.imageAlt }];

    const safeIndex = Math.min(Math.max(index, 0), images.length - 1);
    this.lightbox.set({ title: project.title, images, index: safeIndex });
    document.documentElement.classList.add('lightbox-open');
    requestAnimationFrame(() => this.playLightboxEnterAnimation());
  }

  closeLightbox(): void {
    if (!this.lightbox()) return;
    this.playLightboxExitAnimation(() => {
      this.lightbox.set(null);
      document.documentElement.classList.remove('lightbox-open');
    });
  }

  lightboxNext(): void {
    this.shiftLightboxImage(1);
  }

  lightboxPrevious(): void {
    this.shiftLightboxImage(-1);
  }

  private shiftLightboxImage(direction: 1 | -1): void {
    const box = this.lightbox();
    if (!box || box.images.length < 2) return;
    const next = (box.index + direction + box.images.length) % box.images.length;
    this.lightbox.set({ ...box, index: next });
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

  // ---- Animaciones GSAP ----
  private initializeAnimations(): void {
    const root = this.host.nativeElement;
    ScrollTrigger.config({ ignoreMobileResize: true });
    this.mediaContext = gsap.matchMedia();

    // Un solo `add` para toda la página: registrar dos grupos de condiciones
    // separados que comparten las mismas media queries (fineHover,
    // reduceMotion) contra la misma instancia de matchMedia podía dejar sin
    // disparar el callback del primero en algunos entornos táctiles.
    this.mediaContext.add(
      {
        // "all" es una clave especial de GSAP: fuerza que el callback se
        // dispare siempre al registrarse, sin importar si alguna de las
        // demás condiciones ya es verdadera. Sin ella, `add()` solo invoca
        // el callback cuando AL MENOS UNA condición matchea de entrada — en
        // mobile sin `prefers-reduced-motion`, ni "desktop" ni "reduceMotion"
        // ni "fineHover" son verdaderas, así que el callback nunca corría y
        // ninguna animación (ni la malla nueva) se inicializaba ahí.
        all: '',
        desktop: '(min-width: 801px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
        // Distingue "puede recibir hover continuo con precisión" de solo
        // "pantalla ancha": evita activar efectos de cursor en tablets o
        // laptops táctiles que cumplen el breakpoint de escritorio.
        fineHover: '(hover: hover) and (pointer: fine)'
      },
      (media) => {
        const desktop = !!media.conditions?.['desktop'];
        const fineHover = !!media.conditions?.['fineHover'];
        const reduceMotion = !!media.conditions?.['reduceMotion'];

        // La malla del hero se dibuja siempre (estática si hay reduced-motion
        // o no hay cursor fino); solo se deforma con el mouse en dispositivos
        // que lo permiten. No depende del early-return de reduceMotion de
        // abajo porque necesita dibujarse igual sin animaciones.
        const gridCleanup = this.initializeHeroGridCanvas(root, fineHover, reduceMotion);

        if (reduceMotion) return gridCleanup;

        const cursorCleanups: Array<() => void> = [];

        const ctx = gsap.context(() => {
          // Above-the-fold: corre de inmediato para que la entrada del hero
          // no compita por el hilo principal con el resto de la página.
          this.animateScrollProgress();
          this.animateHero(desktop);
          this.animateMarquee();

          // Efectos de cursor: solo se montan (listeners incluidos) en
          // dispositivos con mouse real. En touch nunca llegan a existir.
          if (fineHover) {
            cursorCleanups.push(this.setupMagneticButtons(root));
            cursorCleanups.push(this.setupHeroCursorGlow(root));
          }

          // Below-the-fold: se difiere para no robarle frames a la animación
          // del hero en dispositivos lentos (móviles de gama media/baja).
          this.scheduleIdle(() => {
            this.animateSections();
            this.animateProjects(desktop);
            this.animateCapabilities();
            this.animateWorkflow();
            this.animateContact();
            this.animateHeadingChars();
            this.animateNumberCounters();
            if (desktop) this.animateDesktopParallax();
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });
        }, root);

        return () => {
          gridCleanup();
          cursorCleanups.forEach(teardown => teardown());
          ctx.revert();
        };
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
    const heroTitle = root.querySelector<HTMLElement>('.hero h1');
    const copyElements = root.querySelectorAll<HTMLElement>(
      '.eyebrow, .hero-description, .hero-actions .button, .hero-meta > div'
    );
    const visual = root.querySelector<HTMLElement>('.hero-visual');
    const visualElements = root.querySelectorAll<HTMLElement>(
      '.visual-header, .hero-code-view, .visual-status'
    );

    if (!header || !visual) return;

    // Las letras del h1 se dividen en spans para que entren con su propio
    // rebote, en vez de aparecer como un bloque plano de texto.
    const heroChars = heroTitle ? this.splitChars(heroTitle) : [];

    gsap.set(header, { y: -40, autoAlpha: 0 });
    gsap.set(copyElements, { y: 34, autoAlpha: 0 });
    if (heroChars.length) {
      gsap.set(heroChars, { yPercent: 120, rotateZ: 6, autoAlpha: 0 });
    }
    // El filtro blur es carísimo de componer en CPUs móviles y es la causa
    // principal de que la entrada del hero se sienta como un salto en vez de
    // una animación en gama baja/media: en mobile solo se anima posición/opacidad.
    gsap.set(visual, desktop ? { autoAlpha: 0, filter: 'blur(12px)' } : { autoAlpha: 0, y: 16 });
    gsap.set(visualElements, { y: 18, autoAlpha: 0 });

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(header, { y: 0, autoAlpha: 1, duration: 0.7 })
      .to(copyElements, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.09,
        duration: 0.72
      }, 0.18);

    if (heroChars.length) {
      timeline.to(heroChars, {
        yPercent: 0,
        rotateZ: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.014,
        ease: 'back.out(1.7)'
      }, 0.2);
    }

    timeline
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

  /*
   * Divide el texto de un elemento en spans por palabra (evita cortes a
   * mitad de palabra) y por carácter (para animar cada letra por separado),
   * preservando cualquier elemento anidado (p. ej. el <span> del hero).
   */
  private splitChars(root: HTMLElement): HTMLElement[] {
    const chars: HTMLElement[] = [];

    const walk = (node: ChildNode): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (!text.trim()) return;

        const fragment = document.createDocumentFragment();

        text.split(/(\s+)/).forEach(token => {
          if (token === '') return;

          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
            return;
          }

          const word = document.createElement('span');
          word.style.display = 'inline-block';
          word.style.whiteSpace = 'nowrap';

          Array.from(token).forEach(letter => {
            const char = document.createElement('span');
            char.style.display = 'inline-block';
            char.textContent = letter;
            word.appendChild(char);
            chars.push(char);
          });

          fragment.appendChild(word);
        });

        node.parentNode?.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };

    Array.from(root.childNodes).forEach(walk);
    return chars;
  }

  /*
   * Aplica el mismo reveal por letras a los títulos del resto de la página,
   * disparado por ScrollTrigger a medida que cada uno entra en pantalla.
   */
  private animateHeadingChars(): void {
    const headings = gsap.utils.toArray<HTMLElement>(
      '.intro h2, .section-heading h2, .about-heading h2, .contact h2, .project-content h3, .capability-card h3, .workflow-item h3'
    );

    headings.forEach(heading => {
      const chars = this.splitChars(heading);
      if (!chars.length) return;

      gsap.set(chars, { yPercent: 130, rotateZ: 7, autoAlpha: 0 });
      gsap.to(chars, {
        yPercent: 0,
        rotateZ: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.016,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: heading, start: 'top 90%', once: true }
      });
    });
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

  /*
   * Malla de fondo del hero dibujada en canvas. Reemplaza el antiguo
   * background-image estático: dibuja la misma cuadrícula de 52px y, si el
   * dispositivo tiene mouse real (fineHover) y no hay reduced-motion, cada
   * intersección se empuja lejos del cursor con caída radial. Se anima con
   * `gsap.ticker` (el mismo reloj que usa GSAP internamente) en vez de un
   * requestAnimationFrame propio, para no duplicar el loop de render.
   */
  private initializeHeroGridCanvas(root: HTMLElement, fineHover: boolean, reduceMotion: boolean): () => void {
    const hero = root.querySelector<HTMLElement>('.hero');
    if (!hero) return () => {};

    // El canvas se crea por JS en vez de vivir en el template: si estuviera
    // en el HTML, la hidratación de SSR lo reconcilia/reemplaza justo
    // después de que dibujamos en él (no sabe reconciliar un bitmap mutado
    // a mano), dejando el dibujo en un nodo ya desprendido del DOM. Por la
    // misma razón sus estilos van inline: al no salir del template no recibe
    // el atributo de scope de Angular, así que el CSS del componente no lo
    // alcanzaría de todos modos.
    let canvas = hero.querySelector<HTMLCanvasElement>('.hero-grid-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'hero-grid-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      Object.assign(canvas.style, {
        position: 'absolute',
        top: '90px',
        zIndex: '-2',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent, #000 20%, #000 70%, transparent)',
        webkitMaskImage: 'linear-gradient(to bottom, transparent, #000 20%, #000 70%, transparent)'
      });
      hero.prepend(canvas);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    // El alcance horizontal de la malla se ajusta en mobile (mismo criterio
    // que tenía el ::before original) para no desperdiciar una franja tan
    // ancha fuera de un viewport pequeño.
    const applyResponsiveSpan = () => {
      const mobile = window.innerWidth <= 800;
      canvas.style.left = mobile ? '-2rem' : '-12vw';
      canvas.style.width = mobile ? 'calc(100% + 4rem)' : 'calc(100% + 24vw)';
      canvas.style.height = 'calc(100% - 90px)';
    };
    applyResponsiveSpan();

    const CELL = 52;
    const RADIUS = 300;
    const STRENGTH = 46;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let grid: Array<Array<{ x: number; y: number }>> = [];
    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    const buildGrid = () => {
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      grid = [];
      for (let r = 0; r <= rows; r++) {
        const row: Array<{ x: number; y: number }> = [];
        for (let c = 0; c <= cols; c++) {
          row.push({ x: c * CELL, y: r * CELL });
        }
        grid.push(row);
      }
    };

    const resize = () => {
      applyResponsiveSpan();
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(18, 18, 18, 0.075)';
      ctx.lineWidth = 1;

      const displaced = grid.map(row => row.map(point => {
        if (!fineHover) return point;
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0 || dist > RADIUS) return point;
        const push = (1 - dist / RADIUS) ** 2 * STRENGTH;
        return { x: point.x + (dx / dist) * push, y: point.y + (dy / dist) * push };
      }));

      displaced.forEach(row => {
        ctx.beginPath();
        row.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
      });
      for (let c = 0; c < (displaced[0]?.length ?? 0); c++) {
        ctx.beginPath();
        displaced.forEach((row, r) => (r === 0 ? ctx.moveTo(row[c].x, row[c].y) : ctx.lineTo(row[c].x, row[c].y)));
        ctx.stroke();
      }
    };

    const tick = () => {
      // Lerp manual: más simple que orquestar un tween de GSAP por cada
      // uno de los ~150 puntos de la malla en cada frame.
      pointer.x += (pointer.targetX - pointer.x) * 0.15;
      pointer.y += (pointer.targetY - pointer.y) * 0.15;
      draw();
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    if (!fineHover || reduceMotion) {
      return () => window.removeEventListener('resize', resize);
    }

    // Escucha en window (no solo en .hero): el canvas se extiende -12vw más
    // allá de la caja centrada del hero, y esa franja visual queda fuera del
    // área de `.hero` — sin esto, el cursor no deformaba la malla cerca de
    // los bordes de la pantalla.
    const handleMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
    };
    // 'mouseleave' no aplica a window; se detecta la salida del viewport
    // cuando el mouse sale del documento sin entrar a otro elemento interno.
    const handleLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        pointer.targetX = -9999;
        pointer.targetY = -9999;
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseout', handleLeave);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseout', handleLeave);
      gsap.ticker.remove(tick);
    };
  }

  /*
   * Botones "magnéticos": el cursor los atrae unos px al acercarse.
   * Usa quickTo (no crea un tween nuevo por cada mousemove) y solo se llama
   * cuando `fineHover` es true, así que en touch jamás se registra listener.
   */
  private setupMagneticButtons(root: HTMLElement): () => void {
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.button, .project-links a'));

    const teardowns = targets.map(el => {
      const setX = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const setY = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

      // El rect se cachea al entrar, no en cada mousemove: leerlo en vivo
      // incluiría el translate que el propio efecto ya aplicó, retroalimentando
      // el cálculo y atenuando el efecto de forma inconsistente al moverse rápido.
      let originRect: DOMRect | null = null;

      const handleEnter = () => {
        originRect = el.getBoundingClientRect();
      };
      const handleMove = (event: MouseEvent) => {
        const rect = originRect ?? el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        // El desplazamiento se limita a una fracción del propio botón: como
        // el translate mueve también su área de hit-testing, un offset mayor
        // podría sacar el botón de debajo del cursor cerca de los bordes.
        const maxX = rect.width / 2 - 8;
        const maxY = rect.height / 2 - 8;
        setX(gsap.utils.clamp(-maxX, maxX, relX * 0.3));
        // -4 conserva el "lift" que antes daba el hover por CSS: el estilo
        // inline que aplica GSAP tiene más prioridad que la regla :hover.
        setY(gsap.utils.clamp(-maxY, maxY, relY * 0.55 - 4));
      };
      const handleLeave = () => {
        originRect = null;
        setX(0);
        setY(0);
      };

      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);

      return () => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
        gsap.set(el, { clearProps: 'transform' });
      };
    });

    return () => teardowns.forEach(teardown => teardown());
  }

  /*
   * Spotlight que sigue el cursor dentro del hero-visual. Combina xPercent/
   * yPercent (centrado) con x/y en px (posición real), que GSAP compone en
   * una sola matriz de transform. Solo se activa con `fineHover`.
   */
  private setupHeroCursorGlow(root: HTMLElement): () => void {
    const visual = root.querySelector<HTMLElement>('.hero-visual');
    const spotlight = root.querySelector<HTMLElement>('.hero-visual-spotlight');
    if (!visual || !spotlight) return () => {};

    const rect = visual.getBoundingClientRect();
    gsap.set(spotlight, { xPercent: -50, yPercent: -50, x: rect.width / 2, y: rect.height / 2 });

    const setX = gsap.quickTo(spotlight, 'x', { duration: 0.5, ease: 'power3.out' });
    const setY = gsap.quickTo(spotlight, 'y', { duration: 0.5, ease: 'power3.out' });

    const handleMove = (event: MouseEvent) => {
      const visualRect = visual.getBoundingClientRect();
      setX(event.clientX - visualRect.left);
      setY(event.clientY - visualRect.top);
    };

    visual.addEventListener('mousemove', handleMove);

    return () => {
      visual.removeEventListener('mousemove', handleMove);
      gsap.set(spotlight, { clearProps: 'transform' });
    };
  }

  /*
   * Cuenta hacia arriba los números de badge ("01", "02"...) cuando entran en
   * pantalla. No depende del cursor, así que corre igual en mobile y desktop.
   */
  private animateNumberCounters(): void {
    const targets = gsap.utils.toArray<HTMLElement>(
      '.project-number, .capability-number, .workflow-item > span'
    );

    targets.forEach(target => {
      const finalValue = parseInt(target.textContent ?? '', 10);
      if (Number.isNaN(finalValue)) return;

      const counter = { value: 0 };
      target.textContent = '00';

      gsap.to(counter, {
        value: finalValue,
        duration: 1.1,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
          target.textContent = String(Math.round(counter.value)).padStart(2, '0');
        },
        scrollTrigger: { trigger: target, start: 'top 90%', once: true }
      });
    });
  }

  private cleanup(): void {
    this.mediaContext?.revert();
    this.mediaContext = null;
    this.clearAllGalleryTimers();
    // onDestroy también corre en el render de servidor (SSR/prerender), donde
    // `document` no existe: sin esta guarda, destruir la vista en el
    // servidor lanza un ReferenceError.
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lightbox-open');
    }
  }
}