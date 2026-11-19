import type { Idioma } from "@/types";

/**
 * Todo el texto de interfaz del sitio, en ambos idiomas.
 * El contenido (proyectos, stack, experiencia) vive en /src/data.
 *
 * Los fragmentos entre **dobles asteriscos** se pintan en negrita
 * (ver components/ui/Negritas.tsx): así el texto sigue siendo una sola
 * cadena por idioma y no se parte en piezas sueltas.
 */
const diccionario = {
  es: {
    saltarAlContenido: "Saltar al contenido",
    nav: {
      inicio: "inicio",
      sobreMi: "Sobre mí",
      stack: "Stack",
      proyectos: "Proyectos",
      experiencia: "Experiencia",
      contacto: "Contacto",
      menu: "Abrir el menú",
      cerrarMenu: "Cerrar el menú",
      explorar: "Explorar",
    },
    tema: {
      etiqueta: "Cambiar a modo oscuro",
      etiquetaClaro: "Cambiar a modo claro",
      generico: "Cambiar entre modo claro y oscuro",
    },
    idioma: {
      etiqueta: "Ver este sitio en inglés",
      codigo: "EN",
      nombre: "English",
    },
    hero: {
      rol: "Software Engineer",
      etiqueta: "full stack y datos",
      disponible: "Disponible para proyectos freelance",
      saludo: "Hola, soy Benjamín.",
      subtitulo: "Software Engineer, de las interfaces a los datos.",
      actualmente: "Ahora mismo",
      actual: "Tesista en la Universidad Andrés Bello",
      actualDetalle: "Egreso en noviembre de 2026",
      intro:
        "Construyo **interfaces web** y las llevo a **producción** con React, TypeScript y Tailwind. Vengo del **análisis de datos**, así que también me muevo en Power BI, Power Apps y Python cuando el proyecto lo pide.",
      verProyectos: "Ver proyectos",
      descargarCV: "Descargar CV",
      altFoto:
        "Benjamín Peña Díaz, de perfil y con lentes de sol, frente a un cerro. Fotografía en blanco y negro.",
    },
    sobreMi: {
      titulo: "Quién soy",
      parrafos: [
        "Soy Software Engineer, con base en el desarrollo full stack y el análisis de datos. Estoy terminando Ingeniería Civil en Informática en la Universidad Andrés Bello, egreso en noviembre de 2026, y estoy disponible para proyectos freelance.",
        "Pasé un año y medio en CMPC: primero como analista de datos, armando tableros en Power BI, y después en Cybersecurity Operations TI/OT, donde diseñé y construí el portal interno del área, desde la arquitectura de la interfaz hasta su puesta en marcha.",
        "Entrego interfaces terminadas, no maquetas. Traduzco un diseño de Figma a una interfaz responsive y accesible, y defino la jerarquía visual cuando el diseño todavía no existe.",
        "Construyo de punta a punta, del frontend al backend, y también tomo un tablero en Power BI, una app interna en Power Apps o un script en Python. Haber trabajado de los dos lados me ayuda a construir interfaces que entienden los datos que muestran.",
      ],
      cita: "Me aseguro de que el producto final se vea bien y se sienta sólido, tanto en lo visual como en lo técnico.",
      idiomas: "Idiomas",
    },
    stack: {
      titulo: "Stack",
      bajada: "Las herramientas detrás de mi trabajo, agrupadas por lo que resuelven.",
      principal: "Las rellenas son las que uso a diario.",
      herramientas: "herramientas",
    },
    proyectos: {
      titulo: "Proyectos",
      bajada: "Cosas que he construido. Abre una carpeta para ver el sitio o el código.",
      github: "Todo en GitHub",
      verSitio: "Ver sitio",
      verCodigo: "Ver código",
      enlaceExterno: "(se abre en una pestaña nueva)",
      interno: "Sistema interno, sin demo pública.",
      captura: "Captura del sitio de",
    },
    experiencia: {
      titulo: "Experiencia",
      bajada: "Lo de ahora y lo que vino antes.",
      actual: "En curso",
    },
    contacto: {
      titulo: "Hablemos.",
      bajada:
        "¿Tienes un proyecto en mente? Escríbeme y te respondo dentro de un día hábil.",
      copiar: "Copiar mi correo",
      correoCopiado: "Dirección de correo copiada al portapapeles.",
      correoFallo: "No se pudo copiar. Mi correo es:",
      descargarCV: "Descargar CV",
      cvFormato: "(PDF)",
      formulario: {
        nombre: "Tu nombre",
        correo: "Tu correo",
        correoEjemplo: "tu@empresa.cl",
        mensaje: "¿Qué tienes en mente?",
        mensajeEjemplo: "Cuéntame del proyecto, los plazos y lo que necesitas…",
        enviar: "Crear borrador de correo",
        nota: "Se abre tu programa de correo con el mensaje listo para enviar.",
        falta: "Escribe un mensaje antes de crear el borrador.",
        abierto: "Borrador creado en tu programa de correo.",
      },
      asuntoCorreo: "Proyecto freelance",
      saludoCorreo: "Hola Benjamín,",
    },
    pie: {
      descripcion: "Software Engineer en Santiago de Chile.",
      escribeme: "Escríbeme",
      nosVemos: "Nos vemos.",
      volverArriba: "Volver arriba",
      derechos: "Benjamín Peña Díaz",
      construidoCon: "Hecho con Next.js y Tailwind CSS.",
      ciudad: {
        pista: "Pasa el cursor por los edificios para encender las ventanas.",
        pistaTactil: "Toca los edificios para encender las ventanas.",
        otra: "Construir otra cuadra",
        descripcion:
          "Ilustración de una cuadra de Santiago con la cordillera detrás: los edificios se levantan uno a uno y los autos pasan por la avenida.",
      },
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
      inicio: "home",
      sobreMi: "About",
      stack: "Stack",
      proyectos: "Projects",
      experiencia: "Experience",
      contacto: "Contact",
      menu: "Open the menu",
      cerrarMenu: "Close the menu",
      explorar: "Explore",
    },
    tema: {
      etiqueta: "Switch to dark mode",
      etiquetaClaro: "Switch to light mode",
      generico: "Toggle light and dark mode",
    },
    idioma: {
      etiqueta: "Ver este sitio en español",
      codigo: "ES",
      nombre: "Español",
    },
    hero: {
      rol: "Software Engineer",
      etiqueta: "full stack & data",
      disponible: "Available for freelance projects",
      saludo: "Hi, I'm Benjamín.",
      subtitulo: "Software Engineer, from interfaces to data.",
      actualmente: "Right now",
      actual: "Thesis student at Universidad Andrés Bello",
      actualDetalle: "Graduating November 2026",
      intro:
        "I build **web interfaces** and ship them to **production** with React, TypeScript and Tailwind. I come from **data analysis**, so I'm just as comfortable in Power BI, Power Apps and Python when a project calls for it.",
      verProyectos: "View projects",
      descargarCV: "Download CV",
      altFoto:
        "Benjamín Peña Díaz in profile, wearing sunglasses, in front of a hillside. Black and white photograph.",
    },
    sobreMi: {
      titulo: "Who I am",
      parrafos: [
        "I'm a Software Engineer with roots in full stack development and data analysis. I'm finishing a Computer Engineering degree at Universidad Andrés Bello in Santiago, graduating in November 2026, and I'm available for freelance projects.",
        "I spent a year and a half at CMPC: first as a data analyst building Power BI dashboards, then in IT/OT Cybersecurity Operations, where I designed and built the team's internal portal, from the interface architecture through to launch.",
        "I ship finished interfaces, not mockups. I turn a Figma design into a responsive, accessible interface — and define the visual hierarchy myself when the design doesn't exist yet.",
        "I build end to end, from frontend to backend, and I'll also take on a Power BI dashboard, an internal Power Apps tool or a Python script. Having worked on both sides helps me build interfaces that understand the data they show.",
      ],
      cita: "I make sure the final product looks good and feels solid, both visually and technically.",
      idiomas: "Languages",
    },
    stack: {
      titulo: "Stack",
      bajada: "The tools behind my work, grouped by what they solve.",
      principal: "The filled ones are the ones I use every day.",
      herramientas: "tools",
    },
    proyectos: {
      titulo: "Projects",
      bajada: "Things I've built. Open a folder to see the site or the code.",
      github: "Everything on GitHub",
      verSitio: "View site",
      verCodigo: "View code",
      enlaceExterno: "(opens in a new tab)",
      interno: "Internal system, no public demo.",
      captura: "Screenshot of the site for",
    },
    experiencia: {
      titulo: "Experience",
      bajada: "What I'm doing now and what came before.",
      actual: "Ongoing",
    },
    contacto: {
      titulo: "Let's talk.",
      bajada:
        "Have a project in mind? Send me a note and I'll reply within one business day.",
      copiar: "Copy my email",
      correoCopiado: "Email address copied to your clipboard.",
      correoFallo: "Couldn't copy it. My address is:",
      descargarCV: "Download CV",
      cvFormato: "(PDF, in Spanish)",
      formulario: {
        nombre: "Your name",
        correo: "Your email",
        correoEjemplo: "you@company.com",
        mensaje: "What do you have in mind?",
        mensajeEjemplo: "Tell me about the project, the timeline and what you need…",
        enviar: "Create email draft",
        nota: "Your email app opens with the message ready to send.",
        falta: "Write a message before creating the draft.",
        abierto: "Draft created in your email app.",
      },
      asuntoCorreo: "Freelance project",
      saludoCorreo: "Hi Benjamín,",
    },
    pie: {
      descripcion: "Software Engineer in Santiago, Chile.",
      escribeme: "Get in touch",
      nosVemos: "See you around.",
      volverArriba: "Back to top",
      derechos: "Benjamín Peña Díaz",
      construidoCon: "Built with Next.js and Tailwind CSS.",
      ciudad: {
        pista: "Move the cursor over the buildings to switch the windows on.",
        pistaTactil: "Tap the buildings to switch the windows on.",
        otra: "Build another block",
        descripcion:
          "Illustration of a Santiago block with the Andes behind it: buildings rise one by one and cars drive down the avenue.",
      },
    },
    noEncontrado: {
      titulo: "Page not found",
      bajada: "The link you followed doesn't lead anywhere.",
      volver: "Back to home",
    },
  },
} as const;

/** Quita los literales de `as const` para que inglés y español compartan tipo. */
type Ensanchar<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Ensanchar<U>[]
    : { readonly [K in keyof T]: Ensanchar<T[K]> };

export type Diccionario = Ensanchar<(typeof diccionario)["es"]>;

export function obtenerDiccionario(idioma: Idioma): Diccionario {
  return diccionario[idioma];
}
