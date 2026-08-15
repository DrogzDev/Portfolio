export type ProjectLinkType =
  | 'live'
  | 'frontend'
  | 'backend'
  | 'repository';


export interface ProjectLink {
  label: string;
  url: string;
  type: ProjectLinkType;
}


export interface ProjectGalleryImage {
  number: string;
  label: string;
  src: string;
  alt: string;
}


export interface PortfolioProject {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  challenge: string;
  technologies: string[];
  features: string[];

  /*
   * Imagen principal utilizada cuando el proyecto
   * no tiene una galería.
   */
  image: string;
  imageAlt: string;

  /*
   * Cuando existe una galería, el Home muestra
   * estas imágenes mediante el carrusel GSAP.
   */
  gallery?: ProjectGalleryImage[];

  links: ProjectLink[];
}