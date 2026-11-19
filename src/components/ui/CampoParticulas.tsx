"use client";

import { useEffect, useRef } from "react";

/**
 * Un solo campo de partículas para toda la página.
 *
 * El canvas está fijo sobre la ventana. Cada sección marca una zona con
 * `data-particulas="<escena>"` y tiene su figura. El viaje va atado al
 * scroll: entre dos zonas, a medida que se baja, los puntos se sueltan de a
 * poco de la figura de arriba y caen en una nube que se abre a los lados
 * hasta armar la de abajo. Si el scroll se detiene a medio camino, la nube
 * queda a medio camino; cerca de cada zona la figura queda armada.
 *
 * Escenas: el retrato (o el nombre) en el inicio, «Sobre mí», «</>»
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

/** Los caracteres de código con los que se dibuja todo. */
const LIVIANOS = "01{}<>/;=()[]*+-#$&|!?:._%@~^";
/** Las letras y dibujos usan caracteres con más tinta, para que se lean llenos. */
const PESADOS = "#@%&$08B";
const GLIFOS = LIVIANOS + PESADOS;

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
      return [{ tipo: "texto", texto: idioma === "en" ? "ABOUT ME" : "SOBRE MÍ" }];
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
  const minimo = forma.tipo === "imagen" ? 7 : 7;
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

