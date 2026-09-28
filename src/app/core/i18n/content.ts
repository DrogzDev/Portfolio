import { ProjectStatus } from '../models/project.model';

export type Lang = 'en' | 'es';

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  technologies: string[];
}

export interface WorkflowItem {
  number: string;
  title: string;
  description: string;
}

export interface SiteContent {
  skipLink: string;

  header: {
    brandAriaLabel: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    projects: string;
    stack: string;
    about: string;
    contact: string;
    downloadCv: string;
  };

  hero: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    description: string;
    viewProjects: string;
    downloadCv: string;
    meta: {
      realtimeTitle: string;
      realtimeDescription: string;
      automationTitle: string;
      automationDescription: string;
      endToEndTitle: string;
      endToEndDescription: string;
    };
    codeFileName: string;
    portraitFileName: string;
    runAction: string;
    viewCodeAction: string;
    showPortraitAriaLabel: string;
    hidePortraitAriaLabel: string;
    portraitAlt: string;
    buildSuccessful: string;
    developerRendered: string;
    statusRunning: string;
    statusDone: string;
  };

  marqueeAriaLabel: string;

  intro: {
    label: string;
    heading: string;
    body: string;
  };

  projectsSection: {
    label: string;
    heading: string;
    body: string;
    myRole: string;
    primaryTechAriaLabel: string;
    viewCaseStudy: string;
  };

  capabilities: {
    label: string;
    heading: string;
    body: string;
    items: CapabilityItem[];
  };

  workflow: {
    label: string;
    heading: string;
    body: string;
    items: WorkflowItem[];
  };

  about: {
    label: string;
    heading: string;
    lead: string;
    paragraphs: string[];
    githubCta: string;
  };

  contact: {
    label: string;
    heading: string;
    body: string;
  };

  projectDetail: {
    skipLink: string;
    backToHome: string;
    overviewHeading: string;
    challengeHeading: string;
    architectureHeading: string;
    decisionsHeading: string;
    featuresHeading: string;
    techStackHeading: string;
    techStackAriaLabel: string;
    resultsHeading: string;
    galleryHeading: string;
    myRole: string;
    primaryTechAriaLabel: string;
    statusLabel: Record<ProjectStatus, string>;
    architectureAriaLabel: (title: string) => string;
    noConnectionYet: string;
    notFoundTitle: string;
    notFoundBody: string;
  };

  gallery: {
    ariaLabel: (title: string) => string;
    viewLarge: (label: string) => string;
    previousImage: string;
    nextImage: string;
    selectImageAriaLabel: string;
    showImage: (label: string) => string;
    lightboxAriaLabel: (title: string) => string;
    close: string;
    previousImageShort: string;
    nextImageShort: string;
  };

  languageSwitcher: {
    groupAriaLabel: string;
  };
}

