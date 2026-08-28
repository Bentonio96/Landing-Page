"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** El hito en curso: se marca desde el inicio, no espera al scroll. */
  actual?: boolean;
  /** Retardo en segundos, para que la cascada acompañe al llenado. */
  retardo?: number;
  children: ReactNode;
};

/**
 * Un hito de la línea de tiempo.
 *
 * El punto se convierte en un check y el contenido entra al mismo tiempo, con
 * un único observador: así el check y el texto quedan sincronizados por
 * construcción en vez de por coincidencia, y ambos acompañan el llenado de la
 * barra.
 *
 * Mismas redes de seguridad que Reveal: sin IntersectionObserver se muestra de
 * inmediato, hay un temporizador de respaldo, y la regla <noscript> del layout
 * deja el contenido visible sin JavaScript.
 */
export function HitoLinea({ actual = false, retardo = 0, children }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [alcanzado, setAlcanzado] = useState(false);

  useEffect(() => {
    const elemento = contenedor.current;

    if (!elemento || typeof IntersectionObserver === "undefined") {
      setAlcanzado(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setAlcanzado(true);
          observador.disconnect();
        }
      },
      // Se marca cuando el hito ya subió al tercio central de la pantalla,
      // que es donde la barra lo alcanza.
      { rootMargin: "0px 0px -30% 0px", threshold: 0.15 },
    );
    observador.observe(elemento);

    const respaldo = window.setTimeout(() => setAlcanzado(true), 2500);

    return () => {
      observador.disconnect();
      window.clearTimeout(respaldo);
    };
  }, []);

  const marcado = alcanzado || actual;

  return (
    <div ref={contenedor}>
      <span
        aria-hidden="true"
        style={{ transitionDelay: `${retardo}s` }}
        className={cn(
          "absolute left-0 top-1 flex size-5 items-center justify-center rounded-full border-2",
          "transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "motion-reduce:transition-none",
          marcado
            ? "scale-100 border-acento bg-acento"
            : "scale-[0.82] border-bordefuerte bg-fondo",
        )}
      >
        <Check
          aria-hidden="true"
          strokeWidth={3}
          style={{ transitionDelay: `${retardo + 0.12}s` }}
          className={cn(
            "size-3 text-acentosobre transition-[opacity,transform] duration-300",
            "motion-reduce:transition-none",
            marcado ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>

      <div
        style={{ transitionDelay: `${retardo}s` }}
        className={cn(
          "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "motion-reduce:transition-none motion-reduce:transform-none",
          marcado ? "translate-y-0" : "translate-y-3",
        )}
      >
        {children}
      </div>
    </div>
  );
}
