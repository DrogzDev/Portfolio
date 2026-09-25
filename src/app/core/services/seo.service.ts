import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoUpdate {
  title: string;
  description: string;
  /** Ruta relativa que empieza en "/", ej. "/projects/venecambio". */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
}

/*
 * No hay un dominio propio conocido todavía (no aparece en package.json,
 * angular.json ni README) — placeholder hasta que se confirme el dominio
 * real del portafolio. Actualizar aquí también actualiza robots.txt/
 * sitemap.xml (archivos estáticos separados en public/).
 */
const SITE_URL = 'https://TU-DOMINIO-AQUI.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(update: SeoUpdate): void {
    const url = `${SITE_URL}${update.path}`;
    const image = update.image ? `${SITE_URL}${update.image}` : undefined;
    const type = update.type ?? 'website';

    this.title.setTitle(update.title);
    this.meta.updateTag({ name: 'description', content: update.description });

    this.meta.updateTag({ property: 'og:title', content: update.title });
    this.meta.updateTag({ property: 'og:description', content: update.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      if (update.imageAlt) {
        this.meta.updateTag({ property: 'og:image:alt', content: update.imageAlt });
      }
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: update.title });
    this.meta.updateTag({ name: 'twitter:description', content: update.description });
    if (image) {
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    this.updateCanonical(url);
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
