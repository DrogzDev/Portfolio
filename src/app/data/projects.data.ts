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

    role:
      'Full stack: arquitectura del sistema, backend (Django, DRF, Celery) e integraciones de datos, además de la app cliente (React + Capacitor).',

    keyFeatures: [
      'Analizador de mercado con IA local (Ollama): tendencia, riesgo y mejores horas',
      'Lectura automática de alertas bancarias desde Telegram',
      'Capturas automáticas de ofertas de Binance P2P',
      'Conversor de divisas con tasas BCV, USDT P2P y personalizadas',
      'App nativa para Android empaquetada con Capacitor'
    ],

    primaryTechnologies: ['Django', 'Celery', 'Redis', 'Ollama', 'React'],

    status: 'live',

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

    architecture: {
      summary:
        'Varias fuentes financieras alimentan un núcleo en Django que captura, calcula y decide todo de forma determinista; un modelo de IA local solo redacta la narrativa de esos resultados, y el sistema distribuye alertas por push y las expone tanto en la web como en la app Android.',
      layout: 'stages',
      nodes: [
        { id: 'bcv', group: 'Fuentes de datos', label: 'Tasas BCV', description: 'Tasas oficiales consultadas periódicamente.' },
        { id: 'binance', group: 'Fuentes de datos', label: 'Binance P2P', description: 'Scraper que captura ofertas verificadas del mercado P2P.' },
        { id: 'telegram', group: 'Fuentes de datos', label: 'Telegram', description: 'Listener (Telethon) que detecta alertas bancarias en mensajes entrantes.' },
        { id: 'api', group: 'Núcleo Django · Celery · Redis', label: 'API (DRF)', description: 'Expone precios, historial, conversor y alertas al cliente.' },
        { id: 'beat', group: 'Núcleo Django · Celery · Redis', label: 'Celery Beat', description: 'Tareas periódicas: capturas cada 5 min, cierres diarios, reconciliación de alertas.' },
        { id: 'redis', group: 'Núcleo Django · Celery · Redis', label: 'Redis', description: 'Broker de Celery y caché compartida entre workers.' },
        { id: 'ollama', group: 'IA — narra, no calcula', label: 'Ollama (local)', description: 'Solo redacta texto a partir de señales ya calculadas por Django; nunca decide tendencia, riesgo o cifras. Resultados cacheados por hash.' },
        { id: 'webpush', group: 'Notificaciones', label: 'Web Push', description: 'Notificaciones push vía VAPID para el navegador.' },
        { id: 'fcm', group: 'Notificaciones', label: 'Firebase (FCM)', description: 'Notificaciones push nativas para Android.' },
        { id: 'client', group: 'Cliente', label: 'React + Capacitor', description: 'App web (Vite) y app Android empaquetada con Capacitor.' }
      ],
      connections: [
        { from: 'Fuentes de datos', to: 'Núcleo Django · Celery · Redis', label: 'capturas periódicas' },
        { from: 'Núcleo Django · Celery · Redis', to: 'IA — narra, no calcula', label: 'señales precalculadas' },
        { from: 'IA — narra, no calcula', to: 'Notificaciones', label: 'narrativa + alertas' },
        { from: 'Notificaciones', to: 'Cliente', label: 'push / FCM' }
      ]
    },

    decisions: [
      {
        title: 'Django calcula, Ollama narra',
        detail: 'Tendencia, riesgo, mejores horas y demás señales se calculan de forma determinista en Django antes de llegar al modelo de IA. Ollama nunca recibe datos crudos ni decide cifras: solo redacta un texto a partir de valores ya resueltos, evitando que un LLM "invente" métricas financieras.'
      },
      {
        title: 'Cola de Celery dedicada para alertas de precio',
        detail: 'La inferencia de Ollama puede tardar varios minutos, así que las tareas de price_alerts corren en una cola separada de la cola por defecto, para que nunca bloqueen la entrega de una alerta urgente.'
      },
      {
        title: 'Redis como broker y como caché compartida',
        detail: 'Redis no solo mueve las tareas de Celery: también es el backend de caché de Django, deliberadamente en vez de una caché en memoria local, porque un contador de límite de peticiones debe compartirse entre varios workers de gunicorn.'
      }
    ],

    results: [
      'En producción en venecambio.lat, incluyendo una app Android empaquetada con Capacitor.',
      '[AGREGAR: métricas de uso reales si se quieren mostrar, p. ej. usuarios activos o alertas enviadas]'
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
        type: 'live'
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

    role:
      'Full stack: modelado de datos (productos, variantes, ventas), API con Django REST Framework y frontend en Angular.',

    keyFeatures: [
      'Variantes por talla y color con stock independiente',
      'Stock por tienda (múltiples locales)',
      'Tasa de cambio congelada por venta (USD/bolívares)',
      'Dashboard de rentabilidad e inventario'
    ],

    primaryTechnologies: ['Angular', 'Django', 'Django REST Framework', 'PostgreSQL'],

    status: 'demo',

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

    architecture: {
      summary:
        'El dominio se organiza en catálogo, inventario por tienda y ventas; cada venta congela la tasa de cambio del momento, y esa tasa puede alimentarse desde Venecambio.',
      layout: 'stages',
      nodes: [
        { id: 'product', group: 'Catálogo', label: 'Product · ProductVariant', description: 'Producto base y sus variantes por talla y color.' },
        { id: 'stock', group: 'Inventario', label: 'Store · Stock', description: 'Existencias por variante y por tienda (múltiples locales).' },
        { id: 'sale', group: 'Ventas', label: 'Sale · SaleItem', description: 'Venta con sus líneas; cada línea referencia una variante concreta.' },
        { id: 'fx', group: 'Tasa de cambio', label: 'FxRate', description: 'Tasa vigente (manual o desde Venecambio); se congela en cada venta como fx_usd.' }
      ],
      connections: [
        { from: 'Catálogo', to: 'Inventario', label: 'existencia por tienda' },
        { from: 'Inventario', to: 'Ventas', label: 'descuenta stock' },
        { from: 'Tasa de cambio', to: 'Ventas', label: 'fx_usd congelado' }
      ]
    },

    decisions: [
      {
        title: 'Tasa de cambio congelada por venta',
        detail: 'Cada venta guarda su propio fx_usd en el momento de facturar, para que un cambio posterior en la tasa nunca altere el historial de ventas ya cerradas.'
      },
      {
        title: 'El inventario consume la tasa de Venecambio',
        detail: 'FxRate puede alimentarse automáticamente desde la API de Venecambio (BCV, Binance, promedio), con una tasa manual como respaldo si el servicio externo no responde.'
      },
      {
        title: 'No existe un modelo Payment independiente',
        detail: 'El método de pago (pago móvil, punto, divisas, USDT) es un campo de Sale, no una entidad propia — se mantuvo simple porque cada venta tiene un único pago.'
      }
    ],

    results: [
      'Backend en uso real para una tienda de calzado; demo pública disponible.',
      '[AGREGAR: métricas de uso reales si se quieren mostrar]'
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

    role:
      'Full stack: modelado de datos, permisos por rol y flujo de importación desde Excel; frontend en Angular.',

    keyFeatures: [
      'Carga masiva desde Excel con revisión antes de confirmar',
      'Roles por cargo: Administrador, Director, Almacenista',
      'Historial de movimientos con trazabilidad',
      'Re-validación del Excel original al confirmar la importación'
    ],

    primaryTechnologies: ['Angular', 'Django', 'Django REST Framework', 'JWT'],

    status: 'private',

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

    architecture: {
      summary:
        'La importación de Excel es un flujo lineal de revisión antes de escritura: el servidor nunca confía en el estado del navegador y vuelve a analizar el archivo original antes de tocar la base de datos.',
      layout: 'steps',
      nodes: [
        { id: 'excel', group: 'Excel (.xlsx)', label: 'Archivo Excel', description: 'Planilla de inventario cargada por el usuario.' },
        { id: 'analyze', group: 'Analizar', label: 'POST /imports/analyze/', description: 'Clasifica cada fila (existente, nueva, a revisar o con error), sin escribir en la base de datos.' },
        { id: 'catalogs', group: 'Completar catálogos (opcional)', label: 'POST /imports/complete-catalogs/', description: 'Crea categorías o unidades faltantes y normaliza alias de unidades.' },
        { id: 'overrides', group: 'Ajustes por fila', label: 'Revisión manual', description: 'El usuario decide, fila por fila, si es un producto existente o uno nuevo.' },
        { id: 'confirm', group: 'Confirmar', label: 'POST /imports/confirm/', description: 'Re-analiza el Excel original en el servidor (no confía en el estado del cliente) y re-aplica los ajustes.' },
        { id: 'import', group: 'Importación transaccional', label: 'transaction.atomic()', description: 'Crea o empareja productos y registra cada movimiento de stock en un único batch.' }
      ],
      connections: [
        { from: 'Excel (.xlsx)', to: 'Analizar' },
        { from: 'Analizar', to: 'Completar catálogos (opcional)' },
        { from: 'Completar catálogos (opcional)', to: 'Ajustes por fila' },
        { from: 'Ajustes por fila', to: 'Confirmar' },
        { from: 'Confirmar', to: 'Importación transaccional' }
      ]
    },

    decisions: [
      {
        title: 'La confirmación nunca confía en el estado del navegador',
        detail: 'Al confirmar, el servidor vuelve a leer y clasificar el Excel original desde cero en vez de aceptar el resumen que ya vio el cliente, y solo entonces re-aplica los ajustes manuales.'
      },
      {
        title: 'Un solo rol o ningún permiso',
        detail: 'Administrador, Director y Almacenista se modelan como grupos de Django; si un usuario no tiene exactamente un rol asignado, todos los chequeos de permisos fallan de forma cerrada.'
      },
      {
        title: 'Normalización de unidades por alias',
        detail: 'Variantes de unidad escritas de forma distinta en el Excel (por ejemplo "KILO"/"KILOS") se resuelven a una unidad canónica antes de crear o sumar stock.'
      }
    ],

    results: [
      'En uso operativo por el Ministerio del Poder Popular para Hábitat y Vivienda; al ser un proyecto institucional privado, las demostraciones son presenciales.',
      '[AGREGAR: fechas de inicio/fin del uso, si se pueden compartir]'
    ],

    linksNote:
      'Proyecto privado del Ministerio del Poder Popular para Hábitat y Vivienda. No hay repositorio público; las demostraciones se realizan de forma presencial.',

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
    category: 'Producto de marca · Experiencia web interactiva',

    summary:
      'Landing page de marca para negocios de comida rápida, con identidad visual propia, highlights de producto y ubicación en un mapa interactivo.',

    description:
      'Landing page para Care Perro’s House, una marca de burgers y hotdogs, pensada como base reutilizable para restaurantes de comida rápida y negocios similares. Combina un hero animado con slider de productos, una franja de highlights, una sección de historia de marca y una sección de ubicación con mapa interactivo (Leaflet + OpenStreetMap) enlazado a Google Maps, con horario y calificación. El backend en Django ya define la estructura de categorías y productos del menú, todavía en una fase temprana de desarrollo.',

    challenge:
      'Transmitir una identidad de marca marcada (mascota, ilustraciones a mano, microinteracciones con GSAP) sin perder una estructura reutilizable para cualquier negocio de comida rápida, e integrar una sección de ubicación con mapa real sin depender de servicios de pago.',

    role:
      'Frontend: diseño de interfaz, animaciones con GSAP e interactividad (Astro + React). Backend en Django en fase temprana.',

    keyFeatures: [
      'Hero animado con slider de productos (GSAP)',
      'Mascota interactiva que sigue el cursor',
      'Mapa real con Leaflet + OpenStreetMap y enlace a Google Maps',
      'Animaciones con soporte completo de prefers-reduced-motion'
    ],

    primaryTechnologies: ['Astro', 'React', 'GSAP', 'Leaflet'],

    status: 'in-development',

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

    architecture: {
      summary:
        'El frontend (Astro + React) y el backend (Django) existen como dos piezas independientes todavía sin conectar: el backend ya modela categorías y productos del menú, pero no expone ninguna API que el frontend consuma.',
      layout: 'stages',
      nodes: [
        { id: 'frontend', group: 'Frontend (Astro + React)', label: 'Astro + islas de React', description: 'Sitio estático con animaciones GSAP/ScrollTrigger y mapa Leaflet + OpenStreetMap.' },
        { id: 'backend', group: 'Backend (Django) — aún no conectado', label: 'Modelo de menú', description: 'Categoría y Producto ya definidos en Django. Sin API REST expuesta todavía: no hay rest_framework instalado y urls.py solo registra /admin/.' }
      ],
      connections: []
    },

    decisions: [
      {
        title: 'Animación siempre detrás de prefers-reduced-motion',
        detail: 'Tanto en JS como en CSS, cada animación (slider, mascota, sway continuo) se desactiva o acorta si el usuario tiene activado reducir movimiento.'
      },
      {
        title: 'Mapa real en vez de una imagen estática',
        detail: 'La ubicación usa Leaflet + OpenStreetMap con un enlace directo a Google Maps, en vez de depender de una API de mapas de pago.'
      },
      {
        title: 'Backend definido, todavía sin conectar',
        detail: 'El modelo de datos del menú (categorías, productos) ya existe en Django, pero se dejó explícitamente fuera del alcance actual conectar una API real — evita mostrar una funcionalidad de pedidos que todavía no existe.'
      }
    ],

    linksNote:
      'Repositorio aún no publicado. El proyecto está en desarrollo activo y todavía no tiene despliegue en vivo.',

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
