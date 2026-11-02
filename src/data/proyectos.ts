import type { Proyecto } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA AGREGAR UN PROYECTO.
 * ─────────────────────────────────────────────────────────────
 *
 * Copia un bloque, cámbiale los datos y listo: la grilla, las animaciones
 * y los enlaces se ajustan solos.
 *
 * Sobre los enlaces:
 *   • `demoUrl` y `repoUrl` son OPCIONALES.
 *   • Si dejas uno vacío o lo borras, ese botón simplemente no se muestra.
 *     Nunca se renderiza un enlace roto.
 *   • Deja la propiedad comentada (o bórrala) mientras no tengas la URL.
 *     No pongas "" ni "#".
 */
export const proyectos: Proyecto[] = [
  {
    slug: "kerr",
    clase: { es: "WebGL · Experiencia", en: "WebGL · Experience" },
    nombre: "Kerr",
    descripcion: {
      es: "Misión tripulada ficticia hacia un agujero negro en rotación. La lente gravitacional se calcula en WebGL2, el scroll cruza el horizonte de eventos y el HUD usa física real. Banda sonora original con Web Audio.",
      en: "A fictional crewed mission to a spinning black hole. The gravitational lensing is computed in WebGL2, the scroll crosses the event horizon and the HUD runs on real physics. Original soundtrack built with Web Audio.",
    },
    tecnologias: ["React 19", "TypeScript", "WebGL2", "GSAP", "Web Audio"],
    fecha: { es: "Octubre 2026", en: "October 2026" },
    imagen: "/proyectos/kerr.jpg",
    demoUrl: "https://kerr-mission.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Kerr-Mission",
  },
  {
    slug: "kinetica",
    clase: { es: "WebGL · Landing", en: "WebGL · Landing" },
    nombre: "Kinetica",
    descripcion: {
      es: "Landing de un festival ficticio de luz, sonido y movimiento: un orbe iridiscente en WebGL2, partículas que forman figuras, tipografía cinética y un carrusel 3D de artistas. En español e inglés, y accesible.",
      en: "Landing page for a fictional festival of light, sound and motion: an iridescent WebGL2 orb, particles that form shapes, kinetic type and a 3D artist carousel. In Spanish and English, and accessible.",
    },
    tecnologias: ["React 19", "TypeScript", "Tailwind CSS", "WebGL2", "GSAP"],
    fecha: { es: "Octubre 2026", en: "October 2026" },
    imagen: "/proyectos/kinetica.jpg",
    demoUrl: "https://kinetica-fest.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Kinetica",
  },
  {
    slug: "epicentro",
    clase: { es: "Datos en vivo", en: "Live data" },
    nombre: "Epicentro",
    descripcion: {
      es: "Rastreador de sismos en Chile en tiempo real con datos del USGS. Mapa, estadísticas de los últimos 30 días y un listado que funciona entero con teclado y lector de pantalla.",
      en: "Real-time earthquake tracker for Chile using USGS data. A map, thirty-day statistics, and a listing that works end to end with a keyboard and a screen reader.",
    },
    tecnologias: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "MapLibre",
      "Recharts",
    ],
    fecha: { es: "Agosto 2026", en: "August 2026" },
    imagen: "/proyectos/epicentro.jpg",
    demoUrl: "https://epicentro-sigma.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Epicentro",
  },
  {
    slug: "barometro",
    clase: { es: "Datos · Dashboard", en: "Data · Dashboard" },
    nombre: "Barómetro",
    descripcion: {
      es: "Indicadores económicos de Chile con datos de mindicador.cl. Cada serie respeta su propia periodicidad: la UF es diaria, el dólar solo de días hábiles y el IPC mensual, así que ninguna variación compara peras con manzanas.",
      en: "Chile's economic indicators with data from mindicador.cl. Each series keeps its own frequency: the UF is daily, the dollar only on business days and CPI monthly, so no variation compares apples to oranges.",
    },
    tecnologias: ["Next.js 15", "TypeScript", "Tailwind CSS", "Recharts"],
    fecha: { es: "Septiembre 2026", en: "September 2026" },
    imagen: "/proyectos/barometro.jpg",
    demoUrl: "https://barometro-hazel.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Barometro",
  },
  {
    slug: "turnera",
    clase: { es: "Sitio de producto", en: "Product site" },
    nombre: "Turnera",
    descripcion: {
      es: "Sitio de producto para una app ficticia de gestión de turnos en clínicas pequeñas. El producto no existe; el rigor visual y el presupuesto de rendimiento sí.",
      en: "Product site for a fictional appointment-scheduling app for small clinics. The product isn't real; the visual craft and performance budget are.",
    },
    tecnologias: [
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
    fecha: { es: "Agosto 2026", en: "August 2026" },
    imagen: "/proyectos/turnera.jpg",
    demoUrl: "https://turnera-iota.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Turnera",
  },
  {
    slug: "centinela",
    clase: { es: "Consola · App", en: "Console · App" },
    nombre: "Centinela",
    descripcion: {
      es: "Consola de operaciones de seguridad. Siete vistas sobre un mismo conjunto de incidentes: el panel del turno, la tabla de triaje, un tablero kanban, el calendario, la analítica, el equipo y los ajustes.",
      en: "Security operations console. Seven views over a single set of incidents: the shift panel, the triage table, a kanban board, the calendar, analytics, the team and settings.",
    },
    tecnologias: ["React 19", "TypeScript", "Tailwind CSS", "Vite"],
    fecha: { es: "Agosto 2026", en: "August 2026" },
    imagen: "/proyectos/centinela.jpg",
    demoUrl: "https://centinela-rho.vercel.app",
    repoUrl: "https://github.com/Bentonio96/Centinela",
  },
  {
    // Proyecto sacado de tu CV. Es trabajo interno de CMPC: no tiene demo
    // pública ni repositorio, así que la tarjeta se renderiza sin botones.
    // Si prefieres dejar solo los tres públicos, borra este bloque.
    slug: "portal-ciberoperaciones",
    clase: { es: "Interno · CMPC", en: "Internal · CMPC" },
    nombre: "Portal de Ciberoperaciones",
    descripcion: {
      es: "Portal interno de CMPC que centraliza la operación diaria del área y funciona como catálogo de servicios para incidentes de TI y OT.",
      en: "Internal CMPC portal that centralises the team's daily operation and works as a service catalogue for IT and OT incidents.",
    },
    tecnologias: [
      "Power Pages",
      "Power Apps",
      "Power BI",
      "Chatbot IA",
      "UX/UI",
    ],
    // Periodo de la práctica en CMPC, donde se diseñó y puso en marcha.
    fecha: { es: "Enero — Junio 2026", en: "January — June 2026" },
    // Sin demoUrl ni repoUrl: es un sistema interno.
  },
];
