"use client";

import { useEffect, useRef, useState } from "react";

const SIGNOS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789#%&*+=<>/";

/**
 * Texto que se «descifra» al entrar en pantalla, como una señal de radio
 * que se limpia: los caracteres giran al azar y se fijan de izquierda a
 * derecha. El texto real está siempre en el DOM para el lector de pantalla;
 * lo que gira es una copia aria-hidden, y sin movimiento ni siquiera gira.
 */
export function Descifrar({ texto, className }: { texto: string; className?: string }) {
  const caja = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(texto);

  useEffect(() => {
    const el = caja.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let intervalo = 0;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        let paso = 0;
        intervalo = window.setInterval(() => {
          paso += 1;
          const fijos = Math.floor(paso / 2);
          setVisible(
            [...texto]
              .map((c, i) =>
                i < fijos || c === " " || c === "·" ? c : SIGNOS[Math.floor(Math.random() * SIGNOS.length)],
              )
              .join(""),
          );
          if (fijos >= texto.length) clearInterval(intervalo);
        }, 32);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      clearInterval(intervalo);
    };
  }, [texto]);

  return (
    <span ref={caja} className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">{visible}</span>
    </span>
  );
}
