"use client";

import { useEffect, useRef } from "react";

/**
 * Un solo campo de partículas para toda la página.
 *
 * El canvas está fijo sobre la ventana. Cada sección marca una zona con
 * `data-particulas="<escena>"`; los puntos forman la figura de la escena que
 * está al centro de la pantalla. Mientras la escena no cambia, los puntos
 * acompañan el scroll como si estuvieran pegados a la página; cuando cambia,
 * viajan en bandada a la figura de la sección siguiente.
 *
 * Escenas: el retrato (o el nombre) en el inicio, «Hola» en Sobre mí, «</>»
 * en el stack, cuatro carpetas en proyectos, la onda en experiencia, «@» en
 * contacto y el nombre en el pie.
 *
 * - El cursor (o el dedo) aparta los puntos; al irse, vuelven.
 * - El bucle se apaga cuando todo está quieto, y vuelve con el scroll, el
 *   cursor o un cambio de forma.
 * - Con movimiento reducido no hay vuelo ni empuje: los puntos se dibujan en
 *   su lugar y solo siguen al scroll.
 *
 * Solo blanco, negro y grises: el color es el del texto y el brillo de cada
 * punto se traduce en opacidad y tamaño.
 */

type Punto = { x: number; y: number; b: number };
type Dibujo = (c: CanvasRenderingContext2D, w: number, h: number) => void;
type Forma = { tipo: "imagen"; src: string } | { tipo: "texto"; texto: string } | { tipo: "dibujo"; dibujar: Dibujo };

const NIVELES = 6;

/** Cuatro carpetas, como las tarjetas de proyectos. */
const carpetas: Dibujo = (c, w, h) => {
  const n = 4;
  const hueco = w * 0.04;
  const ancho = Math.min((w - hueco * (n - 1)) / n, h * 1.25);
  const alto = Math.min(h * 0.86, ancho * 0.78);
  const x0 = (w - (ancho * n + hueco * (n - 1))) / 2;
  const y0 = (h - alto) / 2 + alto * 0.08;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (ancho + hueco);
    c.fillStyle = "#9a9a9a";
    c.beginPath();
    c.roundRect(x, y0 - alto * 0.12, ancho * 0.42, alto * 0.2, 4);
    c.fill();
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.roundRect(x, y0, ancho, alto * 0.92, 6);
    c.fill();
  }
};