/** Suave al salir y al llegar. */
function suave(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

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
    let formaInicio = 0;
    let n = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    // Por partícula: cuándo sale en el viaje (0 = primera, 1 = última) y
    // cuánto se abre hacia los lados y en vertical a mitad de camino.
    let turno = new Float32Array(0);
    let desvioX = new Float32Array(0);
    let desvioY = new Float32Array(0);
    let escala = new Float32Array(0);
    let glifo = new Uint8Array(0);
    let nivel = new Uint8Array(0);
    let orden = new Uint32Array(0);
    let scrollPrevio = 0;
    let cuadro = 0;
    let ultimo = 0;
    let llegando = 0;
    let vivo = true;
    const imagenes = new Map<string, HTMLImageElement | null>();
    const puntero = { x: -9999, y: -9999, activo: false };
    let colorPagina = "#f2f2f2";

    function forma(z: Zona) {
      return z.escena === "inicio" ? Math.min(formaInicio, z.formas.length - 1) : 0;
    }

    /**
     * El tramo del scroll: la zona de arriba (A), la de abajo (B) y cuánto se
     * avanzó entre sus centros, medido en el centro de la pantalla.
     */
    function tramo(): [Zona, Zona, number] | null {
      if (!zonas.length) return null;
      const centros = zonas.map((z) => {
        const r = z.el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      // La última zona (el pie) puede quedar bajo el centro aunque la página
      // ya no baje más: en la última pantalla de scroll el punto de lectura
      // se desliza hacia abajo y llega justo a ella al final.
      let centro = H * 0.5;
      const ultimoCentro = centros[centros.length - 1];
      const falta = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (ultimoCentro > centro) centro += (ultimoCentro - centro) * Math.min(1, Math.max(0, 1 - falta / H));
      if (centro <= centros[0]) return [zonas[0], zonas[0], 0];
      for (let i = 0; i < zonas.length - 1; i++) {
        if (centro <= centros[i + 1]) {
          return [zonas[i], zonas[i + 1], (centro - centros[i]) / Math.max(1, centros[i + 1] - centros[i])];
        }
      }
      const u = zonas[zonas.length - 1];
      return [u, u, 0];
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
      const prueba = document.createElement("span");
      prueba.className = "mono";
      document.body.appendChild(prueba);
      fuenteMono = getComputedStyle(prueba).fontFamily || "monospace";
      prueba.remove();
      tiras.clear();
      const ancho = W >= 1024;
      const nuevas: Zona[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-particulas]"))) {
        const escena = el.dataset.particulas!;
        const formas = formasDe(escena, idioma);
        const r = el.getBoundingClientRect();
        if (!formas.length || r.width < 20 || r.height < 20) continue;
        const margen = (ancho ? el.dataset.margen : el.dataset.margenMovil ?? el.dataset.margen)?.split(",").map(Number) ?? [0, 0, 0, 0];
        const objetivoBase = escena === "inicio" ? 3400 : 1200;
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
        if (!muestras.some((m) => m.puntos.length)) continue;
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
      // En orden de la página, de arriba a abajo.
      nuevas.sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top);
      zonas = nuevas;
      const total = Math.max(1, ...zonas.flatMap((z) => z.formas.map((f) => f.length)));
      const primeraVez = n === 0;
      const [ox, oy, viejo] = [px, py, n];
      n = total;
      px = new Float32Array(n);
      py = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      turno = new Float32Array(n);
      desvioX = new Float32Array(n);
      desvioY = new Float32Array(n);
      escala = new Float32Array(n);
      glifo = new Uint8Array(n);
      nivel = new Uint8Array(n);
      orden = new Uint32Array(n);
      for (let k = 0; k < n; k++) {
        turno[k] = Math.random();
        desvioX[k] = (Math.random() - 0.5) * W * 0.22;
        desvioY[k] = (Math.random() - 0.5) * H * 0.12;
        escala[k] = 0.9 + Math.random() * 0.2;
        glifo[k] = Math.floor(Math.random() * LIVIANOS.length);
        if (primeraVez || k >= viejo) {
          // Entrada: los puntos llegan desde toda la pantalla.
          px[k] = Math.random() * W;
          py[k] = Math.random() * H;
        } else {
          px[k] = ox[k];
          py[k] = oy[k];
        }
      }
      scrollPrevio = window.scrollY;
      colorPagina = getComputedStyle(canvas!).color;
      if (primeraVez && !reducido) llegando = 90;
      if (reducido) {
        paso(0);
        return;
      }
      despertar();
    }

    // Cada partícula es un carácter de código. Los caracteres se pintan una
    // vez por color en una tira (a 2x) y cada cuadro solo los copia.
    const TIRA = 32;
    let fuenteMono = "monospace";
    const tiras = new Map<string, HTMLCanvasElement>();
    function tira(color: string) {
      let t = tiras.get(color);
      if (t) return t;
      t = document.createElement("canvas");
      t.width = TIRA * GLIFOS.length;
      t.height = TIRA;
      const c = t.getContext("2d")!;
      c.fillStyle = color;
      c.font = `600 ${TIRA * 0.72}px ${fuenteMono}`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      for (let i = 0; i < GLIFOS.length; i++) c.fillText(GLIFOS[i], i * TIRA + TIRA / 2, TIRA / 2 + 1);
      tiras.set(color, t);
      return t;
    }

    function dibujar(tam: number, color: string, pesado: boolean) {
      ctx!.clearRect(0, 0, W, H);
      const t = tira(color);
      // Orden por nivel de brillo (conteo): un recorrido por partícula.
      const cuentas = new Uint32Array(NIVELES + 2);
      for (let k = 0; k < n; k++) cuentas[nivel[k] + 1]++;
      for (let l = 1; l <= NIVELES + 1; l++) cuentas[l] += cuentas[l - 1];
      const inicio = cuentas.slice();
      for (let k = 0; k < n; k++) orden[inicio[nivel[k]]++] = k;
      for (let l = 1; l <= NIVELES; l++) {
        const desde = cuentas[l];
        const hasta = cuentas[l + 1];
        if (hasta <= desde) continue;
        ctx!.globalAlpha = 0.2 + (l / NIVELES) * 0.8;
        // La caja del carácter: el cuerpo es ~72 % de la celda.
        const base = (tam / 0.72) * (0.85 + (l / NIVELES) * 0.25);
        for (let j = desde; j < hasta; j++) {
          const k = orden[j];
          const y = py[k];
          if (y < -16 || y > H + 16) continue;
          const d = base * escala[k];
          const g = pesado ? LIVIANOS.length + (glifo[k] % PESADOS.length) : glifo[k];
          ctx!.drawImage(t, g * TIRA, 0, TIRA, TIRA, px[k] - d / 2, y - d / 2, d, d);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function paso(ahora: number) {
      cuadro = 0;
      if (!vivo || document.hidden) return;
      const t = tramo();
      if (!t) return;
      const [A, B, avance] = t;
      const rA = A.el.getBoundingClientRect();
      const rB = B.el.getBoundingClientRect();
      const fA = A.formas[forma(A)];
      const fB = B.formas[forma(B)];
      const mA = fA.length || 1;
      const mB = fB.length || 1;
      const claro = raiz.getAttribute("data-tema") === "light";
      const invA = A.invierte[forma(A)] && claro && !A.oscuroFijo;
      const invB = B.invierte[forma(B)] && claro && !B.oscuroFijo;

      // El viaje usa el tramo central del scroll entre las dos zonas: cerca
      // de cada una, la figura se queda armada para leerla.
      const viaje = reducido ? (avance < 0.5 ? 0 : 1) : Math.min(1, Math.max(0, (avance - 0.15) / 0.7));
      const tamA = Math.max(8, Math.min(15, (A.pasos[forma(A)] ?? 9) * 1.15));
      const tamB = Math.max(8, Math.min(15, (B.pasos[forma(B)] ?? 9) * 1.15));
      const tam = tamA + (tamB - tamA) * viaje;
      const color = (viaje < 0.5 ? A : B).oscuroFijo ? "#F2F2F2" : colorPagina;

      // El scroll mueve los puntos junto con la página; la física solo corrige.
      const dScroll = window.scrollY - scrollPrevio;
      scrollPrevio = window.scrollY;

      const iteraciones = reducido ? 1 : ultimo ? Math.max(1, Math.min(3, Math.round((ahora - ultimo) / 16.7))) : 1;
      ultimo = ahora;
      const r2 = radio * radio;
      let energia = 0;
      let resto = 0;
      if (dScroll && !reducido) for (let k = 0; k < n; k++) py[k] -= dScroll;

      for (let it = 0; it < iteraciones; it++) {
        // Resortes blandos: los puntos se deslizan en vez de saltar.
        // Blandos y bien amortiguados: los puntos flotan detrás del scroll,
        // sin rebotar, y tardan cerca de un segundo en asentarse.
        const K = llegando > 0 ? 0.022 : 0.015;
        const D = llegando > 0 ? 0.88 : 0.86;
        if (llegando > 0) llegando--;
        energia = 0;
        resto = 0;
        for (let k = 0; k < n; k++) {
          // Cada punto sale en su turno: la figura se desarma de a poco y la
          // nube cae hacia la sección de abajo abriéndose a los lados.
          const propio = Math.min(1, Math.max(0, (viaje - turno[k] * 0.4) / 0.6));
          const e = reducido ? viaje : suave(propio);
          const a = fA[k % mA];
          const b = fB[k % mB];
          const ax0 = rA.left + (a ? a.x : 0);
          const ay0 = rA.top + (a ? a.y : 0);
          const bx0 = rB.left + (b ? b.x : 0);
          const by0 = rB.top + (b ? b.y : 0);
          const arco = Math.sin(Math.PI * e);
          const tx = ax0 + (bx0 - ax0) * e + arco * desvioX[k];
          const ty = ay0 + (by0 - ay0) * e + arco * desvioY[k];
          const brillo = e < 0.5 ? (a ? (invA ? 1 - a.b : a.b) : 0.5) : b ? (invB ? 1 - b.b : b.b) : 0.5;
          // Solo viajan los puntos que la figura de destino necesita; los que
          // sobran se apagan donde están. Así la nube es liviana y las letras
          // no se empastan con puntos apilados.
          const enA = k < mA;
          const enB = k < mB;
          const visible = e <= 0.02 ? enA : e >= 0.98 ? enB : enA && enB;
          // En el aire se atenúan: la nube pasa detrás del texto sin taparlo.
          nivel[k] = visible ? Math.max(1, Math.round(Math.min(NIVELES, 1 + Math.floor(brillo * NIVELES)) * (1 - 0.65 * arco))) : 0;
          if (reducido) {
            px[k] = tx;
            py[k] = ty;
            continue;
          }
          const ex = tx - px[k];
          const ey = ty - py[k];
          let fx = ex * K;
          let fy = ey * K;
          if (puntero.activo) {
            const dx = px[k] - puntero.x;
            const dy = py[k] - puntero.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / radio) * 5.5;
              fx += (dx / d) * f;
              fy += (dy / d) * f;
            }
          }
          vx[k] = (vx[k] + fx) * D;
          vy[k] = (vy[k] + fy) * D;
          px[k] += vx[k];
          py[k] += vy[k];
          energia += Math.abs(vx[k]) + Math.abs(vy[k]);
          resto += Math.abs(ex) + Math.abs(ey);
        }
      }
      if (!reducido && viaje > 0 && viaje < 1) {
        for (let i = 0; i < n * 0.02; i++) glifo[Math.floor(Math.random() * n)] = Math.floor(Math.random() * LIVIANOS.length);
      }
      const destino = viaje < 0.5 ? A : B;
      dibujar(tam, color, !destino.invierte[forma(destino)]);
      if (reducido) return;
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
      if (reducido) {
        if (!cuadro && vivo) cuadro = requestAnimationFrame(paso);
        return;
      }
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
      if (!reducido) {
        for (let k = 0; k < n; k++) {
          vx[k] += (Math.random() - 0.5) * 8;
          vy[k] += (Math.random() - 0.5) * 8;
        }
      }
      despertar();
    };
    window.addEventListener("particulas:forma", alCambiarForma);

    // Si cambia el tema, cambian el color y la lectura del retrato.
    const mo = new MutationObserver(() => {
      colorPagina = getComputedStyle(canvas!).color;
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
