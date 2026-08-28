import type { Hito } from "@/types";

/** Línea de tiempo, del hito más reciente al más antiguo. Fechas según el CV. */
export const experiencia: Hito[] = [
  {
    id: "tesis",
    organizacion: "Universidad Andrés Bello",
    rol: {
      es: "Tesista · Ingeniería Civil en Informática",
      en: "Thesis student · Computer Engineering",
    },
    periodo: {
      es: "2026 — Egreso noviembre 2026",
      en: "2026 — Graduating November 2026",
    },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Triple Resolutive Approach: metaheurística TDHC adaptada a cinco problemas de optimización combinatoria, con un algoritmo genético memético en Python. Profesor guía: Gustavo Gatica. En paralelo, tomo proyectos freelance de frontend.",
      en: "Triple Resolutive Approach: a TDHC metaheuristic adapted to five combinatorial optimisation problems, with a memetic genetic algorithm in Python. Supervisor: Gustavo Gatica. In parallel, I take on freelance frontend work.",
    },
    actual: true,
  },
  {
    id: "cmpc-ciberseguridad",
    organizacion: "CMPC",
    rol: {
      es: "Práctica profesional · Cybersecurity Operations TI/OT",
      en: "Internship · IT/OT Cybersecurity Operations",
    },
    periodo: { es: "Enero — Junio 2026", en: "January — June 2026" },
    lugar: "Santiago, Chile · Híbrido",
    descripcion: {
      es: "Desarrollé el portal interno del área con Power Pages y Power Apps, desde el diseño de la interfaz hasta su puesta en marcha; hoy sigue en uso. Automaticé reportes en Power BI sobre los tickets de IBM BMC Helix, y monitoreé incidentes con CrowdStrike Falcon bajo marcos ITIL.",
      en: "Built the team's internal portal with Power Pages and Power Apps, from interface design through to launch; it's still in use today. Automated Power BI reporting over IBM BMC Helix tickets, and monitored incidents with CrowdStrike Falcon under ITIL frameworks.",
    },
  },
  {
    id: "cmpc-datos",
    organizacion: "CMPC",
    rol: {
      es: "Analista de datos · Prácticas I y II",
      en: "Data analyst · Internships I and II",
    },
    periodo: { es: "Enero 2025 — Enero 2026", en: "January 2025 — January 2026" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Dashboards y modelos de datos para End User Care TI y áreas transversales. Transformación de datos con Power Query y automatización de reportes con apoyo de IA, reemplazando un proceso manual de consolidación.",
      en: "Dashboards and data models for End User Care IT and cross-functional teams. Data transformation with Power Query and AI-assisted report automation, replacing a manual consolidation process.",
    },
  },
  {
    id: "unab",
    organizacion: "Universidad Andrés Bello",
    rol: {
      es: "Ingeniería Civil en Informática",
      en: "Computer Engineering",
    },
    periodo: { es: "2022 — 2026", en: "2022 — 2026" },
    lugar: "Santiago, Chile",
    descripcion: {
      es: "Desarrollo full stack (React, HTML/CSS, JavaScript, UX/UI, MVC, REST/SOAP), análisis de datos con Python y ciberseguridad aplicada.",
      en: "Full stack development (React, HTML/CSS, JavaScript, UX/UI, MVC, REST/SOAP), data analysis with Python and applied cybersecurity.",
    },
  },
];
