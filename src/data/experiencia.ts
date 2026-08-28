import type { Hito } from "@/types";

/**
 * Línea de tiempo, del hito más reciente al más antiguo.
 *
 * TODO (Benjamín): confirma los períodos exactos. Los de abajo son
 * consistentes con lo que me contaste, pero no me diste meses.
 */
export const experiencia: Hito[] = [
  {
    id: "tesis",
    organizacion: "Universidad Andrés Bello",
    rol: {
      es: "Tesista · Ingeniería Civil en Informática",
      en: "Thesis student · Computer Engineering",
    },
    periodo: { es: "2026 — Egreso noviembre 2026", en: "2026 — Graduating Nov 2026" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Cursando el proyecto de título mientras tomo trabajo freelance de frontend.",
      en: "Working on my thesis project while taking on freelance frontend work.",
    },
    actual: true,
  },
  {
    id: "cmpc-ciberseguridad",
    organizacion: "CMPC",
    rol: {
      es: "Práctica · Cybersecurity Operations TI/OT",
      en: "Internship · IT/OT Cybersecurity Operations",
    },
    periodo: { es: "2025", en: "2025" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Desarrollé un portal interno para el equipo de operaciones de ciberseguridad, que hoy sigue en uso. Trabajé sobre entornos TI y OT.",
      en: "Built an internal portal for the cybersecurity operations team, still in use today. Worked across IT and OT environments.",
    },
  },
  {
    id: "cmpc-datos",
    organizacion: "CMPC",
    rol: { es: "Analista de datos", en: "Data analyst" },
    periodo: { es: "2024 — 2025", en: "2024 — 2025" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Procesamiento y análisis de datos operacionales, y reportería para equipos internos.",
      en: "Processing and analysis of operational data, plus reporting for internal teams.",
    },
  },
  {
    id: "unab",
    organizacion: "Universidad Andrés Bello",
    rol: {
      es: "Ingeniería Civil en Informática",
      en: "Computer Engineering",
    },
    periodo: { es: "2021 — 2026", en: "2021 — 2026" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Formación en desarrollo de software, bases de datos, redes y gestión de proyectos.",
      en: "Training in software development, databases, networking and project management.",
    },
  },
];
