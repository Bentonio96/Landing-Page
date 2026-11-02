/**
 * ÁPEX, el ingeniero de pista de Benja: la voz de la radio.
 *
 * No hay modelo ni API detrás. Es un guion: cada mensaje se normaliza
 * (minúsculas, sin tildes, sin signos) y se busca la primera intención que
 * calce, en un orden pensado para que lo específico gane a lo general
 * («¿sabes Python?» responde por Python y no por el stack completo). Así
 * no cuesta nada, responde al instante y nunca inventa un dato: todo lo que
 * dice sale de src/data.
 *
 * Este módulo es puro y no importa nada en tiempo de ejecución, para que
 * los tests lo carguen directo con Node (tests/apex.test.mjs).
 */
import type { Idioma } from "@/types";

export type Accion =
  | { tipo: "ir"; destino: string; texto: string }
  | { tipo: "enlace"; href: string; texto: string; descarga?: string }
  | { tipo: "copiar"; valor: string; texto: string }
  | { tipo: "tema"; texto: string }
  | { tipo: "idioma"; texto: string }
  | { tipo: "atajos"; texto: string };

export type Respuesta = {
  texto: string;
  /** Botones que acompañan la respuesta. */
  acciones?: Accion[];
  /** Se ejecuta sola al responder: un salto de sector, un cambio de tema. */
  auto?: Accion;
};

export type ProyectoRadio = {
  slug: string;
  nombre: string;
  clase: string;
  descripcion: string;
  tecnologias: string[];
  demoUrl?: string;
  repoUrl?: string;
};

export type Conocimiento = {
  idioma: Idioma;
  proyectos: ProyectoRadio[];
  /** Todo el stack, en el orden de src/data/stack.ts. */
  stack: string[];
  /** Lo que todavía está aprendiendo: se responde distinto. */
  incorporando: string[];
  email: string;
  telefono: string;
  linkedin: string;
  github: string;
  cv: string;
  cvArchivo: string;
  paper: string;
};

/** Minúsculas, sin tildes ni signos. «¿Sabés Next.js?» → «sabes next js». */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

/** Sin espacios, para buscar nombres compuestos: «power bi» → «powerbi». */
function compacto(texto: string): string {
  return normalizar(texto).replace(/ /g, "");
}

function tieneRaiz(palabras: string[], raices: string[]): boolean {
  return palabras.some((p) => raices.some((r) => p.startsWith(r)));
}

/** La tecnología del stack que nombra el mensaje, la más larga si hay varias. */
export function tecnologiaMencionada(
  mensaje: string,
  stack: string[],
): string | undefined {
  const plano = compacto(mensaje);
  const palabras = normalizar(mensaje).split(" ");
  let mejor: string | undefined;
  let puntaje = 0;
  for (const nombre of stack) {
    const clave = compacto(nombre);
    // «HTML semántico» o «Power BI» también se reconocen por su primera
    // palabra, pero el nombre completo siempre gana: «power apps» es Power
    // Apps y no la primera herramienta Power de la lista.
    const corta = compacto(nombre.split(" ")[0]);
    const completo = (clave.length > 3 && plano.includes(clave)) || palabras.includes(clave);
    const parcial = corta.length > 2 && palabras.includes(corta);
    const p = completo ? 1000 + clave.length : parcial ? corta.length : 0;
    if (p > puntaje) {
      puntaje = p;
      mejor = nombre;
    }
  }
  return mejor;
}

/** Proyectos que usan una tecnología. «React» calza con «React 19». */
export function proyectosQueUsan(
  tecnologia: string,
  proyectos: ProyectoRadio[],
): ProyectoRadio[] {
  const t = compacto(tecnologia);
  return proyectos.filter((p) =>
    p.tecnologias.some((x) => {
      const c = compacto(x);
      return c === t || c.startsWith(t) || (t.length > 4 && t.startsWith(c));
    }),
  );
}

function lista(nombres: string[], idioma: Idioma): string {
  if (nombres.length <= 1) return nombres.join("");
  const y = idioma === "es" ? " y " : " and ";
  return `${nombres.slice(0, -1).join(", ")}${y}${nombres.at(-1)}`;
}

