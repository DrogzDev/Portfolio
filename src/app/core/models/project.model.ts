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


export type ProjectStatus = 'live' | 'demo' | 'private' | 'in-development';


export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  group: string;
}


export interface ArchitectureConnection {
  from: string;
  to: string;
  label?: string;
}


export interface ProjectArchitecture {
  /*
   * Alternativa textual real del diagrama (no decorativa): se muestra antes
   * del diagrama para que tenga sentido incluso sin percibir la disposición
   * visual de los nodos.
   */
  summary: string;

  /*
   * 'steps' fuerza una secuencia vertical única incluso en desktop, para
   * flujos genuinamente lineales (ej. importación de Excel).
   */
  layout?: 'stages' | 'steps';

  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
}


export interface ProjectDecision {
  title: string;
  detail: string;
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
   * Cuando existe una galería, el caso de estudio muestra
   * estas imágenes mediante el carrusel GSAP.
   */
  gallery?: ProjectGalleryImage[];

  links: ProjectLink[];

  /* Texto mostrado cuando `links` está vacío (ej. proyecto privado). */
  linksNote?: string;

  /* --- Contenido ampliado para la home recortada y el caso de estudio --- */

  /* Responsabilidad de Miguel en el proyecto, en una línea. */
  role: string;

  /* 3-5 features curadas para la tarjeta de la home (subconjunto de `features`). */
  keyFeatures: string[];

  /* 3-5 tecnologías principales mostradas como badges en la home. */
  primaryTechnologies: string[];

  status: ProjectStatus;

  architecture: ProjectArchitecture;

  decisions: ProjectDecision[];

  /* Resultados/estado actual verificable. Se omite si el proyecto no tiene resultados que mostrar todavía. */
  results?: string[];
}
