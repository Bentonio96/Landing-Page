"use client";

import { useEffect, useRef } from "react";
import { componer } from "@/lib/matriz";
import { cn } from "@/lib/utils";

type Props = {
  /** Líneas que se encienden, en versales. */
  lineas: string[];
  /** Columnas mínimas: fija el ancho cuando el texto cambia (el box). */
  minColumnas?: number;
  /** Texto equivalente, visible sin JavaScript y oculto (pero leído) después. */
  children: React.ReactNode;
  className?: string;
};

type Rgb = [number, number, number];

function aRgb(color: string): Rgb {
  const hex = color.trim().replace("#", "");
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mezclar = (a: Rgb, b: Rgb, t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

/**
 * Tablero de LED, como los de posiciones de un circuito.
 *
 * - Al cargar, los LED se encienden de izquierda a derecha con un parpadeo
 *   de arranque: el tablero «bootea».
 * - El puntero calienta los LED que tiene cerca: pasan del negro al morado y
 *   se enfrían solos en medio segundo. En el táctil, el dedo hace lo mismo.
 * - Sin movimiento (prefers-reduced-motion) se dibuja una vez, quieto.
 *
 * El bucle de animación solo corre mientras hay algo que animar: un tablero
 * frío no gasta un solo cuadro. El texto real va en `children`: sin
 * JavaScript se ve ese, y con el canvas listo pasa a ser solo para lectores
 * de pantalla.
 */
export function TableroLed({ lineas, minColumnas = 0, children, className }: Props) {
  const caja = useRef<HTMLSpanElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const clave = lineas.join("\n");

  const grilla = componer(lineas);
  const columnas = Math.max(grilla.columnas, minColumnas);

  useEffect(() => {
    const div = caja.current;
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!div || !canvas || !ctx) return;

    const { filas, encendidos, columnas: propias } = componer(clave.split("\n"));
    const desfase = Math.floor((columnas - propias) / 2);
    const total = columnas * filas;
    const encendido = new Uint8Array(total);
    const retardo = new Float32Array(total);
    for (const p of encendidos) {
      const i = p.y * columnas + p.x + desfase;
      encendido[i] = 1;
      retardo[i] = (p.x + desfase) * 22 + Math.random() * 260;
    }
    const calor = new Float32Array(total);

    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colores = { apagado: aRgb("#ddd"), led: aRgb("#111"), caliente: aRgb("#6c4bff") };
    const leerColores = () => {
      const css = getComputedStyle(document.documentElement);
      colores = {
        apagado: aRgb(css.getPropertyValue("--c-led-apagado")),
        led: aRgb(css.getPropertyValue("--c-led")),
        caliente: aRgb(css.getPropertyValue("--c-morado-vivo")),
      };
    };
    leerColores();

    let celda = 0;
    let dpr = 1;
    const medir = () => {
      const { width, height } = div.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      celda = (width / columnas) * dpr;
    };

    let inicio = performance.now();
    let cuadro = 0;
    const dibujar = (ahora: number) => {
      const t = quieto ? Infinity : ahora - inicio;
      const lado = celda * 0.78;
      const radio = celda * 0.16;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let vivo = false;
      for (let i = 0; i < total; i++) {
        const cx = (i % columnas) * celda + celda / 2;
        const cy = Math.floor(i / columnas) * celda + celda / 2;
        const c = calor[i];
        let prendido = encendido[i] === 1 && t >= retardo[i];
        // Parpadeo de arranque: los primeros 90 ms el LED titubea.
        if (prendido && t - retardo[i] < 90) prendido = Math.random() > 0.4;
        if (encendido[i] && t < retardo[i] + 90) vivo = true;
        // El LED apagado es un punto chico; el encendido llena su celda. Así
        // el nombre se lee aunque el tablero entero esté a la vista.
        const l = prendido ? lado : lado * (0.38 + c * 0.45);
        ctx.fillStyle = prendido
          ? mezclar(colores.led, colores.caliente, c)
          : mezclar(colores.apagado, colores.caliente, c * 0.7);
        ctx.beginPath();
        ctx.roundRect(cx - l / 2, cy - l / 2, l, l, prendido ? radio : l / 2);
        ctx.fill();
        if (c > 0.01) {
          calor[i] = c * 0.9;
          vivo = true;
        } else calor[i] = 0;
      }
      cuadro = vivo ? requestAnimationFrame(dibujar) : 0;
    };
    const despertar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(dibujar);
    };

    medir();
    div.dataset.led = "listo";
    if (quieto) dibujar(performance.now());
    else despertar();

    const alMover = (e: PointerEvent) => {
      if (quieto) return;
      const r = div.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / r.width) * columnas;
      const cy = ((e.clientY - r.top) / r.height) * filas;
      const alcance = 3.2;
      for (let y = Math.max(0, Math.floor(cy - alcance)); y < Math.min(filas, cy + alcance); y++) {
        for (let x = Math.max(0, Math.floor(cx - alcance)); x < Math.min(columnas, cx + alcance); x++) {
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / alcance;
          if (d < 1) {
            const i = y * columnas + x;
            calor[i] = Math.max(calor[i], 1 - d * d);
          }
        }
      }
      despertar();
    };
    div.addEventListener("pointermove", alMover);

    const observarTamano = new ResizeObserver(() => {
      medir();
      if (quieto) dibujar(performance.now());
      else despertar();
    });
    observarTamano.observe(div);

    // El tema cambia los colores: se relee y se redibuja.
    const observarTema = new MutationObserver(() => {
      leerColores();
      if (quieto) dibujar(performance.now());
      else despertar();
    });
    observarTema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });

    // Un texto nuevo (el tiempo del box) arranca otra vez el encendido.
    inicio = performance.now();

    return () => {
      cancelAnimationFrame(cuadro);
      div.removeEventListener("pointermove", alMover);
      observarTamano.disconnect();
      observarTema.disconnect();
    };
  }, [clave, columnas]);

  return (
    <span
      ref={caja}
      className={cn("tablero block", className)}
      style={{ aspectRatio: `${columnas} / ${grilla.filas}` }}
    >
      <canvas ref={lienzo} aria-hidden="true" />
      <span className="tablero-texto">{children}</span>
    </span>
  );
}
