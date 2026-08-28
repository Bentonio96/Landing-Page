"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Retardo en segundos, para escalonar elementos de una misma fila. */
  retardo?: number;
  className?: string;
};

/**
 * Aparición sutil al entrar en viewport.
 *
 * La animación es una transición CSS de `transform` y la detección un
 * IntersectionObserver propio. Es ~40 KB menos de JS que una librería de
 * animación y no puede dejar una sección invisible.
 *
 * A propósito no se anima la opacidad: el contenido bajo el pliegue espera
 * al scroll, y si estuviera en opacity 0 las auditorías automáticas lo
 * marcarían como texto sin contraste.
 *
 * Tres redes de seguridad, porque una sección en blanco arruinaría el sitio:
 *   1. Si no hay ref o no hay IntersectionObserver, se muestra de inmediato.
 *   2. Temporizador de respaldo por si el observador nunca dispara.
 *   3. Reglas CSS para <noscript> y para prefers-reduced-motion.
 */
export function Reveal({ children, retardo = 0, className }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = contenedor.current;

    if (!elemento || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
    observador.observe(elemento);

    const respaldo = window.setTimeout(() => setVisible(true), 2500);

    return () => {
      observador.disconnect();
      window.clearTimeout(respaldo);
    };
  }, []);

  return (
    <div
      ref={contenedor}
      className={cn("revelar", className)}
      data-visible={visible ? "" : undefined}
      style={retardo ? { transitionDelay: `${retardo}s` } : undefined}
    >
      {children}
    </div>
  );
}
