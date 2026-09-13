import type { CategoriaStack } from "@/types";

/**
 * Stack agrupado por categoría, según el CV.
 *
 * `principal: true` pone la herramienta a tinta plena y con el punto violeta.
 * Están marcadas las que el CV puntúa 5/5, más TypeScript, que es la base de
 * los tres proyectos publicados. Son 8 de 36: si marcas muchas más, el
 * resalte pierde el efecto.
 *
 * La categoría "Incorporando" es deliberada: separar lo que dominas de lo
 * que estás sumando es más creíble que una lista larga y plana, y evita que
 * te pregunten en una entrevista por algo que viste una tarde. Por lo mismo,
 * lo que ya está en producción no va ahí: Next.js (este sitio y Epicentro),
 * Framer Motion (Turnera) y GSAP con Lenis (este sitio) van en Frontend.
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
      { nombre: "Next.js" },
      { nombre: "TanStack Query" },
      { nombre: "Framer Motion" },
      { nombre: "GSAP" },
      { nombre: "Lenis" },
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
      { nombre: "shadcn/ui" },
      { nombre: "Zustand" },
      { nombre: "Storybook" },
      { nombre: "Vitest" },
      { nombre: "GraphQL" },
      { nombre: "Sass" },
    ],
  },
];