/** La onda de la línea de tiempo, con sus nodos. */
const onda: Dibujo = (c, w, h) => {
  const medio = h / 2;
  const amp = h * 0.26;
  const grosor = Math.max(6, h * 0.07);
  c.strokeStyle = "#bdbdbd";
  c.lineWidth = grosor;
  c.lineCap = "round";
  c.beginPath();
  for (let x = grosor; x <= w - grosor; x += 4) {
    const y = medio + Math.sin((x / w) * Math.PI * 2.5 - 0.6) * amp;
    if (x === grosor) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();
  c.fillStyle = "#ffffff";
  for (let i = 0; i < 5; i++) {
    const x = grosor * 2 + (i / 4) * (w - grosor * 4);
    const y = medio + Math.sin((x / w) * Math.PI * 2.5 - 0.6) * amp;
    c.beginPath();
    c.arc(x, y, grosor * 1.6, 0, Math.PI * 2);
    c.fill();
  }
};

function formasDe(escena: string, idioma: string): Forma[] {
  switch (escena) {
    case "inicio":
      return [
        { tipo: "imagen", src: "/retrato.webp" },
        { tipo: "texto", texto: "BENJAMÍN" },
      ];
    case "sobre":
      return [{ tipo: "texto", texto: idioma === "en" ? "HELLO." : "¡HOLA!" }];
    case "stack":
      return [{ tipo: "texto", texto: "</>" }];
    case "proyectos":
      return [{ tipo: "dibujo", dibujar: carpetas }];
    case "experiencia":
      return [{ tipo: "dibujo", dibujar: onda }];
    case "contacto":
      return [{ tipo: "texto", texto: "@" }];
    case "pie":
      return [{ tipo: "texto", texto: "BENJAMÍN." }];
    default:
      return [];
  }
}

function cargarImagen(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

/** Dibuja la forma en un canvas del tamaño de la zona y la convierte en puntos. */
function muestrear(forma: Forma, img: HTMLImageElement | null, W: number, H: number, margen: number[], objetivo: number, fuente: string) {
  const [mt, mr, mb, ml] = margen;
  const rw = Math.max(10, W - ml - mr);
  const rh = Math.max(10, H - mt - mb);
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.max(1, Math.floor(W));
  lienzo.height = Math.max(1, Math.floor(H));
  const c = lienzo.getContext("2d", { willReadFrequently: true });
  if (!c) return { puntos: [] as Punto[], paso: 6 };

  let cobertura = 0.4;
  if (forma.tipo === "imagen") {
    if (!img) return { puntos: [] as Punto[], paso: 6 };
    const escala = Math.min(rw / img.naturalWidth, rh / img.naturalHeight);
    const w = img.naturalWidth * escala;
    const h = img.naturalHeight * escala;
    c.filter = "grayscale(1) contrast(1.15)";
    c.drawImage(img, ml + (rw - w) / 2, mt + rh - h, w, h);
    cobertura = ((w * h) / (rw * rh)) * 0.62;
  } else if (forma.tipo === "texto") {
    let tam = rh * 0.9;
    c.font = `800 ${tam}px ${fuente}`;
    const ancho = c.measureText(forma.texto).width;
    if (ancho > rw) tam *= rw / ancho;
    c.font = `800 ${tam}px ${fuente}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#fff";
    c.fillText(forma.texto, ml + rw / 2, mt + rh / 2 + tam * 0.04);
    cobertura = Math.min(0.5, (c.measureText(forma.texto).width * tam * 0.55) / (rw * rh)) * 0.75;
  } else {
    c.save();
    c.translate(ml, mt);
    forma.dibujar(c, rw, rh);
    c.restore();
    cobertura = 0.3;
  }

  // Lo dibujado pide puntos más separados que el retrato, para que se lean como puntos.
  const minimo = forma.tipo === "imagen" ? 2 : 4;
  const paso = Math.max(minimo, Math.min(10, Math.round(Math.sqrt((rw * rh * cobertura) / objetivo))));
  const datos = c.getImageData(0, 0, lienzo.width, lienzo.height).data;
  const puntos: Punto[] = [];
  // Grilla escalonada (filas corridas medio paso): orgánica sin ruido.
  for (let y = Math.floor(paso / 2), fila = 0; y < lienzo.height; y += paso, fila++) {
    for (let x = Math.floor(paso / 2) + (fila % 2 ? Math.floor(paso / 2) : 0); x < lienzo.width; x += paso) {
      const i = (y * lienzo.width + x) * 4;
      if (datos[i + 3] < 140) continue;
      const luz = (datos[i] * 0.3 + datos[i + 1] * 0.59 + datos[i + 2] * 0.11) / 255;
      const b = forma.tipo === "texto" ? 0.72 + Math.random() * 0.28 : luz;
      const j = paso * 0.12;
      puntos.push({ x: x + (Math.random() - 0.5) * j, y: y + (Math.random() - 0.5) * j, b });
    }
  }
  // Estira el contraste del retrato: lo más oscuro queda en 0 y lo más claro en 1.
  if (forma.tipo === "imagen" && puntos.length > 20) {
    const orden = puntos.map((p) => p.b).sort((a, b) => a - b);
    const bajo = orden[Math.floor(orden.length * 0.04)];
    const alto = orden[Math.floor(orden.length * 0.96)];
    const rango = Math.max(0.05, alto - bajo);
    for (const p of puntos) p.b = Math.min(1, Math.max(0, (p.b - bajo) / rango));
  }
  return { puntos, paso };
}

type Zona = {
  el: HTMLElement;
  escena: string;
  formas: Punto[][];
  pasos: number[];
  /** El retrato se lee al revés en tema claro (puntos oscuros donde hay sombra). */
  invierte: boolean[];
  oscuroFijo: boolean;
};

export function CampoParticulas({ idioma }: { idioma: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const raiz = document.documentElement;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches || raiz.hasAttribute("data-reducido");
    const tactil = window.matchMedia("(pointer: coarse)").matches;
    const radio = tactil ? 64 : 96;

    let W = 0;
    let H = 0;
    let zonas: Zona[] = [];
    let activa: Zona | null = null;
    let forma = 0;
    let formaInicio = 0;
    let ultimoY = 0;
    let n = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let lx = new Float32Array(0);
    let ly = new Float32Array(0);
    let nivel = new Uint8Array(0);
    let porNivel: Uint32Array[] = [];
    let tam = 1.6;
    let color = "#f2f2f2";
    let cuadro = 0;
    let ultimo = 0;
    let llegando = 0;
    let vivo = true;
    const imagenes = new Map<string, HTMLImageElement | null>();
    const puntero = { x: -9999, y: -9999, activo: false };

    function oscuro(z: Zona) {
      return z.oscuroFijo || raiz.getAttribute("data-tema") !== "light";
    }

    /** Pasa los puntos a la forma f de la zona z; los que sobran se apilan sobre otros. */
    function asignar(z: Zona, f: number, patada: boolean) {
      const lista = z.formas[f];
      if (!lista?.length) return;
      color = z.oscuroFijo ? "#F2F2F2" : getComputedStyle(canvas!).color;
      const inv = z.invierte[f] && !oscuro(z);
      const m = lista.length;
      for (let k = 0; k < n; k++) {
        const d = lista[k % m];
        lx[k] = d.x;
        ly[k] = d.y;
        const v = inv ? 1 - d.b : d.b;
        nivel[k] = Math.min(NIVELES, 1 + Math.floor(v * NIVELES));
        if (patada) {
          vx[k] += (Math.random() - 0.5) * 10;
          vy[k] += (Math.random() - 0.5) * 10;
        }
      }
      const cuentas = new Array(NIVELES + 1).fill(0);
      for (let k = 0; k < n; k++) cuentas[nivel[k]]++;
      porNivel = cuentas.map((c) => new Uint32Array(c));
      const llenos = new Array(NIVELES + 1).fill(0);
      for (let k = 0; k < n; k++) porNivel[nivel[k]][llenos[nivel[k]]++] = k;
      tam = Math.max(1.1, Math.min(3, (z.pasos[f] ?? 5) * (z.invierte[f] ? 0.48 : 0.42)));
    }

    /** La zona activa es la más cercana al centro de la pantalla. */
    function elegir(): Zona | null {
      let mejor: Zona | null = null;
      let distancia = Infinity;
      const centro = H * 0.5;
      for (const z of zonas) {
        const r = z.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H || r.height === 0) continue;
        const d = Math.abs(r.top + r.height / 2 - centro);
        if (d < distancia) {
          distancia = d;
          mejor = z;
        }
      }
      return mejor ?? activa;
    }

    async function preparar() {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (document.fonts?.ready) await document.fonts.ready;
      const fuente = getComputedStyle(document.body).fontFamily;
      const ancho = W >= 1024;
      const nuevas: Zona[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-particulas]"))) {
        const escena = el.dataset.particulas!;
        const formas = formasDe(escena, idioma);
        const r = el.getBoundingClientRect();
        if (!formas.length || r.width < 20 || r.height < 20) continue;
        const margen = (ancho ? el.dataset.margen : el.dataset.margenMovil ?? el.dataset.margen)?.split(",").map(Number) ?? [0, 0, 0, 0];
        const objetivoBase = escena === "inicio" ? 14000 : 3200;
        const objetivo = Math.max(500, Math.round(objetivoBase * Math.min(1, (r.width * r.height) / (900 * 700)) ** 0.5 * (tactil ? 0.7 : 1)));
        const muestras = [];
        for (const f of formas) {
          let img: HTMLImageElement | null = null;
          if (f.tipo === "imagen") {
            if (!imagenes.has(f.src)) imagenes.set(f.src, await cargarImagen(f.src));
            img = imagenes.get(f.src) ?? null;
          }
          muestras.push(muestrear(f, img, r.width, r.height, margen, objetivo, fuente));
        }
        nuevas.push({
          el,
          escena,
          formas: muestras.map((m) => m.puntos),
          pasos: muestras.map((m) => m.paso),
          invierte: formas.map((f) => f.tipo === "imagen"),
          oscuroFijo: el.hasAttribute("data-oscuro"),
        });
      }
      if (!vivo) return;
      zonas = nuevas;
      const total = Math.max(1, ...zonas.flatMap((z) => z.formas.map((f) => f.length)));
      const primeraVez = n === 0;
      const [ox, oy, viejo] = [px, py, n];
      n = total;
      px = new Float32Array(n);
      py = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      lx = new Float32Array(n);
      ly = new Float32Array(n);
      nivel = new Uint8Array(n);
      activa = elegir();
      forma = activa?.escena === "inicio" ? formaInicio : 0;
      if (activa) asignar(activa, forma, false);
      const r = activa?.el.getBoundingClientRect();
      ultimoY = r?.top ?? 0;
      for (let k = 0; k < n; k++) {
        if (reducido && r) {
          px[k] = r.left + lx[k];
          py[k] = r.top + ly[k];
        } else if (primeraVez || k >= viejo) {
          // Entrada: los puntos llegan desde toda la pantalla.
          px[k] = Math.random() * W;
          py[k] = Math.random() * H;
        } else {
          px[k] = ox[k];
          py[k] = oy[k];
        }
      }
      if (primeraVez && !reducido) llegando = 80;
      despertar();
    }

    function dibujar() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = color;
      for (let l = 1; l <= NIVELES; l++) {
        const lista = porNivel[l];
        if (!lista?.length) continue;
        ctx!.globalAlpha = 0.16 + (l / NIVELES) * 0.84;
        const s = tam * (0.6 + (l / NIVELES) * 0.6);
        const m = s / 2;
        ctx!.beginPath();
        for (let j = 0; j < lista.length; j++) {
          const k = lista[j];
          const y = py[k];
          if (y < -8 || y > H + 8) continue;
          ctx!.rect(px[k] - m, y - m, s, s);
        }
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function paso(ahora: number) {
      cuadro = 0;
      if (!vivo || document.hidden) return;

      // ¿Cambió la sección del centro? Los puntos vuelan a la figura nueva.
      const z = elegir();
      if (z && z !== activa) {
        activa = z;
        forma = z.escena === "inicio" ? formaInicio : 0;
        asignar(z, forma, !reducido);
        ultimoY = z.el.getBoundingClientRect().top;
      }
      if (!activa) return;
      const r = activa.el.getBoundingClientRect();
      // Mientras la sección no cambia, los puntos van pegados a la página.
      const dy = r.top - ultimoY;
      ultimoY = r.top;
      const ox = r.left;
      const oy = r.top;

      if (reducido) {
        for (let k = 0; k < n; k++) {
          px[k] = ox + lx[k];
          py[k] = oy + ly[k];
        }
        dibujar();
        return;
      }

      // Física a 60 pasos por segundo aunque el equipo dibuje menos cuadros.
      const iteraciones = ultimo ? Math.max(1, Math.min(3, Math.round((ahora - ultimo) / 16.7))) : 1;
      ultimo = ahora;
      const r2 = radio * radio;
      let energia = 0;
      let resto = 0;
      if (dy) for (let k = 0; k < n; k++) py[k] += dy;
      for (let it = 0; it < iteraciones; it++) {
        const K = llegando > 0 ? 0.03 : 0.05;
        const D = llegando > 0 ? 0.86 : 0.84;
        if (llegando > 0) llegando--;
        energia = 0;
        resto = 0;
        for (let k = 0; k < n; k++) {
          const ex = ox + lx[k] - px[k];
          const ey = oy + ly[k] - py[k];
          let ax = ex * K;
          let ay = ey * K;
          if (puntero.activo) {
            const dx = px[k] - puntero.x;
            const dyp = py[k] - puntero.y;
            const d2 = dx * dx + dyp * dyp;
            if (d2 < r2) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / radio) * 5.5;
              ax += (dx / d) * f;
              ay += (dyp / d) * f;
            }
          }
          vx[k] = (vx[k] + ax) * D;
          vy[k] = (vy[k] + ay) * D;
          px[k] += vx[k];
          py[k] += vy[k];
          energia += Math.abs(vx[k]) + Math.abs(vy[k]);
          resto += Math.abs(ex) + Math.abs(ey);
        }
      }
      dibujar();
      // Quieto, en su lugar y sin cursor: se apaga hasta el próximo scroll.
      // (Mirar solo la velocidad no basta: los puntos oscilan en fase y en el
      // punto de giro todos están quietos a la vez, lejos de su destino.)
      if (!puntero.activo && llegando === 0 && energia < n * 0.01 && resto < n * 0.08) {
        ultimo = 0;
        return;
      }
      cuadro = requestAnimationFrame(paso);
    }

    function despertar() {
      if (!cuadro && vivo) cuadro = requestAnimationFrame(paso);
    }

    const mover = (e: PointerEvent) => {
      puntero.x = e.clientX;
      puntero.y = e.clientY;
      puntero.activo = true;
      despertar();
    };
    const salir = () => {
      puntero.activo = false;
      puntero.x = puntero.y = -9999;
    };
    const fueraDeVentana = (e: MouseEvent) => {
      if (!e.relatedTarget) salir();
    };
    const soltar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") salir();
    };
    if (!reducido) {
      window.addEventListener("pointermove", mover, { passive: true });
      window.addEventListener("pointerdown", mover, { passive: true });
      window.addEventListener("pointerup", soltar);
      window.addEventListener("pointercancel", salir);
      document.addEventListener("mouseout", fueraDeVentana);
    }
    window.addEventListener("scroll", despertar, { passive: true });

    // El botón del inicio alterna entre el retrato y el nombre.
    const alCambiarForma = (e: Event) => {
      formaInicio = (e as CustomEvent<number>).detail;
      if (activa?.escena === "inicio") {
        forma = formaInicio;
        asignar(activa, forma, !reducido);
      }
      despertar();
    };
    window.addEventListener("particulas:forma", alCambiarForma);

    // Si cambia el tema, cambian el color y la lectura del retrato.
    const mo = new MutationObserver(() => {
      if (activa) asignar(activa, forma, false);
      despertar();
    });
    mo.observe(raiz, { attributes: true, attributeFilter: ["data-tema"] });

    // Rehacer las figuras solo si cambia el ancho (o mucho el alto): en
    // celulares la barra del navegador cambia el alto al hacer scroll.
    let espera = 0;
    let anchoPrevio = 0;
    let altoPrevio = 0;
    const alRedimensionar = () => {
      if (Math.abs(window.innerWidth - anchoPrevio) < 2 && Math.abs(window.innerHeight - altoPrevio) < 120 && n) {
        H = window.innerHeight;
        return;
      }
      anchoPrevio = window.innerWidth;
      altoPrevio = window.innerHeight;
      window.clearTimeout(espera);
      espera = window.setTimeout(preparar, n ? 200 : 0);
    };
    window.addEventListener("resize", alRedimensionar);
    alRedimensionar();

    const alOcultar = () => {
      if (!document.hidden) despertar();
    };
    document.addEventListener("visibilitychange", alOcultar);

    return () => {
      vivo = false;
      cancelAnimationFrame(cuadro);
      window.clearTimeout(espera);
      mo.disconnect();
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", salir);
      document.removeEventListener("mouseout", fueraDeVentana);
      window.removeEventListener("scroll", despertar);
      window.removeEventListener("particulas:forma", alCambiarForma);
      window.removeEventListener("resize", alRedimensionar);
      document.removeEventListener("visibilitychange", alOcultar);
    };
  }, [idioma]);

  return <canvas ref={ref} aria-hidden="true" className="campo-particulas text-texto" />;
}
