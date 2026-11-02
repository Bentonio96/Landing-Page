"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Seccion = { id: string; etiqueta: string };

type Props = {
  secciones: Seccion[];
  etiquetaNav: string;
  etiquetaSector: string;
};

const LARGO_AUTO = 30;

/**
 * Una recta de pista convertida en la navegación del sitio: cada sección
 * es un sector y la meta a cuadros es el final de la página.
 *
 * Se queda fija arriba al bajar. El auto marca cuánto se ha leído y, al
 * apuntar o enfocar un sector, va hasta él. Nada se mueve solo: el auto
 * sigue al scroll o al puntero. Con movimiento reducido salta a su sitio.
 */
export function BandaPista({ secciones, etiquetaNav, etiquetaSector }: Props) {
  const pista = useRef<HTMLDivElement>(null);
  const auto = useRef<HTMLSpanElement>(null);
  const enlaces = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activa, setActiva] = useState<string | null>(null);

  useEffect(() => {
    const caja = pista.current;
    const coche = auto.current;
    if (!caja || !coche) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");

    let destino = 0;
    let x = 0;
    let apuntado: number | null = null;
    let cuadro = 0;

    const calcularDestino = () => {
      if (apuntado !== null) {
        const enlace = enlaces.current[apuntado];
        if (enlace) {
          const r = enlace.getBoundingClientRect();
          const c = caja.getBoundingClientRect();
          destino = r.left - c.left + r.width / 2 - LARGO_AUTO / 2;
          return;
        }
      }
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const avance = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      destino = avance * (caja.clientWidth - LARGO_AUTO);
    };

    const pintar = () => {
      coche.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    };

    const paso = () => {
      const d = destino - x;
      if (reducido.matches || Math.abs(d) < 0.4) {
        x = destino;
        pintar();
        cuadro = 0;
        return;
      }
      x += d * 0.14;
      pintar();
      cuadro = requestAnimationFrame(paso);
    };

    const actualizar = () => {
      calcularDestino();
      if (!cuadro) cuadro = requestAnimationFrame(paso);
    };

    // El sector activo es el último cuyo inicio ya pasó el 40 % de la
    // ventana.
    const marcarActiva = () => {
      let actual: string | null = null;
      for (const s of secciones) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) actual = s.id;
      }
      setActiva(actual);
    };

    const alDesplazar = () => {
      actualizar();
      marcarActiva();
    };

    const salir = () => {
      apuntado = null;
      actualizar();
    };
    const oyentes = enlaces.current.map((el, i) => {
      if (!el) return null;
      const entrar = () => {
        apuntado = i;
        actualizar();
      };
      el.addEventListener("pointerenter", entrar);
      el.addEventListener("focus", entrar);
      el.addEventListener("pointerleave", salir);
      el.addEventListener("blur", salir);
      return { el, entrar };
    });

    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
      for (const o of oyentes) {
        if (!o) continue;
        o.el.removeEventListener("pointerenter", o.entrar);
        o.el.removeEventListener("focus", o.entrar);
        o.el.removeEventListener("pointerleave", salir);
        o.el.removeEventListener("blur", salir);
      }
    };
  }, [secciones]);

  return (
    <nav
      aria-label={etiquetaNav}
      className="asfalto sobre-asfalto sticky top-0 z-40 h-16 overflow-hidden"
    >
      {/* Pianos violeta y blanco en los dos bordes de la recta. */}
      <div aria-hidden="true" className="piano absolute inset-x-0 top-0 h-1" />
      <div aria-hidden="true" className="piano absolute inset-x-0 bottom-0 h-1" />
      {/* Línea central discontinua. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--c-linea)_0_18px,transparent_18px_36px)]"
      />
      {/* Meta a cuadros al final de la recta. */}
      <div aria-hidden="true" className="cuadros absolute inset-y-1 right-0 w-5 [--cuadro:5px]" />

      <div ref={pista} className="lienzo relative h-full pr-8">
        <ul className="relative z-10 grid h-full grid-cols-5">
          {secciones.map((s, i) => (
            <li key={s.id} className="flex items-center justify-center">
              <a
                ref={(el) => {
                  enlaces.current[i] = el;
                }}
                href={`#${s.id}`}
                aria-current={activa === s.id ? "location" : undefined}
                className={cn(
                  "micro relative inline-flex min-h-11 items-center gap-1.5 bg-asfalto px-2 text-sobreasfalto decoration-2 underline-offset-4 hover:underline",
                  activa === s.id && "text-acentoasfalto underline",
                )}
              >
                <span>
                  <span className="sr-only">{etiquetaSector} </span>S{i + 1}
                </span>
                <span className="sr-only sm:not-sr-only">{s.etiqueta}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* El auto, visto desde arriba, apuntando a la meta. */}
        <span
          ref={auto}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[7px] left-0 z-0 block"
          style={{ width: LARGO_AUTO }}
        >
          <svg viewBox="0 0 30 14" className="block h-[14px] w-[30px]">
            <rect x="4" y="0" width="5" height="3" rx="1" fill="#05070A" />
            <rect x="4" y="11" width="5" height="3" rx="1" fill="#05070A" />
            <rect x="20" y="0" width="5" height="3" rx="1" fill="#05070A" />
            <rect x="20" y="11" width="5" height="3" rx="1" fill="#05070A" />
            <path d="M1 4.5 Q1 2 4 2 L22 2 Q29 3 29 7 Q29 11 22 12 L4 12 Q1 12 1 9.5 Z" fill="var(--c-senal)" />
            <path d="M12 4 L18 4.5 Q20 7 18 9.5 L12 10 Q11 7 12 4 Z" fill="#0E1117" opacity="0.75" />
            <rect x="1" y="5.5" width="2" height="3" fill="#F1F3F7" />
          </svg>
        </span>
      </div>
    </nav>
  );
}
