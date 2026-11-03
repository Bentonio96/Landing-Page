import { CLAVE_OBRA } from "@/lib/obra";

/**
 * El motor de la obra: mueve a los agentes, les reparte las piezas y lleva
 * la cuenta de la píldora.
 *
 * Todo es imperativo y fuera de React a propósito. Son decenas de cursores
 * moviéndose a 60 fps: pasar eso por el estado de React sería re-renderizar
 * la página entera en cada cuadro. Aquí cada cuadro solo escribe un
 * `transform` por agente en movimiento, que el navegador compone en la GPU
 * sin tocar el layout.
 *
 * Los agentes viven en una capa absoluta en coordenadas de documento (no
 * fija): el scroll los arrastra junto con la página sin una sola línea de
 * JavaScript, y el bucle se detiene cuando ningún agente se mueve.
 */

export type Modo = "completa" | "breve" | "armada";

type Punto = { x: number; y: number };

type Movimiento = {
  desde: Punto;
  hasta: Punto;
  t0: number;
  dur: number;
  curva: number;
  facil: (p: number) => number;
  alLlegar?: () => void;
};

type Agente = {
  el: HTMLDivElement;
  nombre: string;
  x: number;
  y: number;
  mov: Movimiento | null;
  ocupado: boolean;
  visible: boolean;
};

type Pieza = {
  el: HTMLElement;
  tipo: "texto" | "caja";
  etiqueta: string;
  seccion: Seccion;
  padre: Pieza | null;
  /** 0 pendiente · 1 en manos de un agente · 2 asentada */
  estado: 0 | 1 | 2;
  /** Cuándo empezó a dibujarse (cajas): sus hijas pueden partir antes de que termine. */
  armadaEn: number;
};

type Seccion = {
  el: HTMLElement;
  id: string;
  piezas: Pieza[];
  encolada: boolean;
  visible: boolean;
  fusionada: boolean;
  respaldo: number;
};

type Tween = {
  t0: number;
  dur: number;
  paso: (p: number) => void;
  fin?: () => void;
};

export type Refs = {
  capa: HTMLElement;
  telon: HTMLElement;
  logo: HTMLElement;
  ficha: SVGGraphicsElement;
  trazoP: SVGPathElement;
  trazoD: SVGPathElement;
  agentes: HTMLElement;
  capas: HTMLElement;
  total: HTMLElement;
  prs: HTMLElement;
  totalPrs: HTMLElement;
};

export type Avisos = {
  alTerminar: () => void;
  alReiniciar: () => void;
};

const COLORES = ["#FF7AC6", "#5CD0FF", "#5BE49B", "#FFD25C", "#B9A8FF", "#FF9F66"];

/** Los seis con nombre son los roles con los que Benja reparte el trabajo. */
const NOMBRES = [
  "front", "api", "infra", "jarvis", "datos", "qa",
  "a11y", "i18n", "tests", "perf", "seo", "docs",
  "ui", "css", "tipos", "lint", "deploy", "review",
  "copy", "motion", "build", "assets", "datos-2", "front-2",
];

const CON_ETIQUETA = 6;

const SVG_CURSOR =
  '<svg viewBox="0 0 15 18" aria-hidden="true"><path d="M1.2 1.2v13.6l3.7-3.5 2.6 5.6 2.4-1.1-2.6-5.5h5.3z" fill="var(--c)" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';

const facilSuave = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const facilSalida = (p: number) => 1 - Math.pow(1 - p, 3);

/** Mismo tiempo que la transición CSS de [data-pieza]. */
const T_ARMAR = 440;

export class Motor {
  private refs: Refs;
  private avisos: Avisos;
  private agentes: Agente[] = [];
  private secciones: Seccion[] = [];
  private piezas: Pieza[] = [];
  private marcos: HTMLDivElement[] = [];
  private marcoSiguiente = 0;
  private tweens = new Set<Tween>();
  private raf = 0;
  private temporizadores = new Set<number>();
  private io: IntersectionObserver | null = null;
  private capas = 0;
  private prs = 0;
  private enIntro = false;
  private terminado = false;
  private velocidad = 1;
  private escuchas: Array<() => void> = [];

