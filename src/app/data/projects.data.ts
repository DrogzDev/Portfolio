import {
  PortfolioProject
} from '../core/models/project.model';


export const PROJECTS: PortfolioProject[] = [
{
  slug: 'venecambio',
  number: '01',
  title: 'Venecambio',
  category: 'Fintech · Datos en tiempo real',

  summary:
    'Plataforma financiera para consultar tasas, convertir divisas, analizar precios de Binance P2P con IA y recibir alertas bancarias en Venezuela.',

  description:
    'Aplicación full stack que centraliza tasas oficiales del BCV, referencias del mercado P2P de Binance y alertas bancarias detectadas desde Telegram. El sistema captura precios periódicamente y construye un historial consultable en gráficos de línea y de velas. Incluye un conversor de divisas, alertas de precio configurables y un analizador de mercado que usa un modelo de IA local (Ollama) para narrar tendencia, riesgo y mejores horas a partir de métricas que ya calcula Django, con un resumen diario generado automáticamente. También está disponible como app nativa para Android, empaquetada con Capacitor.',

  challenge:
    'Integrar fuentes financieras con estructuras y ritmos de actualización diferentes, detectar alertas relevantes dentro de Telegram y almacenar capturas periódicas de Binance P2P sin bloquear la aplicación. La información debía procesarse en segundo plano y presentarse mediante una interfaz clara, rápida y fácil de interpretar. Sumar el analizador con IA trajo otro reto: que el modelo narre el mercado sin inventar cifras. Por eso nunca decide tendencia, riesgo o mejores horas por sí mismo — esos valores los calcula Django y se los entrega ya resueltos, separados de los datos crudos, y cada análisis se cachea por hash para no repetir inferencias innecesarias.',

  technologies: [
    'React',
    'Vite',
    'TypeScript',
    'Capacitor',
    'Python',
    'Django',
    'Django REST Framework',
    'SQLite',
    'Redis',
    'Celery',
    'Celery Beat',
    'Ollama',
    'Telegram',
    'Web Push',
    'Podman'
  ],

  features: [
    'Consulta y almacenamiento de tasas oficiales del BCV',
    'Capturas automáticas de ofertas de Binance P2P',
    'Análisis del mejor precio, promedio y mediana del top de ofertas',
    'Historial de precios en gráficos de línea y de velas',
    'Identificación del mejor precio registrado durante el día',
    'Conversor de divisas con tasas BCV, USDT P2P y personalizadas',
    'Analizador de mercado con IA local (Ollama): tendencia, riesgo y mejores horas',
    'Resumen diario del mercado generado automáticamente',
    'Alertas de precio configurables por el usuario',
    'Lectura automática de alertas bancarias desde Telegram',
    'Detección de bancos y eventos relevantes dentro de los mensajes',
    'Distribución de alertas mediante notificaciones web push',
    'Caché y procesamiento de tareas en segundo plano',
    'También disponible como app nativa para Android (APK vía Capacitor)'
  ],

  image: '/venecambio-inicio.png',

  imageAlt:
    'Pantalla de inicio de Venecambio con el conversor de divisas y las tasas del BCV y Binance P2P',

  gallery: [
    {
      number: '01',
      label: 'Inicio',
      src: '/venecambio-inicio.png',
      alt:
        'Pantalla de inicio de Venecambio con el conversor de divisas y las tasas del BCV y Binance P2P'
    },
    {
      number: '02',
      label: 'Historial',
      src: '/venecambio-grafico.png',
      alt:
        'Historial de precios de Venecambio en gráfico de velas, con estadísticas del período'
    },
    {
      number: '03',
      label: 'Analizador IA',
      src: '/venecambio-analizador-ia.png',
      alt:
        'Analizador de mercado de Venecambio con el botón para generar un análisis con IA'
    },
    {
      number: '04',
      label: 'Alertas',
      src: '/venecambio-alertas.png',
      alt:
        'Configuración de alertas bancarias y de precio en Venecambio'
    }
  ],

  links: [
    {
      label: 'Ver proyecto',
      url: 'https://venecambio.lat/',
      type: 'frontend'
    },
    {
      label: 'Backend',
      url: 'https://github.com/DrogzDev/Vene-Backend',
      type: 'backend'
    }
  ]
},

  {
    slug: 'sistema-pos',
    number: '02',
    title: 'Sistema POS',
    category: 'Ventas e inventario',

    summary:
      'Gestión de productos, variantes, almacenes, ventas y facturación.',

    description:
      'Sistema administrativo para una tienda de calzado, construido con Angular y Django para controlar inventario, facturas, pagos y estadísticas.',

    challenge:
      'Gestionar productos con distintas tallas, colores y existencias sin complicar el flujo diario de ventas.',

    technologies: [
      'Angular',
      'TypeScript',
      'Python',
      'Django',
      'Django REST Framework',
      'PostgreSQL'
    ],

    features: [
      'Productos con tallas y colores',
      'Inventario por almacén',
      'Control de existencias',
      'Facturación',
      'Pagos en USD y bolívares',
      'Dashboard de estadísticas'
    ],

    /*
     * Se conserva como fallback.
     */
    image: '/POS1.png',

    imageAlt:
      'Dashboard principal del sistema POS',

    gallery: [
      {
        number: '01',
        label: 'Dashboard',
        src: '/POS1.png',
        alt:
          'Dashboard principal con indicadores del sistema POS'
      },
      {
        number: '02',
        label: 'Inventario',
        src: '/POS2.png',
        alt:
          'Vista de inventario y existencias del sistema POS'
      },
      {
        number: '03',
        label: 'Productos',
        src: '/POS3.png',
        alt:
          'Gestión de productos y variantes del sistema POS'
      },
      {
        number: '04',
        label: 'Facturación',
        src: '/POS4.png',
        alt:
          'Vista de ventas y facturación del sistema POS'
      }
    ],

    links: [
      {
        label: 'Ver demo',
        url: 'https://demo.noctesystems.online/',
        type: 'live'
      },
      {
        label: 'Repositorio demo',
        url: 'https://github.com/DrogzDev/Tienda-Demo',
        type: 'repository'
      },
      {
        label: 'Ver repositorio',
        url: 'https://github.com/DrogzDev/Tienda',
        type: 'repository'
      }
    ]
  },

  {
    slug: 'inventario-ministerio',
    number: '03',
    title: 'Inventario Ministerio',
    category: 'Sistema institucional · Gestión de inventario',

    summary:
      'Sistema de inventario para el Ministerio del Poder Popular para Hábitat y Vivienda, con carga masiva por Excel, control de existencias y roles por cargo.',

    description:
      'Plataforma full stack desarrollada para el Ministerio del Poder Popular para Hábitat y Vivienda que centraliza el control de inventario institucional: productos por categoría y almacén, entradas y salidas, hojas de ruta, notas de entrega e informes de gestión. Incluye carga masiva desde Excel con revisión asistida antes de confirmar cualquier cambio de stock, historial de movimientos y permisos diferenciados por rol (Administrador, Director, Almacenista). Por tratarse de un proyecto privado del ministerio, la demostración en vivo se realiza de forma presencial.',

    challenge:
      'Permitir que varios cargos (Administrador, Director, Almacenista) operen el mismo inventario con permisos distintos, y procesar cargas masivas de Excel sin arriesgar el stock real: cada importación se revisa antes de confirmarse, decidiendo producto por producto si crea uno nuevo o suma cantidad a uno existente.',

    technologies: [
      'Angular',
      'TypeScript',
      'Python',
      'Django',
      'Django REST Framework',
      'JWT',
      'SQLite',
      'Docker'
    ],

    features: [
      'Inventario por categoría, almacén y sección',
      'Carga masiva desde Excel con revisión antes de confirmar',
      'Carga por lotes y registro manual de productos',
      'Historial de movimientos y existencias',
      'Hojas de ruta y notas de entrega',
      'Informes de gestión y reportes',
      'Roles y permisos por cargo (Administrador, Director, Almacenista)',
      'Modo oscuro'
    ],

    image: '/ministerio-inventario.png',

    imageAlt:
      'Panel de inventario del sistema del Ministerio de Hábitat y Vivienda',

    gallery: [
      {
        number: '01',
        label: 'Inventario',
        src: '/ministerio-inventario.png',
        alt:
          'Listado de inventario con existencias y estado de stock'
      },
      {
        number: '02',
        label: 'Carga por Excel',
        src: '/ministerio-excel.png',
        alt:
          'Pantalla de carga masiva de inventario desde archivo Excel'
      },
      {
        number: '03',
        label: 'Modo oscuro',
        src: '/ministerio-darkmode.png',
        alt:
          'Inventario del sistema institucional en modo oscuro'
      }
    ],

    links: []
  },

  {
    slug: 'careperro',
    number: '04',
    title: 'Care Perro’s House',
    category: 'Landing page · Comida rápida y negocios similares',

    summary:
      'Landing page de marca para negocios de comida rápida, con identidad visual propia, highlights de producto y ubicación en un mapa interactivo.',

    description:
      'Landing page para Care Perro’s House, una marca de burgers y hotdogs, pensada como base reutilizable para restaurantes de comida rápida y negocios similares. Combina un hero animado con slider de productos, una franja de highlights, una sección de historia de marca y una sección de ubicación con mapa interactivo (Leaflet + OpenStreetMap) enlazado a Google Maps, con horario y calificación. El backend en Django ya define la estructura de categorías y productos del menú, todavía en una fase temprana de desarrollo.',

    challenge:
      'Transmitir una identidad de marca marcada (mascota, ilustraciones a mano, microinteracciones con GSAP) sin perder una estructura reutilizable para cualquier negocio de comida rápida, e integrar una sección de ubicación con mapa real sin depender de servicios de pago.',

    technologies: [
      'Astro',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'GSAP',
      'Leaflet',
      'Django'
    ],

    features: [
      'Hero animado con slider de productos destacados',
      'Franja de highlights (burgers, hotdogs, bebidas, ambiente)',
      'Sección de historia y personalidad de marca',
      'Ubicación con mapa interactivo (Leaflet + OpenStreetMap) y enlace directo a Google Maps',
      'Horario y calificación del local',
      'Header responsive con menú móvil',
      'Animaciones de scroll con GSAP',
      'Estructura de categorías y productos en Django, lista para conectar el menú y los pedidos'
    ],

    image: '/careperro-hero.jpg',

    imageAlt:
      'Hero de la landing page de Care Perro’s House con el slider de burgers destacadas',

    gallery: [
      {
        number: '01',
        label: 'Hero',
        src: '/careperro-hero.jpg',
        alt:
          'Hero de la landing page de Care Perro’s House con el slider de burgers destacadas'
      },
      {
        number: '02',
        label: 'Ubicación',
        src: '/careperro-ubicacion.jpg',
        alt:
          'Sección de ubicación con mapa interactivo, horario y calificación'
      }
    ],

    links: []
  }
];