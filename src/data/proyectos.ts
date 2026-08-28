import type { Proyecto } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA AGREGAR UN PROYECTO.
 * ─────────────────────────────────────────────────────────────
 *
 * Copia un bloque, cámbiale los datos y listo: la grilla, las
 * animaciones y los enlaces se ajustan solos.
 *
 * Sobre los enlaces:
 *   • `demoUrl` y `repoUrl` son OPCIONALES.
 *   • Si dejas uno vacío o lo borras, ese botón simplemente no
 *     se muestra. Nunca se renderiza un enlace roto.
 *   • Deja la propiedad comentada (o bórrala) mientras no tengas
 *     la URL. No pongas "" ni "#".
 */
export const proyectos: Proyecto[] = [
  {
    slug: "proyecto-1",
    nombre: "Proyecto 1",
    descripcion: {
      es: "Describe en una o dos líneas qué resuelve este proyecto y para quién.",
      en: "Describe in one or two lines what this project solves and for whom.",
    },
    tecnologias: ["Next.js", "TypeScript", "Tailwind CSS"],
    anio: "2026",
    // demoUrl: "https://...",   ← pega aquí la demo en vivo
    // repoUrl: "https://github.com/Bentonio96/...",  ← y aquí el repo
  },
  {
    slug: "proyecto-2",
    nombre: "Proyecto 2",
    descripcion: {
      es: "Describe en una o dos líneas qué resuelve este proyecto y para quién.",
      en: "Describe in one or two lines what this project solves and for whom.",
    },
    tecnologias: ["React", "JavaScript", "CSS"],
    anio: "2026",
    // demoUrl: "https://...",
    // repoUrl: "https://github.com/Bentonio96/...",
  },
  {
    slug: "proyecto-3",
    nombre: "Proyecto 3",
    descripcion: {
      es: "Describe en una o dos líneas qué resuelve este proyecto y para quién.",
      en: "Describe in one or two lines what this project solves and for whom.",
    },
    tecnologias: ["Python", "SQL", "Power BI"],
    anio: "2025",
    // demoUrl: "https://...",
    // repoUrl: "https://github.com/Bentonio96/...",
  },
  {
    slug: "proyecto-4",
    nombre: "Proyecto 4",
    descripcion: {
      es: "Describe en una o dos líneas qué resuelve este proyecto y para quién.",
      en: "Describe in one or two lines what this project solves and for whom.",
    },
    tecnologias: ["Next.js", "TypeScript", "Framer Motion"],
    anio: "2025",
    // demoUrl: "https://...",
    // repoUrl: "https://github.com/Bentonio96/...",
  },
];
