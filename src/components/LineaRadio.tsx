"use client";

import { useEffect, useState } from "react";

/**
 * La primera transmisión de ÁPEX, bajo el titular: se tipea cuando el
 * tablero termina de encenderse. Para el lector de pantalla es una línea
 * de texto normal, entera desde el principio.
 */
export function LineaRadio({ autor, texto }: { autor: string; texto: string }) {
  const [n, setN] = useState(0);


  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(texto.length);

      return;
    }
    let id = 0;
    const espera = setTimeout(() => {
      id = window.setInterval(() => {
        setN((x) => {
          if (x >= texto.length) {
            clearInterval(id);

            return x;
          }
          return x + 1;
        });
      }, 24);
    }, 1300);
    return () => {
      clearTimeout(espera);
      clearInterval(id);
    };
  }, [texto]);

  return (
    <p className="flex min-h-[3.2em] items-start gap-3 font-mono text-[0.875rem] leading-relaxed md:min-h-[1.6em]">
      <span className="shrink-0 text-morado">{autor} ›</span>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" className="cursor-radio">
        {texto.slice(0, n)}
      </span>
    </p>
  );
}
