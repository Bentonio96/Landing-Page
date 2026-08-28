import type { CategoriaStack } from "@/types";

/**
 * Stack agrupado por categoría, según el CV.
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
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML semántico",
      "CSS Grid / Flex",
      "TanStack Query",
      "Componentes reutilizables",
      "Design tokens",
      "Mobile first",
      "Accesibilidad WCAG",
    ],
  },
  {
    id: "datos",
    titulo: { es: "Datos y back", en: "Data and back end" },
    items: [
      "Power BI",
      "Power Query",
      "SQL Server",
      "Oracle",
      "REST / SOAP",
      "Python",
      ".NET",
      "Java",
      "IA generativa",
    ],
  },
  {
    id: "herramientas",
    titulo: { es: "Herramientas", en: "Tools" },
    items: [
      "Figma",
      "Git / GitHub",
      "Power Pages",
      "Power Apps",
      "Vercel",
      "Vite",
    ],
  },
  {
    id: "incorporando",
    titulo: { es: "Incorporando", en: "Currently learning" },
    items: [
      "Next.js",
      "shadcn/ui",
      "Zustand",
      "Framer Motion",
      "Storybook",
      "Vitest",
      "GraphQL",
      "Sass",
    ],
  },
];
