import type { CategoriaStack } from "@/types";

/**
 * Stack agrupado por categoría, según el CV.
 *
 * `principal: true` pinta la herramienta con el color de acento. Están
 * marcadas las que el CV puntúa 5/5, más TypeScript, que es la base de los
 * tres proyectos publicados. Son 8 de 34: si marcas muchas más, el resalte
 * pierde el efecto.
 *
 * La categoría "Incorporando" es deliberada: separar lo que dominas de lo
 * que estás sumando es más creíble que una lista larga y plana, y evita que
 * te pregunten en una entrevista por algo que viste una tarde.
 */
export const stack: CategoriaStack[] = [
  {
    id: "frontend",
    titulo: { es: "Frontend", en: "Frontend" },
    items: [
      { nombre: "React", principal: true },
      { nombre: "TypeScript", principal: true },
      { nombre: "JavaScript", principal: true },
      { nombre: "Tailwind CSS", principal: true },
      { nombre: "HTML semántico" },
      { nombre: "CSS Grid / Flex" },
      { nombre: "TanStack Query" },
      { nombre: "Componentes reutilizables" },
      { nombre: "Design tokens" },
      { nombre: "Mobile first" },
      { nombre: "Accesibilidad WCAG" },
    ],
  },
  {
    id: "datos",
    titulo: { es: "Datos y back", en: "Data and back end" },
    items: [
      { nombre: "Power BI", principal: true },
      { nombre: "Power Query", principal: true },
      { nombre: "SQL Server" },
      { nombre: "Oracle" },
      { nombre: "REST / SOAP" },
      { nombre: "Python" },
      { nombre: ".NET" },
      { nombre: "Java" },
      { nombre: "IA generativa" },
    ],
  },
  {
    id: "herramientas",
    titulo: { es: "Herramientas", en: "Tools" },
    items: [
      { nombre: "Figma", principal: true },
      { nombre: "Power Pages", principal: true },
      { nombre: "Git / GitHub" },
      { nombre: "Power Apps" },
      { nombre: "Vercel" },
      { nombre: "Vite" },
    ],
  },
  {
    id: "incorporando",
    titulo: { es: "Incorporando", en: "Currently learning" },
    // Ninguna se resalta: por definición no son las principales.
    items: [
      { nombre: "Next.js" },
      { nombre: "shadcn/ui" },
      { nombre: "Zustand" },
      { nombre: "Framer Motion" },
      { nombre: "Storybook" },
      { nombre: "Vitest" },
      { nombre: "GraphQL" },
      { nombre: "Sass" },
    ],
  },
];
