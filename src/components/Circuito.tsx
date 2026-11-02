"use client";

import { useEffect, useRef } from "react";

/**
 * Trazado de un circuito (inventado, no es uno real) que se dibuja a
 * medida que la sección cruza la pantalla. Decorativo. Con movimiento
 * reducido aparece entero desde el principio (ver .trazado en globals.css).
 */
export function Circuito({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const r = svg.getBoundingClientRect();
      const recorrido = window.innerHeight + r.height;
      const avance = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (recorrido * 0.75)));
      svg.style.setProperty("--avance", avance.toFixed(3));
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alDesplazar);
    };
  }, []);

  return (
    <svg ref={ref} aria-hidden="true" viewBox="0 0 400 300" className={className} fill="none">
      {/* El trazado completo, tenue, y encima el que se va dibujando. */}
      <path
        d="M60 230 L250 230 Q300 230 320 200 L360 120 Q372 92 345 78 L300 58 Q270 46 250 72 L218 120 Q205 140 180 128 L120 92 Q92 76 72 98 L46 140 Q30 170 44 200 Q52 230 60 230 Z"
        stroke="var(--c-linea)"
        strokeOpacity="0.35"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        className="trazado"
        pathLength={1}
        d="M60 230 L250 230 Q300 230 320 200 L360 120 Q372 92 345 78 L300 58 Q270 46 250 72 L218 120 Q205 140 180 128 L120 92 Q92 76 72 98 L46 140 Q30 170 44 200 Q52 230 60 230 Z"
        stroke="var(--c-acento-asfalto)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Línea de meta. */}
      <g transform="translate(150 222)">
        {[0, 1, 2, 3].map((f) =>
          [0, 1].map((c) => (
            <rect
              key={`${f}-${c}`}
              x={c * 4}
              y={f * 4}
              width="4"
              height="4"
              fill={(f + c) % 2 ? "var(--c-asfalto)" : "var(--c-sobre-asfalto)"}
            />
          )),
        )}
      </g>
    </svg>
  );
}
