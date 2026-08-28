import type { Idioma } from "@/types";

/**
 * Todo el texto de interfaz del sitio, en ambos idiomas.
 * El contenido (proyectos, stack, experiencia) vive en /src/data.
 */
const diccionario = {
  es: {
    saltarAlContenido: "Saltar al contenido",
    nav: {
      sobreMi: "Sobre mí",
      stack: "Stack",
      proyectos: "Proyectos",
      experiencia: "Experiencia",
      contacto: "Contacto",
      abrirMenu: "Abrir menú de navegación",
      cerrarMenu: "Cerrar menú de navegación",
    },
    tema: {
      etiqueta: "Cambiar a modo oscuro",
      etiquetaClaro: "Cambiar a modo claro",
      generico: "Cambiar entre modo claro y oscuro",
    },
    idioma: {
      etiqueta: "Ver este sitio en inglés",
      codigo: "EN",
    },
    hero: {
      rol: "Desarrollador Frontend",
      disponible: "Disponible para proyectos freelance",
      intro:
        "Construyo interfaces rápidas y accesibles con React, Next.js y TypeScript. Vengo de datos y ciberseguridad, así que me importa que las cosas funcionen de verdad, no solo que se vean bien.",
      verProyectos: "Ver proyectos",
      escribirme: "Escríbeme",
      altFoto:
        "Benjamín Peña Díaz, de perfil y con lentes de sol, frente a un cerro verde bajo un cielo despejado.",
    },
    sobreMi: {
      etiqueta: "Sobre mí",
      titulo: "Quién soy",
      parrafos: [
        "Soy desarrollador frontend y estoy terminando Ingeniería Civil en Informática en la Universidad Andrés Bello. Egreso en noviembre de 2026 y hoy tomo proyectos freelance.",
        "Antes de dedicarme al frontend pasé un año y medio en CMPC. Empecé como analista de datos y después hice mi práctica en Cybersecurity Operations TI/OT, donde construí un portal interno que el equipo sigue usando. De ahí me quedaron dos costumbres: entender el problema antes de escribir código, y tomarme en serio las herramientas que otras personas van a usar todos los días.",
        "Me interesa el detalle: que una interfaz cargue rápido, que se pueda recorrer con el teclado, que aguante en un teléfono de gama media. Trabajo principalmente con React, Next.js y TypeScript.",
      ],
    },
    stack: {
      etiqueta: "Stack",
      titulo: "Con qué trabajo",
      bajada:
        "Las herramientas que uso a diario, agrupadas por lo que resuelven.",
    },
    proyectos: {
      etiqueta: "Proyectos",
      titulo: "Trabajo seleccionado",
      bajada: "Algunas cosas que he construido.",
      verSitio: "Ver sitio",
      verCodigo: "Ver código",
      enlaceExterno: "(se abre en una pestaña nueva)",
      vacio:
        "Todavía no hay proyectos publicados. Vuelve pronto.",
      tecnologiasDe: "Tecnologías usadas en",
    },
    experiencia: {
      etiqueta: "Experiencia",
      titulo: "Por dónde he pasado",
      actual: "Actualidad",
    },
    contacto: {
      etiqueta: "Contacto",
      titulo: "Hablemos",
      bajada:
        "¿Tienes un proyecto en mente? Escríbeme y te respondo dentro de un día hábil.",
      email: "Correo",
      telefono: "Teléfono",
      ubicacion: "Ubicación",
      botonCorreo: "Enviar un correo",
      asuntoCorreo: "Proyecto freelance",
      cuerpoCorreo:
        "Hola Benjamín,\n\nTe escribo porque me gustaría conversar sobre un proyecto.\n\n",
    },
    pie: {
      derechos: "Hecho en Santiago de Chile.",
      construidoCon: "Construido con Next.js y Tailwind CSS.",
      volverArriba: "Volver arriba",
    },
    noEncontrado: {
      titulo: "Página no encontrada",
      bajada: "El enlace que seguiste no lleva a ninguna parte.",
      volver: "Volver al inicio",
    },
  },

  en: {
    saltarAlContenido: "Skip to content",
    nav: {
      sobreMi: "About",
      stack: "Stack",
      proyectos: "Projects",
      experiencia: "Experience",
      contacto: "Contact",
      abrirMenu: "Open navigation menu",
      cerrarMenu: "Close navigation menu",
    },
    tema: {
      etiqueta: "Switch to dark mode",
      etiquetaClaro: "Switch to light mode",
      generico: "Toggle light and dark mode",
    },
    idioma: {
      etiqueta: "Ver este sitio en español",
      codigo: "ES",
    },
    hero: {
      rol: "Frontend Developer",
      disponible: "Available for freelance work",
      intro:
        "I build fast, accessible interfaces with React, Next.js and TypeScript. I come from data and cybersecurity, so I care that things actually work — not just that they look good.",
      verProyectos: "View projects",
      escribirme: "Get in touch",
      altFoto:
        "Benjamín Peña Díaz in profile, wearing sunglasses, standing in front of a green hillside under a clear sky.",
    },
    sobreMi: {
      etiqueta: "About",
      titulo: "Who I am",
      parrafos: [
        "I'm a frontend developer, currently finishing a Computer Engineering degree at Universidad Andrés Bello in Santiago. I graduate in November 2026 and I'm taking on freelance work.",
        "Before moving into frontend I spent a year and a half at CMPC. I started as a data analyst and later did my internship in IT/OT Cybersecurity Operations, where I built an internal portal the team still uses today. That job left me with two habits: understanding the problem before writing any code, and taking seriously the tools other people depend on every day.",
        "I care about the details — that an interface loads fast, that you can navigate it with a keyboard, that it holds up on a mid-range phone. I work mainly with React, Next.js and TypeScript.",
      ],
    },
    stack: {
      etiqueta: "Stack",
      titulo: "What I work with",
      bajada: "The tools I use day to day, grouped by what they solve.",
    },
    proyectos: {
      etiqueta: "Projects",
      titulo: "Selected work",
      bajada: "A few things I've built.",
      verSitio: "View site",
      verCodigo: "View code",
      enlaceExterno: "(opens in a new tab)",
      vacio: "No projects published yet. Check back soon.",
      tecnologiasDe: "Technologies used in",
    },
    experiencia: {
      etiqueta: "Experience",
      titulo: "Where I've been",
      actual: "Present",
    },
    contacto: {
      etiqueta: "Contact",
      titulo: "Let's talk",
      bajada:
        "Have a project in mind? Send me a note and I'll reply within one business day.",
      email: "Email",
      telefono: "Phone",
      ubicacion: "Location",
      botonCorreo: "Send an email",
      asuntoCorreo: "Freelance project",
      cuerpoCorreo:
        "Hi Benjamín,\n\nI'm reaching out because I'd like to talk about a project.\n\n",
    },
    pie: {
      derechos: "Made in Santiago, Chile.",
      construidoCon: "Built with Next.js and Tailwind CSS.",
      volverArriba: "Back to top",
    },
    noEncontrado: {
      titulo: "Page not found",
      bajada: "The link you followed doesn't lead anywhere.",
      volver: "Back to home",
    },
  },
} as const;

export type Diccionario = (typeof diccionario)["es"];

export function obtenerDiccionario(idioma: Idioma): Diccionario {
  return diccionario[idioma] as Diccionario;
}