export const CONTENT: Record<Lang, SiteContent> = {
  en: {
    skipLink: 'Skip to content',

    header: {
      brandAriaLabel: 'Go to homepage',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      mainNav: 'Main navigation',
      projects: 'Projects',
      stack: 'Stack',
      about: 'About',
      contact: 'Contact',
      downloadCv: 'Download CV'
    },

    hero: {
      eyebrow: 'Full Stack Developer',
      titleStart: 'Clear interfaces.',
      titleHighlight: 'Complete systems.',
      description:
        'I build applications with Angular and Django to turn data, inventory, sales and alerts into products people actually use.',
      viewProjects: 'View projects',
      downloadCv: 'Download CV',
      meta: {
        realtimeTitle: 'Real-time data',
        realtimeDescription: 'Alerts and history',
        automationTitle: 'Automation',
        automationDescription: 'Redis and Celery',
        endToEndTitle: 'End-to-end development',
        endToEndDescription: 'Angular and Django'
      },
      codeFileName: 'portfolio.config.ts',
      portraitFileName: 'developer.rendered.png',
      runAction: 'Run ↗',
      viewCodeAction: 'View code ↺',
      showPortraitAriaLabel: 'Run the code and show the portrait',
      hidePortraitAriaLabel: 'Go back to the code view',
      portraitAlt: 'Portrait of Miguel Luna, Full Stack Developer',
      buildSuccessful: 'Build successful',
      developerRendered: 'Developer rendered',
      statusRunning: 'Click to run the profile.',
      statusDone: 'Render complete. Click to go back.'
    },

    marqueeAriaLabel: 'Core technologies',

    intro: {
      label: 'Profile',
      heading: 'Ideas turned into working products.',
      body:
        'I specialize in building full applications with modern interfaces, well-structured APIs, automation and real-time data.'
    },

    projectsSection: {
      label: 'Selected work',
      heading: 'Real projects',
      body:
        'Products where I worked on the visual experience as well as the architecture, system logic and infrastructure.',
      myRole: 'My role:',
      primaryTechAriaLabel: 'Core technologies',
      viewCaseStudy: 'View case study'
    },

    capabilities: {
      label: 'Capabilities',
      heading: 'From frontend to deployment.',
      body:
        'I can work on a product as a complete system, not just as a collection of independent screens.',
      items: [
        {
          number: '01',
          title: 'Frontend',
          description: 'Responsive, accessible interfaces built with Angular, TypeScript and modern CSS.',
          technologies: ['Angular', 'TypeScript', 'HTML', 'CSS']
        },
        {
          number: '02',
          title: 'Backend',
          description: 'APIs, authentication, business logic and data processing with Python and Django.',
          technologies: ['Python', 'Django', 'DRF', 'PostgreSQL']
        },
        {
          number: '03',
          title: 'DevOps',
          description: 'Scheduled tasks, caching, background processing, containers and deployment.',
          technologies: ['Redis', 'Celery', 'Podman', 'Git']
        }
      ]
    },

    workflow: {
      label: 'Process',
      heading: 'How I build',
      body: 'A straightforward process to avoid building features that don’t solve the real problem.',
      items: [
        {
          number: '01',
          title: 'Understand',
          description: 'I define the problem, the users and the information the product actually needs.'
        },
        {
          number: '02',
          title: 'Design',
          description: 'I organize the experience, the components and the architecture before building.'
        },
        {
          number: '03',
          title: 'Build',
          description: 'I develop the interface, the API, the database and the necessary integrations.'
        },
        {
          number: '04',
          title: 'Improve',
          description: 'I test the product, fix issues and optimize performance and usability.'
        }
      ]
    },

    about: {
      label: 'About me',
      heading: 'I build with a product mindset.',
      lead: 'I’m Miguel, a Full Stack Developer specialized in Angular, Django and Python.',
      paragraphs: [
        'I like to understand how a business works before writing any code. That lets me build interfaces and systems that solve real tasks, not just ones that look good.',
        'I’ve worked with dashboards, inventory, billing, financial data, scheduled tasks, notifications and applications connected to different APIs.',
        'My approach combines interface design, frontend architecture, backend development and deployment to keep a complete view of the product.'
      ],
      githubCta: 'View GitHub profile'
    },

    contact: {
      label: 'Contact',
      heading: 'Have an idea that needs to become a product?',
      body: 'We can talk about the project, its needs and the best way to build a first working version.'
    },

    projectDetail: {
      skipLink: 'Skip to content',
      backToHome: 'Back to home',
      overviewHeading: 'What I built',
      challengeHeading: 'The challenge',
      architectureHeading: 'Architecture',
      decisionsHeading: 'Key decisions',
      featuresHeading: 'Features',
      techStackHeading: 'Full stack',
      techStackAriaLabel: 'Technologies used',
      resultsHeading: 'Results',
      galleryHeading: 'Gallery',
      myRole: 'My role:',
      primaryTechAriaLabel: 'Core technologies',
      statusLabel: {
        live: 'Live',
        demo: 'Public demo',
        private: 'Private project',
        'in-development': 'In development'
      },
      architectureAriaLabel: (title: string) => `Architecture of ${title}`,
      noConnectionYet: 'not connected yet',
      notFoundTitle: 'Project not found',
      notFoundBody: 'The project you’re looking for doesn’t exist or has been moved.'
    },

    gallery: {
      ariaLabel: (title: string) => `Gallery of ${title}`,
      viewLarge: (label: string) => `View larger image: ${label}`,
      previousImage: 'Show previous image',
      nextImage: 'Show next image',
      selectImageAriaLabel: 'Select image',
      showImage: (label: string) => `Show ${label}`,
      lightboxAriaLabel: (title: string) => `Gallery of ${title}`,
      close: 'Close',
      previousImageShort: 'Previous image',
      nextImageShort: 'Next image'
    },

    languageSwitcher: {
      groupAriaLabel: 'Language'
    }
  },

  es: {
    skipLink: 'Saltar al contenido',

    header: {
      brandAriaLabel: 'Ir al inicio',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      mainNav: 'Navegación principal',
      projects: 'Proyectos',
      stack: 'Stack',
      about: 'Sobre mí',
      contact: 'Contacto',
      downloadCv: 'Descargar CV'
    },

    hero: {
      eyebrow: 'Full Stack Developer',
      titleStart: 'Interfaces claras.',
      titleHighlight: 'Sistemas completos.',
      description:
        'Construyo aplicaciones con Angular y Django para transformar datos, inventario, ventas y alertas en productos que las personas realmente pueden utilizar.',
      viewProjects: 'Ver proyectos',
      downloadCv: 'Descargar CV',
      meta: {
        realtimeTitle: 'Datos en tiempo real',
        realtimeDescription: 'Alertas e históricos',
        automationTitle: 'Automatización',
        automationDescription: 'Redis y Celery',
        endToEndTitle: 'Desarrollo end‑to‑end',
        endToEndDescription: 'Angular y Django'
      },
      codeFileName: 'portfolio.config.ts',
      portraitFileName: 'developer.rendered.png',
      runAction: 'Ejecutar ↗',
      viewCodeAction: 'Ver código ↺',
      showPortraitAriaLabel: 'Ejecutar el código y mostrar el retrato',
      hidePortraitAriaLabel: 'Volver a mostrar el código',
      portraitAlt: 'Retrato de Miguel Luna, desarrollador Full Stack',
      buildSuccessful: 'Compilación exitosa',
      developerRendered: 'Desarrollador renderizado',
      statusRunning: 'Haz clic para ejecutar el perfil.',
      statusDone: 'Render completado. Haz clic para volver.'
    },

    marqueeAriaLabel: 'Tecnologías principales',

    intro: {
      label: 'Perfil',
      heading: 'Ideas convertidas en productos funcionales.',
      body:
        'Me especializo en construir aplicaciones completas con interfaces modernas, APIs estructuradas, automatizaciones y datos actualizados en tiempo real.'
    },

    projectsSection: {
      label: 'Trabajo seleccionado',
      heading: 'Proyectos reales',
      body:
        'Productos en los que trabajé tanto la experiencia visual como la arquitectura, la lógica del sistema y su infraestructura.',
      myRole: 'Mi rol:',
      primaryTechAriaLabel: 'Tecnologías principales',
      viewCaseStudy: 'Ver caso de estudio'
    },

    capabilities: {
      label: 'Capacidades',
      heading: 'Del frontend al despliegue.',
      body:
        'Puedo trabajar un producto como un sistema completo, no solamente como una colección de pantallas independientes.',
      items: [
        {
          number: '01',
          title: 'Frontend',
          description: 'Interfaces responsive y accesibles construidas con Angular, TypeScript y CSS moderno.',
          technologies: ['Angular', 'TypeScript', 'HTML', 'CSS']
        },
        {
          number: '02',
          title: 'Backend',
          description: 'APIs, autenticación, lógica de negocio y procesamiento de datos con Python y Django.',
          technologies: ['Python', 'Django', 'DRF', 'PostgreSQL']
        },
        {
          number: '03',
          title: 'DevOps',
          description: 'Tareas programadas, caché, procesos en segundo plano, contenedores y despliegue.',
          technologies: ['Redis', 'Celery', 'Podman', 'Git']
        }
      ]
    },

    workflow: {
      label: 'Proceso',
      heading: 'Cómo construyo',
      body: 'Un proceso directo para evitar desarrollar funciones que no resuelvan el problema real.',
      items: [
        {
          number: '01',
          title: 'Entender',
          description: 'Defino el problema, los usuarios y la información que realmente necesita el producto.'
        },
        {
          number: '02',
          title: 'Diseñar',
          description: 'Organizo la experiencia, los componentes y la arquitectura antes de desarrollar.'
        },
        {
          number: '03',
          title: 'Construir',
          description: 'Desarrollo la interfaz, la API, la base de datos y las integraciones necesarias.'
        },
        {
          number: '04',
          title: 'Mejorar',
          description: 'Pruebo el producto, corrijo problemas y optimizo rendimiento y usabilidad.'
        }
      ]
    },

    about: {
      label: 'Sobre mí',
      heading: 'Desarrollo con mentalidad de producto.',
      lead: 'Soy Miguel, desarrollador Full Stack especializado en Angular, Django y Python.',
      paragraphs: [
        'Me gusta entender cómo funciona un negocio antes de comenzar a escribir código. Eso me permite crear interfaces y sistemas que resuelven tareas reales y no solamente se ven bien.',
        'He trabajado con dashboards, inventario, facturación, datos financieros, tareas programadas, notificaciones y aplicaciones conectadas a diferentes APIs.',
        'Mi enfoque combina diseño de interfaces, arquitectura frontend, desarrollo backend y despliegue para mantener una visión completa del producto.'
      ],
      githubCta: 'Ver perfil de GitHub'
    },

    contact: {
      label: 'Contacto',
      heading: '¿Tienes una idea que necesita convertirse en producto?',
      body: 'Podemos hablar sobre el proyecto, sus necesidades y la mejor manera de construir una primera versión funcional.'
    },

    projectDetail: {
      skipLink: 'Saltar al contenido',
      backToHome: 'Volver al inicio',
      overviewHeading: 'Qué construi',
      challengeHeading: 'El reto',
      architectureHeading: 'Arquitectura',
      decisionsHeading: 'Decisiones técnicas',
      featuresHeading: 'Funciones',
      techStackHeading: 'Stack completo',
      techStackAriaLabel: 'Tecnologías utilizadas',
      resultsHeading: 'Resultado',
      galleryHeading: 'Galería',
      myRole: 'Mi rol:',
      primaryTechAriaLabel: 'Tecnologías principales',
      statusLabel: {
        live: 'En producción',
        demo: 'Demo pública',
        private: 'Proyecto privado',
        'in-development': 'En desarrollo'
      },
      architectureAriaLabel: (title: string) => `Arquitectura de ${title}`,
      noConnectionYet: 'sin conexión todavía',
      notFoundTitle: 'Proyecto no encontrado',
      notFoundBody: 'El proyecto que buscas no existe o fue movido.'
    },

    gallery: {
      ariaLabel: (title: string) => `Galería de ${title}`,
      viewLarge: (label: string) => `Ver imagen en grande: ${label}`,
      previousImage: 'Mostrar imagen anterior',
      nextImage: 'Mostrar imagen siguiente',
      selectImageAriaLabel: 'Seleccionar imagen',
      showImage: (label: string) => `Mostrar ${label}`,
      lightboxAriaLabel: (title: string) => `Galería de ${title}`,
      close: 'Cerrar',
      previousImageShort: 'Imagen anterior',
      nextImageShort: 'Imagen siguiente'
    },

    languageSwitcher: {
      groupAriaLabel: 'Idioma'
    }
  }
};
