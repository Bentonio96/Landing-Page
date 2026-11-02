"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Seccion = { id: string; etiqueta: string };

type Props = {
  secciones: Seccion[];
  etiquetaNav: string;
};

const TAMANO_BALON = 18;

/**
 * La franja de cancha del reel, convertida en la navegación del sitio.
 *
 * Se queda fija arriba al bajar. El balón marca cuánto se ha leído de la
 * página y, al apuntar una sección, rueda hasta ella. Nada se mueve solo:
 * el balón solo sigue al scroll o al puntero. Con movimiento reducido salta
 * a su sitio sin rodar.
 */
export function BandaCancha({ secciones, etiquetaNav }: Props) {
  const pista = useRef<HTMLDivElement>(null);
  const balon = useRef<HTMLSpanElement>(null);
  const enlaces = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activa, setActiva] = useState<string | null>(null);

  useEffect(() => {
    const caja = pista.current;
    const pelota = balon.current;
    if (!caja || !pelota) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");

    let destino = 0;
    let x = 0;
    let apuntado: number | null = null;
    let cuadro = 0;

    const ancho = () => caja.clientWidth - TAMANO_BALON;

    const calcularDestino = () => {
      if (apuntado !== null) {
        const enlace = enlaces.current[apuntado];
        if (enlace) {
          const r = enlace.getBoundingClientRect();
          const c = caja.getBoundingClientRect();
          destino = r.left - c.left + r.width / 2 - TAMANO_BALON / 2;
          return;
        }
      }
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const avance = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      destino = avance * ancho();
    };

    const pintar = () => {
      // El giro es la distancia recorrida sobre el radio: rueda, no patina.
      const giro = (x / (TAMANO_BALON / 2)) * (180 / Math.PI);
      pelota.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) rotate(${giro.toFixed(0)}deg)`;
    };

    const paso = () => {
      const d = destino - x;
      if (reducido.matches || Math.abs(d) < 0.4) {
        x = destino;
        pintar();
        cuadro = 0;
        return;
      }
      x += d * 0.16;
      pintar();
      cuadro = requestAnimationFrame(paso);
    };

    const actualizar = () => {
      calcularDestino();
      if (!cuadro) cuadro = requestAnimationFrame(paso);
    };

    // La sección activa es la última cuyo inicio ya pasó el 40 % de la
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

    const entrar = (i: number) => () => {
      apuntado = i;
      actualizar();
    };
    const salir = () => {
      apuntado = null;
      actualizar();
    };
    const oyentes = enlaces.current.map((el, i) => {
      if (!el) return null;
      const alEntrar = entrar(i);
      el.addEventListener("pointerenter", alEntrar);
      el.addEventListener("focus", alEntrar);
      el.addEventListener("pointerleave", salir);
      el.addEventListener("blur", salir);
      return { el, alEntrar };
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
        o.el.removeEventListener("pointerenter", o.alEntrar);
        o.el.removeEventListener("focus", o.alEntrar);
        o.el.removeEventListener("pointerleave", salir);
        o.el.removeEventListener("blur", salir);
      }
    };
  }, [secciones]);

  return (
    <nav
      aria-label={etiquetaNav}
      className="cesped sobre-cesped sticky top-0 z-40 h-16 overflow-hidden [--franja:clamp(2.5rem,1.5rem+4vw,5rem)]"
    >
      {/* Líneas de cal: borde, mitad de cancha, círculo central y áreas. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 1000 64"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="var(--c-cal)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          <rect x="6" y="6" width="988" height="52" vectorEffect="non-scaling-stroke" />
          <line x1="500" y1="6" x2="500" y2="58" vectorEffect="non-scaling-stroke" />
          <rect x="6" y="16" width="70" height="32" vectorEffect="non-scaling-stroke" />
          <rect x="924" y="16" width="70" height="32" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[52px] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 52 52"
      >
        <circle cx="26" cy="26" r="24" fill="none" stroke="var(--c-cal)" strokeWidth="1.5" />
      </svg>

      <div ref={pista} className="lienzo relative h-full">
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
                  "micro inline-flex min-h-11 items-center gap-1.5 px-1.5 text-sobrecesped decoration-2 underline-offset-4 hover:underline",
                  activa === s.id && "underline",
                )}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="sr-only sm:not-sr-only">{s.etiqueta}</span>
              </a>
            </li>
          ))}
        </ul>
        <span
          ref={balon}
          aria-hidden="true"
          className="balon pointer-events-none absolute bottom-1 left-0 z-0 block rounded-full"
          style={{ width: TAMANO_BALON, height: TAMANO_BALON }}
        />
      </div>
    </nav>
  );
}
