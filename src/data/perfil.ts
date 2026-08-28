import type { Texto } from "@/types";

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
} as const;

/** Metadata por idioma, para <title>, description y Open Graph. */
export const seo: Record<"es" | "en", { titulo: string; descripcion: string }> & {
  palabrasClave: Texto;
} = {
  es: {
    titulo: "Benjamín Peña — Desarrollador Frontend",
    descripcion:
      "Desarrollador frontend en Santiago de Chile. Construyo interfaces rápidas y accesibles con React, Next.js y TypeScript. Disponible para proyectos freelance.",
  },
  en: {
    titulo: "Benjamín Peña — Frontend Developer",
    descripcion:
      "Frontend developer based in Santiago, Chile. I build fast, accessible interfaces with React, Next.js and TypeScript. Available for freelance work.",
  },
  palabrasClave: {
    es: "desarrollador frontend, React, Next.js, TypeScript, freelance, Santiago, Chile",
    en: "frontend developer, React, Next.js, TypeScript, freelance, Santiago, Chile",
  },
};
