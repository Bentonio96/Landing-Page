"use client";

import { useEffect } from "react";

/**
 * Un solo oyente de scroll, con un rAF por cuadro como máximo, que escribe
 * --p (0 → 1) en los elementos marcados con data-progreso:
 *
 * - "fijo": el escenario del inicio. 0 cuando su borde superior toca el
 *   techo, 1 cuando termina el tramo fijo. Además marca data-fuera en su
 *   interior mientras el saludo está escondido, para que el teclado no
 *   caiga en botones invisibles; y si el foco entra al saludo, lleva el
 *   scroll al final del tramo para mostrarlo.
 * - "entrada": la línea de tiempo. Se dibuja mientras la sección cruza la
 *   pantalla.
 *
 * Con movimiento reducido no hace nada: los valores por defecto del CSS
 * dejan todo dibujado.
 */
export function Movimiento() {
  useEffect(() => {
    const raiz = document.documentElement;
    const reducido =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || raiz.hasAttribute("data-reducido");
    if (reducido) return;

    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-progreso]"));
    let pendiente = 0;

    function medir() {
      pendiente = 0;
      const vh = window.innerHeight;
      for (const el of elementos) {
        const caja = el.getBoundingClientRect();
        let p: number;
        if (el.dataset.progreso === "fijo") {
          const tramo = caja.height - vh;
          p = tramo > 0 ? -caja.top / tramo : 1;
          const fijo = el.firstElementChild as HTMLElement | null;
          if (fijo) {
            if (tramo > 0 && p < 0.42) fijo.setAttribute("data-fuera", "");
            else fijo.removeAttribute("data-fuera");
          }
        } else {
          p = (vh * 0.9 - caja.top) / (vh * 0.6);
        }
        el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
      }
    }
    const pedir = () => {
      if (!pendiente) pendiente = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);

    const escenario = document.querySelector<HTMLElement>('[data-progreso="fijo"]');
    const alEnfocar = (e: FocusEvent) => {
      const sobre = (e.target as HTMLElement).closest(".escenario__sobre");
      if (!sobre || !escenario) return;
      const tramo = escenario.offsetHeight - window.innerHeight;
      if (tramo <= 0) return;
      const destino = escenario.offsetTop + tramo;
      if (Math.abs(window.scrollY - destino) > 4) window.scrollTo({ top: destino, behavior: "instant" });
    };
    document.addEventListener("focusin", alEnfocar);

    // El saludo vive dentro del tramo fijo: su ancla lleva al final del tramo.
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href="#sobre-mi"]');
      if (!a || !escenario) return;
      const tramo = escenario.offsetHeight - window.innerHeight;
      if (tramo <= 0) return;
      e.preventDefault();
      window.scrollTo({ top: escenario.offsetTop + tramo, behavior: "smooth" });
      history.replaceState(null, "", "#sobre-mi");
    };
    document.addEventListener("click", alClic);

    return () => {
      cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      document.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("click", alClic);
    };
  }, []);

  return null;
}
