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
    slug: "epicentro",
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
    slug: "turnera",
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
    nombre: "Centinela",
    descripcion: {
      es: "Dashboard de monitoreo de incidentes de ciberseguridad. Una sola pantalla donde el analista ve qué hay abierto, qué es crítico y qué conviene mirar ahora.",
      en: "Security incident monitoring dashboard. A single screen where an analyst sees what's open, what's critical and what to look at next.",
    },
    tecnologias: [
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Recharts",
      "Vite",
    ],
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
    nombre: "Portal de Ciberoperaciones",
    descripcion: {
      es: "Portal interno de CMPC que centraliza la operación diaria del área y funciona como catálogo de servicios para incidentes de TI y OT. En uso desde 2026.",
      en: "Internal CMPC portal that centralises the team's daily operation and works as a service catalogue for IT and OT incidents. In production since 2026.",
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
