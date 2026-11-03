import type { Idioma } from "@/types";

/**
 * Todo el texto de interfaz del sitio, en ambos idiomas.
 * El contenido (proyectos, stack, experiencia) vive en /src/data.
 */
const diccionario = {
  es: {
    saltarAlContenido: "Saltar al contenido",
    nav: {
      principal: "Navegación principal",
      inicio: "Inicio",
      sobreMi: "Sobre mí",
      proyectos: "Proyectos",
      stack: "Stack",
      experiencia: "Experiencia",
      contacto: "Contacto",
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
    obra: {
      telon: "deja que los agentes lo hagan",
      estado: "Estado de la obra",
      agentes: "agentes",
      capas: "capas",
      prs: "PRs",
      saltar: "Saltar",
      saltarEtiqueta: "Saltar la animación y ver la página armada",
      rearmar: "Rearmar",
      rearmarEtiqueta: "Volver a ver cómo los agentes arman la página",
      anuncioInicio:
        "Un equipo de agentes está armando la página. El contenido ya se puede leer. Pulsa Escape o el botón Saltar para verla armada.",
      anuncioFin: "Página armada.",
    },
    inicio: {
      disponible: "Disponible para full-time y freelance",
      rol: "Desarrollador Frontend & Data Analyst",
      intro:
        "Construyo interfaces web y las llevo a producción con React, TypeScript y Tailwind. Vengo del análisis de datos, así que también me muevo en Power BI, Power Apps y Python cuando el proyecto lo pide.",
      verProyectos: "Ver proyectos",
      descargarCV: "Descargar CV",
      cvFormato: "(PDF)",
      base: "Ñuñoa, Santiago · Ing. Civil en Informática, egreso nov 2026",
      panel: {
        titulo: "Resumen",
        fuente: "calculado de src/data",
        publicados: "Proyectos con demo",
        herramientas: "Herramientas en el stack",
        experiencia: "En CMPC",
        experienciaValor: "1,5 años",
        grafico: "Tecnologías más usadas en mis proyectos",
        proyectos: "proyectos",
      },
    },
    sobreMi: {
      etiqueta: "01 · Sobre mí",
      titulo: "Quién soy",
      parrafos: [
        "Soy desarrollador frontend y analista de datos. Estoy terminando Ingeniería Civil en Informática en la Universidad Andrés Bello, egreso en noviembre de 2026, y busco mi próximo rol full-time mientras tomo proyectos freelance.",
        "Pasé un año y medio en CMPC: primero como analista de datos, armando tableros en Power BI, y después en Cybersecurity Operations TI/OT, donde diseñé y construí el portal interno del área, desde la arquitectura de la interfaz hasta su puesta en marcha.",
        "Entrego interfaces terminadas, no maquetas. Traduzco un diseño de Figma a una interfaz responsive y accesible, y defino la jerarquía visual cuando el diseño todavía no existe.",
      ],
      agentes:
        "Trabajo a diario con agentes de IA: varias sesiones de Claude Code en paralelo, cada una con su tarea, y yo reviso y decido. Esta versión del portafolio es un guiño a esa forma de trabajar.",
      archivo: "perfil.ts",
      codigo: {
        variable: "benjamin",
        rol: "rol",
        base: "base",
        egreso: "egreso",
        egresoValor: "Nov 2026 · Ing. Civil en Informática, UNAB",
        idiomas: "idiomas",
        idiomasValor: ['"Español (nativo)"', '"Inglés (intermedio-avanzado)"'],
        busca: "busca",
        buscaValor: ['"full-time"', '"freelance"'],
        trabajaCon: "trabajaCon",
        trabajaConValor: ['"Claude Code"', '"agentes en paralelo"'],
      },
    },
    proyectos: {
      etiqueta: "02 · Proyectos",
      titulo: "Trabajo seleccionado",
      bajada: "Algunas cosas que he construido, de la más reciente a la más antigua.",
      verSitio: "Ver sitio",
      verCodigo: "Código",
      enlaceExterno: "(se abre en una pestaña nueva)",
      captura: "Captura del sitio de",
      interno: "Sistema interno · sin demo pública",
    },
    stack: {
      etiqueta: "03 · Stack",
      titulo: "Con qué trabajo",
      bajada:
        "Agrupado por lo que resuelve. Las principales van marcadas, y lo que estoy sumando va aparte.",
      principal: "principal",
      enProyectos: "En mis proyectos",
      descripciones: {
        frontend: "Interfaces terminadas, responsive y accesibles, de Figma a producción.",
        datos: "Tableros, modelos y automatización de reportes, más el back que los alimenta.",
        herramientas: "Diseño, control de versiones, despliegue y los agentes con los que trabajo.",
        incorporando: "Lo que estoy sumando ahora, separado a propósito de lo que domino.",
      },
      flujo: {
        titulo: "Cómo trabajo",
        pasos: [
          "Divido el trabajo en tareas chicas, con un criterio claro de terminado.",
          "Agentes en paralelo (front, api, infra), cada uno en su rama.",
          "Reviso cada cambio y lo pruebo: teclado, axe, Lighthouse.",
          "Lo publico en Vercel y anoto lo que aprendí.",
        ],
      },
    },
    experiencia: {
      etiqueta: "04 · Experiencia",
      titulo: "Por dónde he pasado",
      actual: "En curso",
    },
    contacto: {
      etiqueta: "05 · Contacto",
      titulo: "Hablemos",
      bajada:
        "¿Tienes un rol o un proyecto en mente? Escríbeme y te respondo dentro de un día hábil.",
      email: "Correo",
      telefono: "Teléfono",
      ubicacion: "Ubicación",
      botonCorreo: "Copiar mi correo",
      correoCopiado: "Dirección de correo copiada al portapapeles.",
      correoFallo: "No pudimos copiarla. Mi correo es:",
      descargarCV: "Descargar CV",
      cvFormato: "(PDF)",
      asuntoCorreo: "Hablemos",
      cuerpoCorreo: "Hola Benjamín,\n\n",
    },
    pie: {
      derechos: "Hecho en Santiago de Chile.",
      construidoCon: "Armado por agentes, revisado por mí. Next.js y Tailwind CSS.",
      volverArriba: "Volver arriba",
      otrasVersiones: "Versión 4 del portafolio.",
      versionPrincipal: "Ver la versión principal",
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
      principal: "Main navigation",
      inicio: "Home",
      sobreMi: "About",
      proyectos: "Projects",
      stack: "Stack",
      experiencia: "Experience",
      contacto: "Contact",
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
    obra: {
      telon: "let the agents do it",
      estado: "Build status",
      agentes: "agents",
      capas: "layers",
      prs: "PRs",
      saltar: "Skip",
      saltarEtiqueta: "Skip the animation and see the finished page",
      rearmar: "Rebuild",
      rearmarEtiqueta: "Watch the agents build the page again",
      anuncioInicio:
        "A team of agents is building the page. The content can already be read. Press Escape or the Skip button to see it finished.",
      anuncioFin: "Page built.",
    },
    inicio: {
      disponible: "Available for full-time and freelance work",
      rol: "Frontend Developer & Data Analyst",
      intro:
        "I build web interfaces and ship them to production with React, TypeScript and Tailwind. I come from data analysis, so I'm just as comfortable in Power BI, Power Apps and Python when a project calls for it.",
      verProyectos: "View projects",
      descargarCV: "Download CV",
      cvFormato: "(PDF, in Spanish)",
      base: "Santiago, Chile · Computer Engineering, graduating Nov 2026",
      panel: {
        titulo: "Overview",
        fuente: "computed from src/data",
        publicados: "Projects with a live demo",
        herramientas: "Tools in the stack",
        experiencia: "At CMPC",
        experienciaValor: "1.5 years",
        grafico: "Most used technologies in my projects",
        proyectos: "projects",
      },
    },
    sobreMi: {
      etiqueta: "01 · About",
      titulo: "Who I am",
      parrafos: [
        "I'm a frontend developer and data analyst. I'm finishing a Computer Engineering degree at Universidad Andrés Bello in Santiago, graduating in November 2026, and I'm looking for my next full-time role while taking on freelance work.",
        "I spent a year and a half at CMPC: first as a data analyst building Power BI dashboards, then in IT/OT Cybersecurity Operations, where I designed and built the team's internal portal, from the interface architecture through to launch.",
        "I ship finished interfaces, not mockups. I turn a Figma design into a responsive, accessible interface, and define the visual hierarchy myself when the design doesn't exist yet.",
      ],
      agentes:
        "I work with AI agents every day: several Claude Code sessions in parallel, each with its own task, while I review and decide. This version of the portfolio is a nod to that way of working.",
      archivo: "profile.ts",
      codigo: {
        variable: "benjamin",
        rol: "role",
        base: "based",
        egreso: "graduates",
        egresoValor: "Nov 2026 · Computer Engineering, UNAB",
        idiomas: "languages",
        idiomasValor: ['"Spanish (native)"', '"English (upper intermediate)"'],
        busca: "lookingFor",
        buscaValor: ['"full-time"', '"freelance"'],
        trabajaCon: "worksWith",
        trabajaConValor: ['"Claude Code"', '"parallel agents"'],
      },
    },
    proyectos: {
      etiqueta: "02 · Projects",
      titulo: "Selected work",
      bajada: "A few things I've built, newest first.",
      verSitio: "View site",
      verCodigo: "Code",
      enlaceExterno: "(opens in a new tab)",
      captura: "Screenshot of the site for",
      interno: "Internal system · no public demo",
    },
    stack: {
      etiqueta: "03 · Stack",
      titulo: "What I work with",
      bajada:
        "Grouped by what it solves. The core tools are marked, and what I'm still picking up is listed separately.",
      principal: "core",
      enProyectos: "In my projects",
      descripciones: {
        frontend: "Finished, responsive and accessible interfaces, from Figma to production.",
        datos: "Dashboards, data models and report automation, plus the back end that feeds them.",
        herramientas: "Design, version control, deployment and the agents I work with.",
        incorporando: "What I'm picking up right now, kept apart on purpose from what I know well.",
      },
      flujo: {
        titulo: "How I work",
        pasos: [
          "I split the work into small tasks, each with a clear definition of done.",
          "Agents in parallel (front, api, infra), each on its own branch.",
          "I review every change and test it: keyboard, axe, Lighthouse.",
          "I ship it on Vercel and write down what I learned.",
        ],
      },
    },
    experiencia: {
      etiqueta: "04 · Experience",
      titulo: "Where I've been",
      actual: "Ongoing",
    },
    contacto: {
      etiqueta: "05 · Contact",
      titulo: "Let's talk",
      bajada:
        "Have a role or a project in mind? Send me a note and I'll reply within one business day.",
      email: "Email",
      telefono: "Phone",
      ubicacion: "Location",
      botonCorreo: "Copy my email",
      correoCopiado: "Email address copied to your clipboard.",
      correoFallo: "Couldn't copy it. My address is:",
      descargarCV: "Download CV",
      cvFormato: "(PDF, in Spanish)",
      asuntoCorreo: "Let's talk",
      cuerpoCorreo: "Hi Benjamín,\n\n",
    },
    pie: {
      derechos: "Made in Santiago, Chile.",
      construidoCon: "Built by agents, reviewed by me. Next.js and Tailwind CSS.",
      volverArriba: "Back to top",
      otrasVersiones: "Version 4 of the portfolio.",
      versionPrincipal: "See the main version",
    },
    noEncontrado: {
      titulo: "Page not found",
      bajada: "The link you followed doesn't lead anywhere.",
      volver: "Back to home",
    },
  },
} as const;

type Ampliar<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Ampliar<U>[]
    : { [K in keyof T]: Ampliar<T[K]> };

export type Diccionario = Ampliar<(typeof diccionario)["es"]>;

export function obtenerDiccionario(idioma: Idioma): Diccionario {
  return diccionario[idioma];
}
