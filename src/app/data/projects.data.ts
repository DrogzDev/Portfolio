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
    'Plataforma financiera para consultar tasas, analizar precios de Binance P2P y recibir alertas bancarias en Venezuela.',

  description:
    'Aplicación full stack que centraliza tasas oficiales del BCV, referencias del mercado P2P y alertas bancarias detectadas desde Telegram. El sistema captura precios de Binance periódicamente, construye un historial consultable e identifica cuáles fueron las mejores tasas y en qué momento aparecieron.',

  challenge:
    'Integrar fuentes financieras con estructuras y ritmos de actualización diferentes, detectar alertas relevantes dentro de Telegram y almacenar capturas periódicas de Binance P2P sin bloquear la aplicación. La información debía procesarse en segundo plano y presentarse mediante una interfaz clara, rápida y fácil de interpretar.',

  technologies: [
    'Angular',
    'TypeScript',
    'Python',
    'Django',
    'Django REST Framework',
    'PostgreSQL',
    'Redis',
    'Celery',
    'Celery Beat',
    'Telegram',
    'Web Push',
    'Podman'
  ],

  features: [
    'Consulta y almacenamiento de tasas oficiales del BCV',
    'Capturas automáticas de ofertas de Binance P2P',
    'Análisis del mejor precio, promedio y mediana del top de ofertas',
    'Historial de precios organizado por fecha y hora',
    'Identificación del mejor precio registrado durante el día',
    'Gráficas para visualizar variaciones y picos del mercado',
    'Lectura automática de alertas bancarias desde Telegram',
    'Detección de bancos y eventos relevantes dentro de los mensajes',
    'Distribución de alertas mediante notificaciones web push',
    'Caché y procesamiento de tareas en segundo plano'
  ],

  image: '/venecambio.png',

  imageAlt:
    'Dashboard de Venecambio con tasas financieras, precios históricos de Binance P2P y alertas bancarias',

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
        label: 'Ver repositorio',
        url: 'https://github.com/DrogzDev/Tienda',
        type: 'repository'
      }
    ]
  }
];