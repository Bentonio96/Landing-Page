"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

/**
 * Mueve las capas [data-profundidad] de su interior según el puntero, cada
 * una en proporción a su profundidad (-1 a 1). Solo con puntero fino y sin
 * movimiento reducido: en un teléfono no hay puntero que seguir, y nada se
 * mueve solo, así que no hace falta un botón de pausa.
 */
export function Paralaje({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const puntero = window.matchMedia("(pointer: fine)");
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!puntero.matches || reducido.matches) return;

    const capas = Array.from(
      raiz.querySelectorAll<HTMLElement>("[data-profundidad]"),
    ).map((el) => ({ el, z: Number(el.dataset.profundidad) || 0 }));

    let cuadro = 0;
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        const caja = raiz.getBoundingClientRect();
        const x = (e.clientX - caja.left) / caja.width - 0.5;
        const y = (e.clientY - caja.top) / caja.height - 0.5;
        for (const { el, z } of capas) {
          el.style.transform = `translate3d(${(x * z * 28).toFixed(1)}px, ${(y * z * 18).toFixed(1)}px, 0)`;
        }
      });
    };
    raiz.addEventListener("pointermove", mover);
    return () => {
      cancelAnimationFrame(cuadro);
      raiz.removeEventListener("pointermove", mover);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