  constructor(refs: Refs, avisos: Avisos) {
    this.refs = refs;
    this.avisos = avisos;
  }

  // ─── Ciclo de vida ──────────────────────────────────────────

  iniciar(modo: Modo) {
    this.leerPiezas();
    this.crearAgentes();
    this.crearMarcos();
    this.refs.total.textContent = String(this.piezas.length);
    this.refs.totalPrs.textContent = String(this.secciones.length);
    this.refs.agentes.textContent = String(this.agentes.length);

    if (modo === "armada") {
      this.armarTodo();
      return;
    }

    this.escuchar();

    if (modo === "breve") {
      // Solo el titular se rearma; el resto llega armado.
      for (const s of this.secciones) {
        if (s.id !== "inicio") this.fusionarDeUna(s);
      }
      this.pintarContadores();
      this.observar();
      return;
    }

    this.pintarContadores();
    this.intro();
  }

  destruir() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.temporizadores.forEach((t) => clearTimeout(t));
    this.temporizadores.clear();
    this.secciones.forEach((s) => clearTimeout(s.respaldo));
    this.io?.disconnect();
    this.escuchas.forEach((quitar) => quitar());
    this.escuchas = [];
    this.agentes.forEach((a) => a.el.remove());
    this.marcos.forEach((m) => m.remove());
    this.agentes = [];
    this.marcos = [];
    this.tweens.clear();
  }

  /** Botón «Saltar», Escape o foco con teclado: todo armado al instante. */
  saltar() {
    if (this.terminado) return;
    this.cerrarIntro(true);
    this.armarTodo();
  }

  /** Botón «Rearmar»: vuelve a correr la obra entera desde el logo. */
  rearmar() {
    this.destruir();
    const html = document.documentElement;
    html.removeAttribute("data-intro-hecha");
    html.setAttribute("data-obra-instante", "");
    for (const p of this.piezas) {
      p.el.removeAttribute("data-armada");
      p.el.removeAttribute("data-oculta");
      this.limpiarEscritura(p);
    }
    html.setAttribute("data-obra", "completa");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    this.reiniciarLogo();
    this.capas = 0;
    this.prs = 0;
    this.terminado = false;
    this.piezas = [];
    this.secciones = [];
    this.avisos.alReiniciar();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.removeAttribute("data-obra-instante");
        this.iniciar("completa");
      });
    });
  }

  // ─── Preparación ────────────────────────────────────────────

  private leerPiezas() {
    const porElemento = new Map<HTMLElement, Pieza>();
    this.secciones = Array.from(
      document.querySelectorAll<HTMLElement>("[data-seccion]"),
    ).map((el) => ({
      el,
      id: el.dataset.seccion ?? "",
      piezas: [],
      encolada: false,
      visible: false,
      fusionada: false,
      respaldo: 0,
    }));

    for (const seccion of this.secciones) {
      for (const el of seccion.el.querySelectorAll<HTMLElement>("[data-pieza]")) {
        const padreEl = el.parentElement?.closest<HTMLElement>("[data-pieza]");
        const pieza: Pieza = {
          el,
          tipo: el.dataset.tipo === "caja" ? "caja" : "texto",
          etiqueta: el.dataset.pieza ?? "",
          seccion,
          padre: padreEl ? (porElemento.get(padreEl) ?? null) : null,
          estado: el.hasAttribute("data-armada") ? 2 : 0,
          armadaEn: 0,
        };
        porElemento.set(el, pieza);
        seccion.piezas.push(pieza);
        this.piezas.push(pieza);
      }
    }
  }

  private crearAgentes() {
    const ancho = window.innerWidth;
    const cuantos = ancho < 640 ? 10 : ancho < 1024 ? 16 : 28;
    this.velocidad = ancho < 640 ? 0.75 : 1;
    const inicio = this.puntoPastilla();

    for (let i = 0; i < cuantos; i++) {
      const el = document.createElement("div");
      el.className = "agente";
      el.style.setProperty("--c", COLORES[i % COLORES.length]);
      el.innerHTML =
        SVG_CURSOR +
        (i < CON_ETIQUETA ? `<span class="agente-nombre">${NOMBRES[i]}</span>` : "");
      el.setAttribute("data-oculto", "");
      this.refs.capa.appendChild(el);
      const agente: Agente = {
        el,
        nombre: NOMBRES[i % NOMBRES.length],
        x: inicio.x,
        y: inicio.y,
        mov: null,
        ocupado: false,
        visible: false,
      };
      this.ubicar(agente);
      this.agentes.push(agente);
    }
  }

  private crearMarcos() {
    for (let i = 0; i < 14; i++) {
      const m = document.createElement("div");
      m.className = "marco";
      m.innerHTML = "<i></i><i></i><i></i><i></i><b></b><span></span>";
      this.refs.capa.appendChild(m);
      this.marcos.push(m);
    }
  }

  private escuchar() {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") this.saltar();
    };
    // Quien navega con teclado quiere el contenido: si el foco cae en una
    // pieza sin armar, se arma; si cae bajo el telón, se salta todo.
    const alEnfocar = (e: FocusEvent) => {
      const destino = e.target as HTMLElement | null;
      // Solo cuenta el foco en el contenido: el salto al contenido y la
      // píldora quedan fuera del telón y no deben cortar la obra.
      if (!destino || !destino.closest("main, header, footer")) return;
      if (this.enIntro) {
        this.saltar();
        return;
      }
      let el = destino.closest<HTMLElement>("[data-pieza]");
      while (el) {
        const p = this.piezas.find((x) => x.el === el);
        if (p && p.estado !== 2) this.asentarSinAgente(p);
        el = el.parentElement?.closest<HTMLElement>("[data-pieza]") ?? null;
      }
    };
    // Un scroll durante la intro es apuro: se adelanta el logo, pero los
    // agentes siguen armando lo que entra en pantalla.
    const alApurar = () => {
      if (this.enIntro) this.cerrarIntro(true);
    };
    window.addEventListener("keydown", alTeclear);
    document.addEventListener("focusin", alEnfocar);
    window.addEventListener("wheel", alApurar, { passive: true });
    window.addEventListener("touchmove", alApurar, { passive: true });
    this.escuchas.push(
      () => window.removeEventListener("keydown", alTeclear),
      () => document.removeEventListener("focusin", alEnfocar),
      () => window.removeEventListener("wheel", alApurar),
      () => window.removeEventListener("touchmove", alApurar),
    );
  }

  private observar() {
    this.io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const s = this.secciones.find((x) => x.el === entrada.target);
          if (!s) continue;
          s.visible = entrada.isIntersecting;
          if (entrada.isIntersecting && !s.encolada && !s.fusionada) this.encolar(s);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    this.secciones.forEach((s) => this.io!.observe(s.el));
  }

  // ─── Intro: el logo ─────────────────────────────────────────

  private intro() {
    this.enIntro = true;
    const [infra, front, api, jarvis, datos, qa] = this.agentes;
    const svg = this.refs.ficha.ownerSVGElement!;
    const caja = this.refs.logo.getBoundingClientRect();
    const sy = window.scrollY;
    const esq = (fx: number, fy: number): Punto => ({
      x: caja.left + caja.width * fx,
      y: caja.top + caja.height * fy + sy,
    });

    // Entran desde los bordes, sin salirse nunca de la pantalla: un cursor
    // fuera del viewport ensancha el layout en móviles y suma CLS.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bordes: Punto[] = [
      { x: 2, y: vh * 0.3 + sy },
      { x: vw - 60, y: vh * 0.12 + sy },
      { x: vw * 0.8, y: vh - 24 + sy },
      { x: vw * 0.2, y: 4 + sy },
      { x: vw - 60, y: vh * 0.75 + sy },
      { x: 2, y: vh * 0.85 + sy },
    ];
    const llegada: Punto[] = [
      esq(0, 0),
      esq(0.2, 0.09),
      esq(0.52, 0.52),
      esq(0.5, 1.12),
      esq(1.15, 0.35),
      esq(-0.2, 0.75),
    ];
    [infra, front, api, jarvis, datos, qa].forEach((a, i) => {
      if (!a) return;
      a.x = bordes[i].x;
      a.y = bordes[i].y;
      this.ubicar(a);
      this.mostrar(a);
      this.mover(a, llegada[i], 620 + i * 60, facilSalida);
    });

    // 1 · infra arrastra la ficha desde la esquina, como un rectángulo nuevo.
    this.despues(680, () => {
      const marco = this.mostrarMarco(caja.left, caja.top + sy, 0, 0, "infra · ficha");
      this.tween(560, (p) => {
        const e = facilSuave(p);
        this.refs.ficha.style.transform = `scale(${e})`;
        const w = caja.width * e;
        const h = caja.height * e;
        this.dimensionarMarco(marco, caja.left, caja.top + sy, w, h, `infra · ficha ${Math.round(64 * e)}×${Math.round(64 * e)}`);
        if (infra) {
          infra.x = caja.left + w;
          infra.y = caja.top + sy + h;
          this.ubicar(infra);
        }
      }, () => this.ocultarMarco(marco, 300));
    });

    // 2 · front dibuja la P y api la D, siguiendo la punta del trazo.
    const dibujar = (agente: Agente | undefined, trazo: SVGPathElement, dur: number) => {
      const largo = trazo.getTotalLength();
      trazo.style.strokeDasharray = `${largo}`;
      trazo.style.strokeDashoffset = `${largo}`;
      this.tween(dur, (p) => {
        const e = facilSuave(p);
        trazo.style.strokeDashoffset = `${largo * (1 - e)}`;
        if (!agente) return;
        const punto = trazo.getPointAtLength(largo * e);
        const m = svg.getScreenCTM();
        if (!m) return;
        agente.x = m.a * punto.x + m.c * punto.y + m.e;
        agente.y = m.b * punto.x + m.d * punto.y + m.f + window.scrollY;
        this.ubicar(agente);
      }, () => {
        trazo.style.fillOpacity = "1";
      });
    };
    this.despues(1240, () => dibujar(front, this.refs.trazoP, 980));
    this.despues(1560, () => dibujar(api, this.refs.trazoD, 760));

    // 3 · jarvis revisa el conjunto y qa da el visto bueno.
    this.despues(2380, () => {
      if (jarvis) this.mover(jarvis, esq(0.86, 0.9), 380, facilSuave);
      if (qa) this.mover(qa, esq(0.12, 0.16), 380, facilSuave);
      if (datos) this.mover(datos, esq(0.95, 0.2), 380, facilSuave);
      const r = this.refs.logo.getBoundingClientRect();
      const m = this.mostrarMarco(r.left - 6, r.top - 6 + window.scrollY, r.width + 12, r.height + 12, "jarvis · B = P + D ✓");
      this.ocultarMarco(m, 620);
    });

    this.despues(3000, () => this.cerrarIntro(false));
  }

  /** Lleva el logo al encabezado y levanta el telón. */
  private cerrarIntro(deGolpe: boolean) {
    if (!this.enIntro) return;
    this.enIntro = false;
    const html = document.documentElement;

    // El titular esperó visible bajo el telón (así el navegador lo pinta en
    // el primer cuadro). Antes de levantarlo se esconde para que los agentes
    // lo escriban frente a quien visita.
    for (const p of this.piezas) {
      if (p.seccion.id === "inicio" && p.estado === 0) p.el.setAttribute("data-oculta", "");
    }

    const terminarTelon = () => {
      html.setAttribute("data-intro-hecha", "");
      this.refs.telon.removeAttribute("data-saliendo");
      try {
        localStorage.setItem(CLAVE_OBRA, "1");
      } catch {
        // Sin almacenamiento la próxima visita repite la intro; nada más.
      }
    };

    if (deGolpe) {
      this.temporizadores.forEach((t) => clearTimeout(t));
      this.temporizadores.clear();
      this.tweens.clear();
      terminarTelon();
      if (!this.terminado) this.soltarAgentes();
      return;
    }

    // FLIP: el glifo del telón viaja hasta el hueco del logo del encabezado.
    const hueco = document.querySelector<HTMLElement>("[data-logo-slot]");
    const glifo = this.refs.trazoP.ownerSVGElement!.querySelector("g")!;
    if (hueco) {
      const a = glifo.getBoundingClientRect();
      const b = hueco.getBoundingClientRect();
      const escala = b.height / a.height;
      const logoCaja = this.refs.logo.getBoundingClientRect();
      const ox = a.left + a.width / 2 - logoCaja.left;
      const oy = a.top + a.height / 2 - logoCaja.top;
      this.refs.logo.style.transformOrigin = `${ox}px ${oy}px`;
      this.refs.logo.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${escala})`;
    }
    this.refs.logo.setAttribute("data-aterrizando", "");
    this.refs.telon.setAttribute("data-saliendo", "");
    this.soltarAgentes();
    this.despues(720, terminarTelon);
  }

  private reiniciarLogo() {
    const { logo, ficha, trazoP, trazoD, telon } = this.refs;
    logo.removeAttribute("data-aterrizando");
    logo.style.transform = "";
    telon.removeAttribute("data-saliendo");
    ficha.style.transform = "";
    for (const t of [trazoP, trazoD]) {
      t.style.strokeDasharray = "";
      t.style.strokeDashoffset = "";
      t.style.fillOpacity = "";
    }
  }

  /** Después del logo, los agentes se reparten por el titular. */
  private soltarAgentes() {
    this.observar();
  }

  // ─── Reparto de piezas ──────────────────────────────────────

  private encolar(s: Seccion) {
    s.encolada = true;
    const desde = this.puntoPastilla();
    for (const a of this.agentes) {
      if (!a.visible) {
        a.x = desde.x + (Math.random() - 0.5) * 80;
        a.y = desde.y;
        this.ubicar(a);
        this.mostrar(a);
      }
    }
    // Si los agentes no alcanzan (scroll muy rápido, equipo lento), lo que
    // quede se arma solo: nadie espera más de unos segundos por contenido.
    s.respaldo = window.setTimeout(() => {
      for (const p of s.piezas) if (p.estado === 0) this.asentarSinAgente(p);
    }, 6500);
    this.despachar();
  }

  private siguientePieza(): Pieza | null {
    let deReserva: Pieza | null = null;
    for (const s of this.secciones) {
      if (!s.encolada || s.fusionada) continue;
      for (const p of s.piezas) {
        if (p.estado !== 0) continue;
        if (p.padre && !this.padreListo(p.padre)) continue;
        if (s.visible) return p;
        deReserva ??= p;
        break;
      }
    }
    return deReserva;
  }

  /**
   * Una hija puede empezar cuando su caja ya está casi dibujada: el recorte
   * no mueve a las hijas, así que medirlas a mitad de camino es seguro. Con
   * un padre de texto hay que esperar, porque ese sí se desplaza.
   */
  private padreListo(padre: Pieza) {
    if (padre.estado === 2) return true;
    return padre.tipo === "caja" && padre.armadaEn > 0 && performance.now() - padre.armadaEn > 240;
  }

  private despachar() {
    if (this.terminado || this.enIntro) return;
    for (const a of this.agentes) {
      if (a.ocupado || !a.visible) continue;
      const p = this.siguientePieza();
      if (p) {
        this.asignar(a, p);
      } else if (this.quedaTrabajo()) {
        this.vagar(a);
      } else {
        this.retirar(a);
      }
    }
  }

  private quedaTrabajo() {
    return this.secciones.some(
      (s) => s.encolada && !s.fusionada && s.piezas.some((p) => p.estado !== 2),
    );
  }

  private asignar(a: Agente, p: Pieza) {
    p.estado = 1;
    a.ocupado = true;
    const r = p.el.getBoundingClientRect();
    const sx = window.scrollX;
    const sy = window.scrollY;

    if (p.tipo === "caja") {
      // Dibuja la caja: de la esquina superior izquierda a la inferior derecha.
      const ini = { x: r.left + sx, y: r.top + sy };
      this.mover(a, ini, this.duracionHasta(a, ini), facilSuave, () => {
        if (p.estado === 2) return this.liberar(a);
        p.el.setAttribute("data-armada", "");
        p.armadaEn = performance.now();
        // Las hijas ya se pueden repartir: hay que avisar a los libres.
        this.despues(260, () => this.despachar());
        const marco = this.mostrarMarco(ini.x, ini.y, r.width, r.height, `${a.nombre} · ${p.etiqueta}`);
        this.mover(a, { x: r.right + sx - 6, y: r.bottom + sy - 6 }, T_ARMAR, facilSalida, () => {
          this.ocultarMarco(marco, 380);
          this.asentar(p);
          this.liberar(a);
        });
      });
      return;
    }

    // Texto: el agente lo escribe. Se revela línea a línea bajo el cursor,
    // de izquierda a derecha, como si lo estuviera tipeando.
    const ini = { x: r.left + sx, y: r.top + sy + Math.min(r.height / 2, this.altoLinea(p.el) / 2) };
    this.mover(a, ini, this.duracionHasta(a, ini), facilSuave, () => {
      if (p.estado === 2) return this.liberar(a);
      this.escribir(a, p, () => {
        this.asentar(p);
        this.liberar(a);
      });
    });
  }

  private altoLinea(el: HTMLElement) {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    return Number.isFinite(lh) ? lh : parseFloat(cs.fontSize) * 1.4;
  }

  /**
   * Revela una pieza de texto con un clip-path poligonal: las líneas ya
   * escritas completas y la actual hasta la punta del cursor. No parte el
   * texto en spans (los lectores de pantalla lo siguen leyendo entero) y
   * sirve igual para un chip de una palabra que para un párrafo.
   */
  private escribir(a: Agente, p: Pieza, fin: () => void) {
    const el = p.el;
    const r = el.getBoundingClientRect();
    const lh = this.altoLinea(el);
    const lineas = Math.max(1, Math.round(r.height / lh));
    const alto = r.height / lineas;
    const ancho = r.width;
    const holgura = alto * 0.3; // acentos y descendentes que asoman de la caja
    const caracteres = (el.textContent ?? "").trim().length;
    const dur = Math.min(1500, 240 + caracteres * 11) * this.velocidad;
    const x0 = r.left + window.scrollX;
    const y0 = r.top + window.scrollY;

    el.style.transition = "none";
    el.setAttribute("data-escribiendo", "");
    const marco = this.mostrarMarco(x0, y0, ancho, r.height, `${a.nombre} · ${p.etiqueta} ${Math.round(ancho)}×${Math.round(r.height)}`);

    this.tween(dur, (t) => {
      if (p.estado === 2) return;
      const avance = t * lineas;
      const i = Math.min(lineas - 1, Math.floor(avance));
      const x = t >= 1 ? ancho : (avance - i) * ancho;
      const arriba = i === 0 ? -holgura : i * alto;
      const abajo = i === lineas - 1 ? r.height + holgura : (i + 1) * alto;
      const h = -holgura;
      const w = ancho + holgura;
      el.style.clipPath = `polygon(${h}px ${h}px, ${w}px ${h}px, ${w}px ${arriba}px, ${x}px ${arriba}px, ${x}px ${abajo}px, ${h}px ${abajo}px)`;
      a.x = x0 + x;
      a.y = y0 + i * alto + alto * 0.55;
      this.ubicar(a);
    }, () => {
      this.limpiarEscritura(p);
      this.ocultarMarco(marco, 260);
      fin();
    });
  }

  private limpiarEscritura(p: Pieza) {
    p.el.style.clipPath = "";
    p.el.style.transition = "";
    p.el.removeAttribute("data-escribiendo");
  }

  private liberar(a: Agente) {
    this.despues(40, () => {
      a.ocupado = false;
      this.despachar();
    });
  }

  private asentar(p: Pieza) {
    if (p.estado === 2) return;
    p.estado = 2;
    p.el.setAttribute("data-armada", "");
    this.capas++;
    this.revisarSeccion(p.seccion);
    this.pintarContadores();
  }

  private asentarSinAgente(p: Pieza) {
    // Una pieza no puede quedar armada dentro de un padre sin armar.
    if (p.padre && p.padre.estado !== 2) this.asentarSinAgente(p.padre);
    this.limpiarEscritura(p);
    this.asentar(p);
  }

  private revisarSeccion(s: Seccion) {
    if (s.fusionada || s.piezas.some((p) => p.estado !== 2)) return;
    s.fusionada = true;
    clearTimeout(s.respaldo);
    this.prs++;
    if (this.secciones.every((x) => x.fusionada)) this.terminar();
  }

  private fusionarDeUna(s: Seccion) {
    for (const p of s.piezas) {
      if (p.estado !== 2) {
        p.estado = 2;
        this.limpiarEscritura(p);
        p.el.setAttribute("data-armada", "");
        this.capas++;
      }
    }
    s.encolada = true;
    s.fusionada = true;
    this.prs++;
  }

  private armarTodo() {
    const html = document.documentElement;
    html.setAttribute("data-obra-instante", "");
    // Las escrituras a medias no deben seguir pintando recortes encima.
    this.tweens.clear();
    for (const s of this.secciones) if (!s.fusionada) this.fusionarDeUna(s);
    this.agentes.forEach((a) => this.ocultar(a));
    this.marcos.forEach((m) => m.removeAttribute("data-visible"));
    this.pintarContadores();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => html.removeAttribute("data-obra-instante")),
    );
    this.terminar();
  }

  private terminar() {
    if (this.terminado) return;
    this.terminado = true;
    this.io?.disconnect();
    this.secciones.forEach((s) => clearTimeout(s.respaldo));
    try {
      localStorage.setItem(CLAVE_OBRA, "1");
    } catch {
      // Ver cerrarIntro.
    }
    for (const a of this.agentes) if (a.visible) this.retirar(a);
    this.avisos.alTerminar();
  }

  private pintarContadores() {
    this.refs.capas.textContent = String(this.capas);
    this.refs.prs.textContent = String(this.prs);
  }

  // ─── Movimiento ─────────────────────────────────────────────

  private vagar(a: Agente) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const destino = {
      x: window.scrollX + vw * (0.12 + Math.random() * 0.76),
      y: window.scrollY + vh * (0.18 + Math.random() * 0.6),
    };
    a.ocupado = true;
    this.mover(a, destino, 900 + Math.random() * 700, facilSuave, () => {
      a.ocupado = false;
      this.despachar();
    });
  }

  /** Vuelven a la píldora y se esconden; el bucle se apaga solo. */
  private retirar(a: Agente) {
    if (!a.visible) return;
    a.ocupado = true;
    const p = this.puntoPastilla();
    this.mover(a, { x: p.x + (Math.random() - 0.5) * 60, y: p.y }, 700, facilSuave, () => {
      this.ocultar(a);
      a.ocupado = false;
    });
  }

  private puntoPastilla(): Punto {
    return {
      x: window.scrollX + window.innerWidth / 2,
      y: window.scrollY + window.innerHeight - 36,
    };
  }

  private duracionHasta(a: Agente, b: Punto) {
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    return Math.min(640, 200 + d * 0.45) * this.velocidad;
  }

  private mover(
    a: Agente,
    hasta: Punto,
    dur: number,
    facil: (p: number) => number,
    alLlegar?: () => void,
  ) {
    const d = Math.hypot(hasta.x - a.x, hasta.y - a.y);
    a.mov = {
      desde: { x: a.x, y: a.y },
      hasta,
      t0: performance.now(),
      dur: Math.max(1, dur),
      curva: (Math.random() - 0.5) * Math.min(120, d * 0.3),
      facil,
      alLlegar,
    };
    this.arrancar();
  }

  private tween(dur: number, paso: (p: number) => void, fin?: () => void) {
    this.tweens.add({ t0: performance.now(), dur, paso, fin });
    this.arrancar();
  }

  private arrancar() {
    if (!this.raf) this.raf = requestAnimationFrame(this.cuadro);
  }

  private cuadro = (ahora: number) => {
    this.raf = 0;
    let activo = false;

    for (const t of this.tweens) {
      const p = Math.min(1, (ahora - t.t0) / t.dur);
      t.paso(p);
      if (p >= 1) {
        this.tweens.delete(t);
        t.fin?.();
      } else {
        activo = true;
      }
    }

    for (const a of this.agentes) {
      const m = a.mov;
      if (!m) continue;
      const p = Math.min(1, Math.max(0, (ahora - m.t0) / m.dur));
      const e = m.facil(p);
      const vx = m.hasta.x - m.desde.x;
      const vy = m.hasta.y - m.desde.y;
      const largo = Math.hypot(vx, vy) || 1;
      const arco = Math.sin(Math.PI * p) * m.curva;
      a.x = m.desde.x + vx * e + (-vy / largo) * arco;
      a.y = m.desde.y + vy * e + (vx / largo) * arco;
      this.ubicar(a);
      if (p >= 1) {
        a.mov = null;
        m.alLlegar?.();
      }
      if (a.mov) activo = true;
    }

    if (activo || this.tweens.size) this.arrancar();
  };

  private ubicar(a: Agente) {
    a.el.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
  }

  private mostrar(a: Agente) {
    a.visible = true;
    a.el.removeAttribute("data-oculto");
  }

  private ocultar(a: Agente) {
    a.visible = false;
    a.mov = null;
    a.el.setAttribute("data-oculto", "");
  }

  // ─── Marcos de selección ────────────────────────────────────

  private mostrarMarco(x: number, y: number, w: number, h: number, texto: string) {
    const m = this.marcos[this.marcoSiguiente];
    this.marcoSiguiente = (this.marcoSiguiente + 1) % this.marcos.length;
    this.dimensionarMarco(m, x, y, w, h, texto);
    m.setAttribute("data-visible", "");
    return m;
  }

  private dimensionarMarco(m: HTMLDivElement, x: number, y: number, w: number, h: number, texto: string) {
    m.style.transform = `translate(${x}px, ${y}px)`;
    m.style.width = `${w}px`;
    m.style.height = `${h}px`;
    const etiqueta = m.lastElementChild as HTMLElement;
    if (etiqueta.textContent !== texto) etiqueta.textContent = texto;
  }

  private ocultarMarco(m: HTMLDivElement, tras: number) {
    this.despues(tras, () => m.removeAttribute("data-visible"));
  }

  private despues(ms: number, fn: () => void) {
    const id = window.setTimeout(() => {
      this.temporizadores.delete(id);
      fn();
    }, ms);
    this.temporizadores.add(id);
  }
}
