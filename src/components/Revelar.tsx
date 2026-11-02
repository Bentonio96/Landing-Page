"use client";

import { useEffect } from "react";

/**
 * Un solo IntersectionObserver para todos los [data-revelar] de la página.
 * Cada elemento sube 2.5rem al entrar en pantalla (ver globals.css). Solo
 * transform: el contenido es legible y tiene contraste desde el principio.
 */
export function Revelar() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>("[data-revelar]");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  return null;
}
