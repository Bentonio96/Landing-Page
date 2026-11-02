"use client";

import { useEffect, useRef } from "react";

const CELDA = 12;
const VIDA = 650;

/**
 * Estela de telemetría detrás del puntero, en las zonas marcadas con
 * `data-estela` (la parrilla y el box). Son celdas de la misma grilla de
 * 24 px del papel, partidas en cuatro, que se apagan solas en ~0,6 s.
 *
 * Dice algo: el color sale de la velocidad del puntero. Despacio es tinta;
 * rápido, el morado del sector más rápido.
 *
 * Solo con mouse o trackpad (pointer: fine) y con movimiento permitido. El
 * bucle se detiene cuando la última celda se apaga.
 */
export function Estela() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    const apto = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!canvas || !ctx || !apto.matches) return;

    type Celda = { x: number; y: number; nace: number; rapida: number };
    const celdas = new Map<string, Celda>();
    let cuadro = 0;
    let dpr = 1;
    let previo: { x: number; y: number; t: number } | null = null;
    let colores = { tinta: "#0c0e0f", morado: "#6c4bff" };

    const leerColores = () => {
      const css = getComputedStyle(document.documentElement);
      colores = {
        tinta: css.getPropertyValue("--c-tinta").trim(),
        morado: css.getPropertyValue("--c-morado-vivo").trim(),
      };
    };
    const medir = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
    };
    leerColores();
    medir();

    const dibujar = (ahora: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const [clave, c] of celdas) {
        const edad = (ahora - c.nace) / VIDA;
        if (edad >= 1) {
          celdas.delete(clave);
          continue;
        }
        ctx.globalAlpha = (1 - edad) * 0.32;
        ctx.fillStyle = c.rapida > 0.5 ? colores.morado : colores.tinta;
        const lado = CELDA * (1 - edad * 0.5);
        ctx.fillRect(c.x + (CELDA - lado) / 2, c.y + (CELDA - lado) / 2, lado, lado);
      }
      cuadro = celdas.size ? requestAnimationFrame(dibujar) : 0;
    };

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const zona = (e.target as Element | null)?.closest?.("[data-estela]");
      const ahora = performance.now();
      if (!zona) {
        previo = null;
        return;
      }
      const rapidez = previo
        ? Math.hypot(e.clientX - previo.x, e.clientY - previo.y) / Math.max(1, ahora - previo.t)
        : 0;
      previo = { x: e.clientX, y: e.clientY, t: ahora };
      // La grilla del papel está fija a la ventana (background-attachment:
      // fixed), así que las celdas calzan con sus puntos.
      const x = Math.floor(e.clientX / CELDA) * CELDA;
      const y = Math.floor(e.clientY / CELDA) * CELDA;
      celdas.set(`${x},${y}`, { x, y, nace: ahora, rapida: Math.min(1, rapidez / 1.6) });
      if (!cuadro) cuadro = requestAnimationFrame(dibujar);
    };

    addEventListener("pointermove", alMover, { passive: true });
    addEventListener("resize", medir);
    addEventListener("v3:tema", leerColores);
    return () => {
      cancelAnimationFrame(cuadro);
      removeEventListener("pointermove", alMover);
      removeEventListener("resize", medir);
      removeEventListener("v3:tema", leerColores);
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
