import type { Certificacion, IdiomaHablado, Texto } from "@/types";

/**
 * URL pública del sitio. Se usa en metadata, Open Graph y sitemap.
 *
 * Define NEXT_PUBLIC_SITIO_URL en Vercel (Settings → Environment Variables)
 * con tu dominio final. El valor de abajo es solo el respaldo.
 */
export const SITIO_URL =
  process.env.NEXT_PUBLIC_SITIO_URL?.replace(/\/$/, "") ??
  "https://benjaminpena.vercel.app";

export const perfil = {
  nombre: "Benjamín Peña Díaz",
  nombreCorto: "Benjamín Peña",
  ubicacion: "Ñuñoa, Santiago, Chile",
  email: "benja.diaz.2911@gmail.com",
  telefono: "+56 9 8522 0071",
  /** Formato E.164, para el enlace tel: */
  telefonoEnlace: "+56985220071",
  github: "https://github.com/Bentonio96",
  githubUsuario: "Bentonio96",
  /** El slug lleva tildes y ñ: se guarda percent-encoded para que el href sea válido. */
  linkedin: "https://www.linkedin.com/in/benjam%C3%ADn-pe%C3%B1a",
  linkedinVisible: "linkedin.com/in/benjamín-peña",
  /** Vive en /public. Sin tildes en el nombre para no ensuciar la URL. */
  cv: "/CV-Benjamin-Pena.pdf",
} as const;

export const idiomasHablados: IdiomaHablado[] = [
  {
    nombre: { es: "Español", en: "Spanish" },
    nivel: { es: "Nativo", en: "Native" },
  },
  {
    nombre: { es: "Inglés", en: "English" },
    nivel: { es: "Intermedio-avanzado", en: "Upper intermediate" },
  },
];

export const certificaciones: Certificacion[] = [
  {
    nombre: "Getting Started with AI · Digital Mindset",
    emisor: "IBM",
    fecha: { es: "Marzo 2026", en: "March 2026" },
  },
  {
    nombre: "Python Essentials 1 & 2",
    emisor: "Cisco",
    fecha: { es: "Diciembre 2025", en: "December 2025" },
  },
  {
    nombre: "Introduction to Cybersecurity",
    emisor: "Cisco",
    fecha: { es: "Noviembre 2025", en: "November 2025" },
  },
];

/** Metadata por idioma, para <title>, description y Open Graph. */
export const seo: Record<"es" | "en", { titulo: string; descripcion: string }> & {
  palabrasClave: Texto;
} = {
  es: {
    titulo: "Benjamín Peña — Desarrollador Frontend",
    descripcion:
      "Desarrollador frontend en Santiago de Chile. Construyo interfaces web con React, TypeScript y Tailwind, y las llevo a producción. Disponible para proyectos freelance.",
  },
  en: {
    titulo: "Benjamín Peña — Frontend Developer",
    descripcion:
      "Frontend developer based in Santiago, Chile. I build web interfaces with React, TypeScript and Tailwind, and ship them to production. Available for freelance work.",
  },
  palabrasClave: {
    es: "desarrollador frontend, React, TypeScript, Tailwind, Next.js, Power Pages, freelance, Santiago, Chile",
    en: "frontend developer, React, TypeScript, Tailwind, Next.js, Power Pages, freelance, Santiago, Chile",
  },
};