export function responder(entrada: string, c: Conocimiento): Respuesta {
  const es = c.idioma === "es";
  const texto = normalizar(entrada);
  const palabras = texto.split(" ").filter(Boolean);
  const plano = texto.replace(/ /g, "");

  const irA = (destino: string, es_: string, en_: string): Accion => ({
    tipo: "ir",
    destino,
    texto: es ? es_ : en_,
  });
  const accionCv: Accion = {
    tipo: "enlace",
    href: c.cv,
    texto: es ? "Descargar CV (PDF)" : "Download CV (PDF, Spanish)",
    descarga: c.cvArchivo,
  };
  const accionCorreo: Accion = {
    tipo: "copiar",
    valor: c.email,
    texto: es ? "Copiar correo" : "Copy email",
  };

  if (!palabras.length) {
    return {
      texto: es
        ? "Canal abierto. Escribe algo, o prueba con «proyectos», «stack» o «cv»."
        : "Channel open. Type something, or try “projects”, “stack” or “cv”.",
    };
  }

  // --- Un proyecto por su nombre ---------------------------------------
  const proyecto = c.proyectos.find((p) => {
    const n = compacto(p.nombre);
    return plano.includes(n) || palabras.includes(p.slug.split("-")[0]);
  });
  if (proyecto) {
    const acciones: Accion[] = [];
    if (proyecto.demoUrl)
      acciones.push({ tipo: "enlace", href: proyecto.demoUrl, texto: es ? "Ver sitio" : "View site" });
    if (proyecto.repoUrl)
      acciones.push({ tipo: "enlace", href: proyecto.repoUrl, texto: es ? "Ver código" : "View code" });
    return {
      texto: `${proyecto.nombre} · ${proyecto.clase}. ${proyecto.descripcion} ${
        es ? "Motor:" : "Built with"
      } ${lista(proyecto.tecnologias, c.idioma)}.`,
      acciones,
      auto: irA(`proyecto-${proyecto.slug}`, "Ir al proyecto", "Go to project"),
    };
  }

  // --- Huevo de pascua ---------------------------------------------------
  if (palabras.includes("jarvis")) {
    return {
      texto: es
        ? "Ese es el asistente de otro ingeniero, uno con armadura. Benja me puso ÁPEX: el punto exacto donde una curva se toma bien. Igual de atento, menos dramático. ¿Qué necesitas?"
        : "That's another engineer's assistant, the one with the armour. Benja named me APEX: the exact point where a corner is taken right. Just as attentive, less dramatic. What do you need?",
    };
  }

  if (tieneRaiz(palabras, ["ayuda", "help", "comando", "command", "opcion", "option"]) ||
      texto.includes("que puedes") || texto.includes("what can")) {
    return {
      texto: es
        ? "Puedo contarte de Benja, sus proyectos, su stack, su experiencia, su tesis o cómo contactarlo. También muevo la página: «ir a proyectos», «modo noche», «english». Pregunta por una tecnología («¿sabes Python?») o por un proyecto («Kerr»)."
        : "I can tell you about Benja, his projects, his stack, his experience, his thesis or how to reach him. I also drive the page: “go to projects”, “night mode”, “español”. Ask about a technology (“do you know Python?”) or a project (“Kerr”).",
      acciones: [
        irA("garage", "Proyectos", "Projects"),
        accionCorreo,
        { tipo: "atajos", texto: es ? "Atajos de teclado" : "Keyboard shortcuts" },
      ],
    };
  }

  // Saludos por palabra exacta: «hi» como raíz se comería «him» o «history».
  if (["hola", "hi", "hello", "hey", "buenas", "buenos", "wena", "ola", "alo"].some((s) => palabras.includes(s))) {
    return {
      texto: es
        ? "Radio check, fuerte y claro. Soy ÁPEX, el ingeniero de pista de Benja. Pregúntame lo que quieras de él."
        : "Radio check, loud and clear. I'm APEX, Benja's race engineer. Ask me anything about him.",
    };
  }

  if (["gracias", "thanks", "thank", "vale", "ok", "perfecto", "genial", "bacan"].some((s) => palabras.includes(s))) {
    return {
      texto: es
        ? "Copiado. Si quieres seguir la vuelta, estaré en la radio. Cambio y fuera."
        : "Copy that. If you want to keep going, I'll be on the radio. Over and out.",
    };
  }

  if (tieneRaiz(palabras, ["cv", "curriculum", "resume", "hoja"])) {
    return {
      texto: es
        ? "Aquí está el CV en PDF, una página, al día con la tesis y la experiencia."
        : "Here's the CV as a PDF. One page, up to date with the thesis and experience. It's in Spanish.",
      acciones: [accionCv],
    };
  }

  if (palabras.includes("linkedin")) {
    return {
      texto: es ? "Su LinkedIn, abierto a conversar." : "His LinkedIn, open to a chat.",
      acciones: [{ tipo: "enlace", href: c.linkedin, texto: "LinkedIn" }],
    };
  }

  if (palabras.includes("github") || palabras.includes("repos") || texto.includes("codigo fuente") || texto.includes("source code")) {
    return {
      texto: es
        ? "Casi todos los proyectos son públicos. Los repos están en GitHub, con README que explican cada decisión."
        : "Almost every project is public. The repos are on GitHub, with READMEs that explain each decision.",
      acciones: [{ tipo: "enlace", href: c.github, texto: "GitHub" }],
    };
  }

  if (tieneRaiz(palabras, ["correo", "email", "mail", "contact", "contrat", "hire", "llam", "telefono", "phone", "escrib", "write", "box"]) ||
      texto.includes("hablar con") || texto.includes("talk to")) {
    return {
      texto: es
        ? `Box, box. El correo es ${c.email} y responde dentro de un día hábil. También está en LinkedIn y en el ${c.telefono}.`
        : `Box, box. His email is ${c.email} and he replies within one business day. He's also on LinkedIn and at ${c.telefono}.`,
      acciones: [accionCorreo, { tipo: "enlace", href: c.linkedin, texto: "LinkedIn" }, accionCv],
      auto: irA("box", "Ir a contacto", "Go to contact"),
    };
  }

  if (tieneRaiz(palabras, ["disponib", "availab", "freelance", "fulltime", "empleo", "job", "busca", "looking", "puesto", "role", "rol"]) ||
      texto.includes("full time")) {
    return {
      texto: es
        ? "Sí, está disponible. Busca un rol full-time de frontend y toma proyectos freelance. Egresa de Ingeniería Civil en Informática en noviembre de 2026."
        : "Yes, he's available. He's looking for a full-time frontend role and takes on freelance work. He graduates in Computer Engineering in November 2026.",
      acciones: [accionCorreo, accionCv],
    };
  }

  if (tieneRaiz(palabras, ["tesis", "thesis", "ecp", "paper", "metaheur", "investig", "research", "public", "tdhc", "genetic", "genetico"])) {
    return {
      texto: es
        ? "Su tesis es Triple Resolutive Approach: una metaheurística TDHC adaptada a cinco problemas de optimización combinatoria, con un algoritmo genético memético en Python. Está publicada en ECP 2026."
        : "His thesis is Triple Resolutive Approach: a TDHC metaheuristic adapted to five combinatorial optimisation problems, with a memetic genetic algorithm in Python. It's published at ECP 2026.",
      acciones: [{ tipo: "enlace", href: c.paper, texto: es ? "Leer el paper" : "Read the paper" }],
    };
  }

  if (tieneRaiz(palabras, ["wearable", "startup", "bienestar", "wellness", "salud", "health", "oura", "whoop", "celery", "fastapi"]) ||
      texto.includes("apple salud") || texto.includes("apple health")) {
    return {
      texto: es
        ? "Hoy está en una startup de bienestar. Construyó la integración de wearables: Google Health Connect, Apple Salud, Whoop y Oura, con FastAPI, Celery, Postgres y Redis."
        : "He's at a wellness startup today. He built the wearables integration: Google Health Connect, Apple Health, Whoop and Oura, with FastAPI, Celery, Postgres and Redis.",
      auto: irA("tiempos", "Ver experiencia", "See experience"),
    };
  }

  if (tieneRaiz(palabras, ["cmpc", "ciberseg", "cyber", "practica", "intern"])) {
    return {
      texto: es
        ? "Año y medio en CMPC. Primero como analista de datos, con tableros en Power BI. Después en Cybersecurity Operations TI/OT, donde diseñó y puso en marcha el portal interno del área con Power Pages y Power Apps."
        : "A year and a half at CMPC. First as a data analyst building Power BI dashboards. Then in IT/OT Cybersecurity Operations, where he designed and launched the team's internal portal with Power Pages and Power Apps.",
      auto: irA("tiempos", "Ver experiencia", "See experience"),
    };
  }

  if (tieneRaiz(palabras, ["experien", "trayector", "tiempo", "historial", "career"]) && !tieneRaiz(palabras, ["vuelta", "lap"])) {
    return {
      texto: es
        ? "Te llevo a la torre de tiempos: la startup de bienestar, la tesis, CMPC y la universidad, de lo más reciente a lo más antiguo."
        : "Taking you to the timing tower: the wellness startup, the thesis, CMPC and university, newest first.",
      auto: irA("tiempos", "Ver experiencia", "See experience"),
    };
  }

  if (tieneRaiz(palabras, ["proyect", "project", "garage", "trabajos", "work", "portafolio", "portfolio", "demo"])) {
    return {
      texto: es
        ? `Siete autos en el garage: ${lista(c.proyectos.map((p) => p.nombre), "es")}. Nómbrame uno y te cuento cómo está hecho.`
        : `Seven cars in the garage: ${lista(c.proyectos.map((p) => p.nombre), "en")}. Name one and I'll tell you how it's built.`,
      auto: irA("garage", "Ir a proyectos", "Go to projects"),
    };
  }

  // --- Una tecnología concreta -------------------------------------------
  const tecnologia = tecnologiaMencionada(entrada, c.stack);
  if (tecnologia) {
    const usan = proyectosQueUsan(tecnologia, c.proyectos);
    const aprendiendo = c.incorporando.includes(tecnologia);
    const enProyectos = usan.length
      ? es
        ? ` La vas a ver en ${lista(usan.map((p) => p.nombre), "es")}.`
        : ` You'll see it in ${lista(usan.map((p) => p.nombre), "en")}.`
      : "";
    return {
      texto: aprendiendo
        ? es
          ? `${tecnologia} está en desarrollo: la está incorporando, y prefiere decirlo así antes que inflar el stack.`
          : `${tecnologia} is in development: he's picking it up, and would rather say so than pad the stack.`
        : es
          ? `Afirmativo, ${tecnologia} es parte de su stack.${enProyectos}`
          : `Affirmative, ${tecnologia} is part of his stack.${enProyectos}`,
      acciones: usan.slice(0, 3).map((p) => irA(`proyecto-${p.slug}`, p.nombre, p.nombre)),
    };
  }

  if (tieneRaiz(palabras, ["stack", "sistema", "system", "tecnolog", "technolog", "tech", "herramient", "tool", "lenguaje", "language", "framework", "sabes", "know", "usas", "use"])) {
    if (tieneRaiz(palabras, ["idioma", "language"]) && tieneRaiz(palabras, ["habla", "speak"])) {
      // Lo resuelve el bloque de idiomas hablados, más abajo.
    } else {
      return {
        texto: es
          ? "React, TypeScript, Tailwind y Next.js en el frontend; Power BI, Python y Postgres del lado de los datos. Te dejo en los sistemas, con lo que está incorporando aparte."
          : "React, TypeScript, Tailwind and Next.js on the frontend; Power BI, Python and Postgres on the data side. Dropping you at the systems, with what he's still learning listed apart.",
        auto: irA("sistemas", "Ir al stack", "Go to stack"),
      };
    }
  }

  if (tieneRaiz(palabras, ["habla", "speak", "ingles", "english", "espanol", "spanish"]) &&
      tieneRaiz(palabras, ["habla", "speak", "nivel", "level"])) {
    return {
      texto: es
        ? "Español nativo e inglés intermedio-avanzado."
        : "Native Spanish and upper-intermediate English.",
    };
  }

  if (tieneRaiz(palabras, ["noche", "night", "oscur", "dark", "dia", "day", "claro", "light", "tema", "theme", "modo", "mode"])) {
    return {
      texto: es ? "Cambiando la luz de la pista." : "Switching the track lights.",
      auto: { tipo: "tema", texto: es ? "Cambiar tema" : "Toggle theme" },
    };
  }

  if (tieneRaiz(palabras, ["ingles", "english", "espanol", "spanish", "idioma", "language"])) {
    return {
      texto: es ? "Switching to English." : "Cambiando a español.",
      auto: { tipo: "idioma", texto: es ? "English" : "Español" },
    };
  }

  if (tieneRaiz(palabras, ["vuelta", "lap", "cronometr", "timer", "reloj", "clock", "sector"])) {
    return {
      texto: es
        ? "Tu vuelta empezó al abrir la página. Cada sección es un sector y guardo tu parcial cuando entras. En el box está tu tiempo final. Morado es tu mejor marca, como en la Fórmula 1."
        : "Your lap started when you opened the page. Each section is a sector and I log your split as you enter it. Your final time is waiting in the pit box. Purple is your best, just like in Formula 1.",
      auto: irA("box", "Ver mi vuelta", "See my lap"),
    };
  }

  if (tieneRaiz(palabras, ["atajo", "shortcut", "teclado", "keyboard", "tecla", "key"])) {
    return {
      texto: es
        ? "Atajos: / o ⌘K abre esta radio, 1 a 5 saltan de sector, 0 vuelve a la parrilla, N cambia la luz y L el idioma. Si te estorban, apágalos aquí."
        : "Shortcuts: / or ⌘K opens this radio, 1 to 5 jump between sectors, 0 goes back to the grid, N toggles the lights and L the language. If they get in the way, turn them off here.",
      acciones: [{ tipo: "atajos", texto: es ? "Activar o apagar atajos" : "Turn shortcuts on or off" }],
    };
  }

  if (tieneRaiz(palabras, ["auto", "car", "f1", "formula", "race", "carrera", "motor", "piloto", "driver", "velocidad", "speed"])) {
    return {
      texto: es
        ? "Los autos son su mayor inspiración. De la Fórmula 1 se queda con la obsesión por el detalle: una vuelta se gana en milésimas, y una interfaz también. Por eso esta página es una vuelta de clasificación."
        : "Cars are his biggest inspiration. From Formula 1 he keeps the obsession with detail: a lap is won by thousandths, and so is an interface. That's why this page is a qualifying lap.",
    };
  }

  if (tieneRaiz(palabras, ["inicio", "top", "arriba", "parrilla", "grid", "home", "start"])) {
    return {
      texto: es ? "De vuelta a la parrilla." : "Back to the grid.",
      auto: irA("parrilla", "Ir al inicio", "Go to top"),
    };
  }

  if (tieneRaiz(palabras, ["quien", "who", "about", "sobre", "benja", "benjamin", "pena", "him", "edad", "age", "vive", "live", "donde", "where"])) {
    return {
      texto: es
        ? "Benjamín Peña, desarrollador frontend y analista de datos, de Ñuñoa, Santiago. Construye interfaces con React y TypeScript y entiende los datos que muestran, porque viene de Power BI. Egresa en noviembre de 2026."
        : "Benjamín Peña, frontend developer and data analyst from Ñuñoa, Santiago. He builds interfaces with React and TypeScript and understands the data they show, because he comes from Power BI. He graduates in November 2026.",
      auto: irA("piloto", "Sobre él", "About him"),
    };
  }

  return {
    texto: es
      ? "No tengo eso en la radio. Prueba con «proyectos», «¿sabes React?», «tesis», «cv» o «contacto»."
      : "I don't have that on the radio. Try “projects”, “do you know React?”, “thesis”, “cv” or “contact”.",
    acciones: [
      irA("garage", "Proyectos", "Projects"),
      accionCorreo,
    ],
  };
}
