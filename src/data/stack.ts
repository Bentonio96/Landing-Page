import type { CategoriaStack } from "@/types";

/**
 * Stack agrupado por categoría. Ajusta las listas a lo que realmente usas:
 * es mejor una lista corta y honesta que una larga y decorativa.
 */
export const stack: CategoriaStack[] = [
  {
    id: "frontend",
    titulo: { es: "Frontend", en: "Frontend" },
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML semántico",
      "CSS moderno",
      "Framer Motion",
      "Accesibilidad (WCAG)",
    ],
  },
  {
    id: "datos",
    titulo: { es: "Datos", en: "Data" },
    items: ["SQL", "Python", "Pandas", "Power BI", "Excel avanzado"],
  },
  {
    id: "herramientas",
    titulo: { es: "Herramientas", en: "Tools" },
    items: ["Git", "GitHub", "Vercel", "Figma", "VS Code", "Linux"],
  },
];
