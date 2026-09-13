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
      rol: "Desarrollador Frontend & Data Analyst",
      /** Segunda mitad del titular: las tres herramientas del lado de datos. */
      herramientas: "Power Apps · Power BI · Python",
      disponible: "Disponible para full-time y freelance",
      intro:
        "Construyo interfaces web y las llevo a producción con React, TypeScript y Tailwind. Vengo del análisis de datos, así que también me muevo en Power BI, Power Apps y Python cuando el proyecto lo pide.",
      verProyectos: "Ver proyectos",
      altFoto:
        "Benjamín Peña Díaz, de perfil y con lentes de sol, frente a un cerro. Fotografía en blanco y negro.",
    },
    sobreMi: {
      etiqueta: "Sobre mí",
      titulo: "Quién soy",
      parrafos: [
        "Soy desarrollador frontend y analista de datos. Estoy terminando Ingeniería Civil en Informática en la Universidad Andrés Bello, egreso en noviembre de 2026, y busco mi próximo rol full-time mientras tomo proyectos freelance.",
        "Pasé un año y medio en CMPC: primero como analista de datos, armando tableros en Power BI, y después en Cybersecurity Operations TI/OT, donde diseñé y construí el portal interno del área, desde la arquitectura de la interfaz hasta su puesta en marcha.",
        "Entrego interfaces terminadas, no maquetas. Traduzco un diseño de Figma a una interfaz responsive y accesible, y defino la jerarquía visual cuando el diseño todavía no existe.",
        "El frontend es mi foco, pero también tomo un tablero en Power BI, una app interna en Power Apps o un script en Python. Haber trabajado de los dos lados me ayuda a construir interfaces que entienden los datos que muestran.",
      ],
      /** La frase que cierra el tercer párrafo, sacada a cita de cartel. */
      cita: {
        antes: "“Me aseguro de que el producto final se vea bien y ",
        resaltado: "se sienta sólido",
        despues: ".”",
        pie: "Tanto en lo visual como en lo técnico",
      },
      idiomas: "Idiomas",
    },
    stack: {
      etiqueta: "Stack",
      titulo: "Con qué trabajo",
      bajada:
        "Las herramientas que uso a diario, agrupadas por lo que resuelven. Las principales van resaltadas, y lo que estoy sumando va aparte.",
      principal: "herramienta principal",
    },
    proyectos: {
      etiqueta: "Proyectos",
      titulo: "Trabajo seleccionado",
      bajada: "Algunas cosas que he construido.",
      verSitio: "Ver sitio",
      verCodigo: "Ver código",
      enlaceExterno: "(se abre en una pestaña nueva)",
      vacio: "Todavía no hay proyectos publicados. Vuelve pronto.",
      tecnologiasDe: "Tecnologías usadas en",
      captura: "Captura del sitio de",
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
      botonCorreo: "Copiar mi correo",
      correoCopiado: "Dirección de correo copiada al portapapeles.",
      correoFallo: "No pudimos copiarla. Mi correo es:",
      /** Solo para lectores de pantalla, en escritorio: ahí la fila copia. */
      correoFilaCopia: "(copia la dirección al portapapeles)",
      descargarCV: "Descargar CV",
      cvFormato: "(PDF)",
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
      rol: "Frontend Developer & Data Analyst",
      herramientas: "Power Apps · Power BI · Python",
      disponible: "Available for full-time and freelance work",
      intro:
        "I build web interfaces and ship them to production with React, TypeScript and Tailwind. I come from data analysis, so I'm just as comfortable in Power BI, Power Apps and Python when a project calls for it.",
      verProyectos: "View projects",
      altFoto:
        "Benjamín Peña Díaz in profile, wearing sunglasses, in front of a hillside. Black and white photograph.",
    },
    sobreMi: {
      etiqueta: "About",
      titulo: "Who I am",
      parrafos: [
        "I'm a frontend developer and data analyst. I'm finishing a Computer Engineering degree at Universidad Andrés Bello in Santiago, graduating in November 2026, and I'm looking for my next full-time role while taking on freelance work.",
        "I spent a year and a half at CMPC: first as a data analyst building Power BI dashboards, then in IT/OT Cybersecurity Operations, where I designed and built the team's internal portal, from the interface architecture through to launch.",
        "I ship finished interfaces, not mockups. I turn a Figma design into a responsive, accessible interface — and define the visual hierarchy myself when the design doesn't exist yet.",
        "Frontend is my focus, but I'll also take on a Power BI dashboard, an internal Power Apps tool or a Python script. Having worked on both sides helps me build interfaces that understand the data they show.",
      ],
      cita: {
        antes: "“I make sure the final product looks good and ",
        resaltado: "feels solid",
        despues: ".”",
        pie: "Both visually and technically",
      },
      idiomas: "Languages",
    },
    stack: {
      etiqueta: "Stack",
      titulo: "What I work with",
      bajada:
        "The tools I use day to day, grouped by what they solve. The main ones are highlighted, and what I'm still picking up is listed separately.",
      principal: "core tool",
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
      captura: "Screenshot of the site for",
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
      botonCorreo: "Copy my email",
      correoCopiado: "Email address copied to your clipboard.",
      correoFallo: "Couldn't copy it. My address is:",
      correoFilaCopia: "(copies the address to the clipboard)",
      descargarCV: "Download CV",
      cvFormato: "(PDF, in Spanish)",
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
