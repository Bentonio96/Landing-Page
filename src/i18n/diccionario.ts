import type { Idioma } from "@/types";

/**
 * Todo el texto de interfaz, en ambos idiomas. El contenido (proyectos,
 * stack, experiencia) vive en src/data y el guion de ÁPEX en lib/apex.ts.
 *
 * La metáfora (sectores, garage, box) va siempre junto al nombre común de
 * la sección: quien recluta tiene que encontrar «Proyectos» sin traducir.
 */
const diccionario = {
  es: {
    saltarAlContenido: "Saltar al contenido",
    titulo: "Benjamín Peña",
    nav: {
      etiqueta: "Sectores de la página",
      inicio: "Inicio",
      sectores: {
        piloto: { codigo: "S1", nombre: "Sobre mí", metafora: "Piloto" },
        garage: { codigo: "S2", nombre: "Proyectos", metafora: "Garage" },
        sistemas: { codigo: "S3", nombre: "Stack", metafora: "Sistemas" },
        tiempos: { codigo: "S4", nombre: "Experiencia", metafora: "Tiempos" },
        box: { codigo: "S5", nombre: "Contacto", metafora: "Box" },
      },
    },
    hud: {
      vuelta: "Tu vuelta",
      velocidad: "km/h",
      marcha: "Marcha",
      recorrido: "Recorrido",
      radio: "Radio",
      abrirRadio: "Hablar con ÁPEX",
      temaOscuro: "Cambiar a carrera nocturna (modo oscuro)",
      temaClaro: "Cambiar a carrera de día (modo claro)",
      idioma: "Ver este sitio en inglés",
      idiomaCodigo: "EN",
      hrefIdioma: "/en",
      atajosActivos: "Atajos de teclado activados",
      atajosApagados: "Atajos de teclado apagados",
    },
    hero: {
      piloto: "Piloto #29 · Santiago, CHL",
      rol: "Desarrollador Frontend & Data Analyst",
      intro:
        "Construyo interfaces web y las llevo a producción con React, TypeScript y Tailwind. Vengo del análisis de datos y hoy construyo la integración de wearables de una startup de bienestar.",
      radio: "Radio check. Piloto listo, pista libre. Pregúntame lo que quieras de él.",
      hablar: "Hablar con ÁPEX",
      verProyectos: "Ver proyectos",
      altFoto:
        "Benjamín Peña Díaz, de perfil y con lentes de sol, frente a un cerro. Fotografía en blanco y negro.",
      ficha: [
        { etiqueta: "Estado", valor: "Disponible", vivo: true },
        { etiqueta: "Busca", valor: "Full-time y freelance" },
        { etiqueta: "Egreso", valor: "Noviembre 2026" },
        { etiqueta: "Paper", valor: "ECP 2026" },
      ],
    },
    piloto: {
      titulo: "Quién soy",
      parrafos: [
        "Soy desarrollador frontend y analista de datos. Estoy terminando Ingeniería Civil en Informática en la Universidad Andrés Bello, con una tesis de metaheurísticas publicada en ECP 2026, y egreso en noviembre.",
        "Pasé un año y medio en CMPC: primero como analista de datos, armando tableros en Power BI, y después en Cybersecurity Operations TI/OT, donde diseñé y construí el portal interno del área. Hoy estoy en una startup de bienestar, donde construí la integración con Health Connect, Apple Salud, Whoop y Oura.",
        "Entrego interfaces terminadas, no maquetas. Haber trabajado de los dos lados me ayuda a construir interfaces que entienden los datos que muestran.",
      ],
      cita: {
        antes: "Me aseguro de que el producto final se vea bien y ",
        resaltado: "se sienta sólido",
        despues: ".",
      },
      telemetria: "Telemetría",
      datos: [
        { valor: "1,5", unidad: "años", etiqueta: "en CMPC, entre datos y ciberseguridad" },
        { valor: "4", unidad: "wearables", etiqueta: "integrados en la startup de bienestar" },
        { valor: "5", unidad: "problemas", etiqueta: "de optimización en la tesis" },
        { valor: "7", unidad: "proyectos", etiqueta: "en el garage, seis con demo pública" },
      ],
      idiomas: "Idiomas",
    },
    garage: {
      titulo: "Proyectos",
      bajada: "Siete autos en el garage. Cada uno con su clase, su motor y su pista.",
      verSitio: "Ver sitio",
      verCodigo: "Ver código",
      enlaceExterno: "(se abre en una pestaña nueva)",
      captura: "Captura del sitio de",
      clase: "Clase",
      motor: "Motor",
      fecha: "Fecha",
      interno: "Sistema interno: sin demo pública.",
      preguntar: "Preguntarle a ÁPEX",
    },
    sistemas: {
      titulo: "Stack",
      bajada:
        "Las herramientas que uso a diario, por lo que resuelven. Elige una pieza y te digo en qué proyecto corre.",
      metaforas: {
        frontend: "Chasis",
        datos: "Motor",
        herramientas: "Electrónica",
        incorporando: "En desarrollo",
      },
      principal: "herramienta principal",
      lectura: "Lectura",
      vacio: "Elige una tecnología para ver dónde corre.",
      usadaEn: "Corre en",
      sinProyecto: "Todavía no está en un proyecto publicado.",
      aprendiendo: "La estoy incorporando: todavía no la pongo en pista.",
    },
    tiempos: {
      titulo: "Experiencia",
      bajada: "La torre de tiempos, de la vuelta más reciente a la primera.",
      pos: "Pos",
      enPista: "En pista",
      completada: "Completada",
      verDetalle: "Ver detalle de",
    },
    box: {
      titulo: "Hablemos",
      bajada:
        "¿Tienes un rol o un proyecto en mente? Escríbeme y te respondo dentro de un día hábil.",
      botonCorreo: "Copiar mi correo",
      correoCopiado: "Correo copiado al portapapeles.",
      correoFallo: "No pude copiarlo. Mi correo es",
      descargarCV: "Descargar CV",
      cvFormato: "(PDF)",
      correo: "Correo",
      telefono: "Teléfono",
      ubicacion: "Base",
      ubicacionValor: "Ñuñoa, Santiago",
      tuVuelta: "Tu vuelta",
      sinTiempo: "En curso",
      total: "Tiempo",
      mejor: "Tu mejor vuelta",
      otraVuelta: "Otra vuelta",
      mejorSector: "mejor",
      masLento: "más lento",
      notaVuelta:
        "Se mide desde que abriste la página. Morado es tu mejor marca, como en la cronometría de la Fórmula 1. Se guarda solo en tu navegador.",
    },
    radio: {
      titulo: "Radio · ÁPEX",
      canal: "Canal 29 · ingeniero de pista",
      etiquetaEntrada: "Mensaje para ÁPEX",
      historial: "Conversación con ÁPEX",
      placeholder: "Pregunta algo: «proyectos», «¿sabes React?»…",
      enviar: "Enviar",
      cerrar: "Cerrar radio",
      tu: "Tú",
      apex: "ÁPEX",
      bienvenida:
        "Radio check. Soy ÁPEX, el ingeniero de pista de Benja. Pregúntame por sus proyectos, su stack, su tesis o cómo contactarlo.",
      sugerencias: ["¿Quién es?", "Proyectos", "¿Sabes React?", "Tesis", "¿Está disponible?", "Contacto"],
      sectores: {
        piloto: "S1. Piloto en pista: frontend, con los datos de respaldo.",
        garage: "S2. Siete autos en el garage. El más ambicioso: Kerr, con la lente de un agujero negro en WebGL2.",
        sistemas: "S3. Sistemas en verde. Elige una pieza y te digo en qué auto corre.",
        tiempos: "S4. Torre de tiempos. P1: la integración de wearables.",
        box: "Box, box. Bandera a cuadros.",
      },
      vuelta: "Tu vuelta",
      atajosOn: "Atajos activados.",
      atajosOff: "Atajos apagados. Vuelve a activarlos desde aquí cuando quieras.",
    },
    noEncontrado: {
      titulo: "Fuera de pista",
      bajada: "El enlace que seguiste no lleva a ninguna parte del circuito.",
      volver: "Volver a la parrilla",
    },
    pie: {
      hecho: "Hecho en Santiago de Chile.",
      construido: "Next.js, GSAP y un canvas de LED hecho a mano.",
      versiones: "Otras versiones",
      volver: "Volver a la parrilla",
    },
  },

  en: {
    saltarAlContenido: "Skip to content",
    titulo: "Benjamín Peña",
    nav: {
      etiqueta: "Page sectors",
      inicio: "Home",
      sectores: {
        piloto: { codigo: "S1", nombre: "About", metafora: "Driver" },
        garage: { codigo: "S2", nombre: "Projects", metafora: "Garage" },
        sistemas: { codigo: "S3", nombre: "Stack", metafora: "Systems" },
        tiempos: { codigo: "S4", nombre: "Experience", metafora: "Timing" },
        box: { codigo: "S5", nombre: "Contact", metafora: "Pit box" },
      },
    },
    hud: {
      vuelta: "Your lap",
      velocidad: "km/h",
      marcha: "Gear",
      recorrido: "Distance",
      radio: "Radio",
      abrirRadio: "Talk to APEX",
      temaOscuro: "Switch to night race (dark mode)",
      temaClaro: "Switch to day race (light mode)",
      idioma: "Ver este sitio en español",
      idiomaCodigo: "ES",
      hrefIdioma: "/",
      atajosActivos: "Keyboard shortcuts on",
      atajosApagados: "Keyboard shortcuts off",
    },
    hero: {
      piloto: "Driver #29 · Santiago, CHL",
      rol: "Frontend Developer & Data Analyst",
      intro:
        "I build web interfaces and ship them to production with React, TypeScript and Tailwind. I come from data analysis, and today I'm building the wearables integration at a wellness startup.",
      radio: "Radio check. Driver ready, track is clear. Ask me anything about him.",
      hablar: "Talk to APEX",
      verProyectos: "View projects",
      altFoto:
        "Benjamín Peña Díaz in profile, wearing sunglasses, in front of a hillside. Black and white photograph.",
      ficha: [
        { etiqueta: "Status", valor: "Available", vivo: true },
        { etiqueta: "Looking for", valor: "Full-time & freelance" },
        { etiqueta: "Graduating", valor: "November 2026" },
        { etiqueta: "Paper", valor: "ECP 2026" },
      ],
    },
    piloto: {
      titulo: "Who I am",
      parrafos: [
        "I'm a frontend developer and data analyst. I'm finishing a Computer Engineering degree at Universidad Andrés Bello, with a metaheuristics thesis published at ECP 2026, and I graduate in November.",
        "I spent a year and a half at CMPC: first as a data analyst building Power BI dashboards, then in IT/OT Cybersecurity Operations, where I designed and built the team's internal portal. Today I'm at a wellness startup, where I built the integration with Health Connect, Apple Health, Whoop and Oura.",
        "I ship finished interfaces, not mockups. Having worked on both sides helps me build interfaces that understand the data they show.",
      ],
      cita: {
        antes: "I make sure the final product looks good and ",
        resaltado: "feels solid",
        despues: ".",
      },
      telemetria: "Telemetry",
      datos: [
        { valor: "1.5", unidad: "years", etiqueta: "at CMPC, across data and cybersecurity" },
        { valor: "4", unidad: "wearables", etiqueta: "integrated at the wellness startup" },
        { valor: "5", unidad: "problems", etiqueta: "of optimisation in the thesis" },
        { valor: "7", unidad: "projects", etiqueta: "in the garage, six with a public demo" },
      ],
      idiomas: "Languages",
    },
    garage: {
      titulo: "Projects",
      bajada: "Seven cars in the garage. Each with its class, its engine and its track.",
      verSitio: "View site",
      verCodigo: "View code",
      enlaceExterno: "(opens in a new tab)",
      captura: "Screenshot of the site for",
      clase: "Class",
      motor: "Engine",
      fecha: "Date",
      interno: "Internal system: no public demo.",
      preguntar: "Ask APEX",
    },
    sistemas: {
      titulo: "Stack",
      bajada:
        "The tools I use day to day, grouped by what they solve. Pick a part and I'll tell you which project runs on it.",
      metaforas: {
        frontend: "Chassis",
        datos: "Engine",
        herramientas: "Electronics",
        incorporando: "In development",
      },
      principal: "core tool",
      lectura: "Readout",
      vacio: "Pick a technology to see where it runs.",
      usadaEn: "Runs in",
      sinProyecto: "Not in a published project yet.",
      aprendiendo: "I'm picking it up: not on track yet.",
    },
    tiempos: {
      titulo: "Experience",
      bajada: "The timing tower, from the latest lap back to the first.",
      pos: "Pos",
      enPista: "On track",
      completada: "Completed",
      verDetalle: "Show details for",
    },
    box: {
      titulo: "Let's talk",
      bajada:
        "Have a role or a project in mind? Send me a note and I'll reply within one business day.",
      botonCorreo: "Copy my email",
      correoCopiado: "Email copied to your clipboard.",
      correoFallo: "Couldn't copy it. My email is",
      descargarCV: "Download CV",
      cvFormato: "(PDF, in Spanish)",
      correo: "Email",
      telefono: "Phone",
      ubicacion: "Base",
      ubicacionValor: "Ñuñoa, Santiago",
      tuVuelta: "Your lap",
      sinTiempo: "In progress",
      total: "Time",
      mejor: "Your best lap",
      otraVuelta: "Another lap",
      mejorSector: "best",
      masLento: "slower",
      notaVuelta:
        "Timed from the moment you opened the page. Purple is your best, as in Formula 1 timing. It's only stored in your browser.",
    },
    radio: {
      titulo: "Radio · APEX",
      canal: "Channel 29 · race engineer",
      etiquetaEntrada: "Message for APEX",
      historial: "Conversation with APEX",
      placeholder: "Ask something: “projects”, “do you know React?”…",
      enviar: "Send",
      cerrar: "Close radio",
      tu: "You",
      apex: "APEX",
      bienvenida:
        "Radio check. I'm APEX, Benja's race engineer. Ask me about his projects, his stack, his thesis or how to reach him.",
      sugerencias: ["Who is he?", "Projects", "Do you know React?", "Thesis", "Is he available?", "Contact"],
      sectores: {
        piloto: "S1. Driver on track: frontend, with data to back it up.",
        garage: "S2. Seven cars in the garage. The boldest: Kerr, with a black hole's lensing in WebGL2.",
        sistemas: "S3. Systems are green. Pick a part and I'll tell you which car it runs in.",
        tiempos: "S4. Timing tower. P1: the wearables integration.",
        box: "Box, box. Chequered flag.",
      },
      vuelta: "Your lap",
      atajosOn: "Shortcuts on.",
      atajosOff: "Shortcuts off. Turn them back on from here whenever you like.",
    },
    noEncontrado: {
      titulo: "Off track",
      bajada: "The link you followed doesn't lead anywhere on the circuit.",
      volver: "Back to the grid",
    },
    pie: {
      hecho: "Made in Santiago, Chile.",
      construido: "Next.js, GSAP and a hand-made LED canvas.",
      versiones: "Other versions",
      volver: "Back to the grid",
    },
  },
} as const;

type Ampliar<T> = T extends string
  ? string
  : T extends boolean
    ? boolean
    : T extends readonly (infer U)[]
      ? readonly Ampliar<U>[]
      : { readonly [K in keyof T]: Ampliar<T[K]> };

export type Diccionario = Ampliar<(typeof diccionario)["es"]>;

export function obtenerDiccionario(idioma: Idioma): Diccionario {
  return diccionario[idioma];
}
