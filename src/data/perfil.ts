import type { Certificacion, IdiomaHablado, Texto } from "@/types";

/**
 * URL pública del sitio. Se usa en las canónicas, hreflang, Open Graph,
 * sitemap, robots y los datos estructurados.
 *
 * Se resuelve sola, en este orden:
 *
 *   1. NEXT_PUBLIC_SITIO_URL — variable propia de este proyecto, no de
 *      Vercel. Defínela solo si tienes dominio propio, con protocolo:
 *      "https://benjaminpena.cl". Manda por sobre todo lo demás.
 *
 *   2. VERCEL_PROJECT_PRODUCTION_URL — la inyecta Vercel con el dominio
 *      de producción del proyecto. Es estable entre despliegues y viene
 *      sin protocolo. Gracias a esto el sitio queda correcto en Vercel
 *      sin configurar nada.
 *
 *   3. VERCEL_URL — URL única de ese despliegue. Sirve para que los
 *      previews se apunten a sí mismos en vez de a producción.
 *
 *   4. localhost, para desarrollo.
 *
 * Se lee solo en el servidor (metadata, sitemap, robots y el JSON-LD),
 * así que las variables sin prefijo NEXT_PUBLIC_ funcionan bien aquí.
 * Si algún día importas `perfil` desde un componente con "use client",
 * solo la opción 1 seguirá resolviendo.
 */
function resolverUrlDelSitio(): string {
  const propia = process.env.NEXT_PUBLIC_SITIO_URL;
  if (propia) return propia.replace(/\/+$/, "");

  const produccion = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (produccion) return `https://${produccion.replace(/\/+$/, "")}`;

  const despliegue = process.env.VERCEL_URL;
  if (despliegue) return `https://${despliegue.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITIO_URL = resolverUrlDelSitio();

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
