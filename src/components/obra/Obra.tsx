"use client";

import { useEffect, useRef, useState } from "react";
import type { Diccionario } from "@/i18n/diccionario";
import { Motor, type Modo } from "./motor";

type Props = { t: Diccionario["obra"] };

/** Iniciales de los cinco primeros agentes, para los avatares de la píldora. */
const AVATARES = [
  { letra: "F", color: "#FF7AC6" },
  { letra: "A", color: "#5CD0FF" },
  { letra: "I", color: "#5BE49B" },
  { letra: "J", color: "#FFD25C" },
  { letra: "D", color: "#B9A8FF" },
];

/**
 * Telón con el logo, capa de agentes y píldora de estado.
 *
 * El telón y la píldora se renderizan en el servidor: el telón tiene que
 * tapar el titular desarmado desde el primer cuadro, antes de hidratar. Lo
 * que se mueve lo crea y lo maneja el motor (ver motor.ts).
 */
export function Obra({ t }: Props) {
  const [fase, setFase] = useState<"armando" | "lista">("armando");
  const [reducido, setReducido] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  const motor = useRef<Motor | null>(null);

  const capa = useRef<HTMLDivElement>(null);
  const telon = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const ficha = useRef<SVGRectElement>(null);
  const trazoP = useRef<SVGPathElement>(null);
  const trazoD = useRef<SVGPathElement>(null);
  const agentes = useRef<HTMLElement>(null);
  const capas = useRef<HTMLElement>(null);
  const total = useRef<HTMLElement>(null);
  const prs = useRef<HTMLElement>(null);
  const totalPrs = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const modo = (html.getAttribute("data-obra") as Modo | null) ?? "armada";
    html.setAttribute("data-obra-viva", "");
    setReducido(modo === "armada");
    if (modo !== "armada") setAnuncio(t.anuncioInicio);

    const m = new Motor(
      {
        capa: capa.current!,
        telon: telon.current!,
        logo: logo.current!,
        ficha: ficha.current!,
        trazoP: trazoP.current!,
        trazoD: trazoD.current!,
        agentes: agentes.current!,
        capas: capas.current!,
        total: total.current!,
        prs: prs.current!,
        totalPrs: totalPrs.current!,
      },
      {
        alTerminar: () => {
          setFase("lista");
          if (modo !== "armada") setAnuncio(t.anuncioFin);
        },
        alReiniciar: () => {
          setFase("armando");
          setAnuncio(t.anuncioInicio);
        },
      },
    );
    motor.current = m;
    m.iniciar(modo);
    return () => m.destruir();
  }, [t]);

  return (
    <>
      <div ref={telon} className="telon" aria-hidden="true">
        <div ref={logo} className="logo-intro">
          <svg viewBox="0 0 64 64">
            <rect ref={ficha} className="ficha" width="64" height="64" rx="14" />
            <g transform="translate(32 32) scale(0.8615) translate(-32 -32)">
              <path ref={trazoP} className="trazo" d="M12.5 6H34.5A13.5 13.5 0 0 1 44.562 28.5H23.5V58H12.5Z" />
              <path ref={trazoD} className="trazo" d="M28.5 33.5H47.5A14.5 14.5 0 0 1 37 58H28.5Z" />
            </g>
          </svg>
        </div>
        <p className="etiqueta absolute inset-x-0 bottom-28 text-center">{t.telon}</p>
      </div>

      <div ref={capa} className="capa-agentes" aria-hidden="true" />

      <div
        role="region"
        aria-label={t.estado}
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex justify-center px-3 sm:bottom-6"
      >
        <div
          data-fase={fase}
          className="pastilla vidrio pointer-events-auto items-center gap-2.5 rounded-full py-1.5 pl-2 pr-1.5 font-mono text-[0.75rem] text-atenuado shadow-[0_14px_40px_-16px_var(--c-sombra)] sm:gap-3 sm:pl-2.5"
        >
          <span className="hidden -space-x-1.5 min-[420px]:flex" aria-hidden="true">
            {AVATARES.map((a) => (
              <span
                key={a.letra}
                className="flex size-6 items-center justify-center rounded-full border-2 border-[var(--c-superficie)] text-[0.625rem] font-medium text-[#0E1117]"
                style={{ background: a.color }}
              >
                {a.letra}
              </span>
            ))}
          </span>
          <span className="punto-vivo shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">
            <b ref={agentes} className="font-medium text-texto">24</b> {t.agentes}
          </span>
          <span className="whitespace-nowrap">
            <b ref={capas} className="font-medium text-texto">0</b>/<span ref={total}>0</span>{" "}
            {t.capas}
          </span>
          <span className="whitespace-nowrap">
            <b ref={prs} className="font-medium text-texto">0</b>/<span ref={totalPrs}>6</span>{" "}
            {t.prs}
          </span>
          {fase === "armando" ? (
            <button
              type="button"
              onClick={() => motor.current?.saltar()}
              aria-label={t.saltarEtiqueta}
              className="ml-0.5 min-h-8 rounded-full bg-texto px-3.5 font-sans text-[0.8125rem] font-medium text-fondo transition-colors hover:bg-acento hover:text-acentosobre"
            >
              {t.saltar}
            </button>
          ) : reducido ? null : (
            <button
              type="button"
              onClick={() => motor.current?.rearmar()}
              aria-label={t.rearmarEtiqueta}
              className="ml-0.5 min-h-8 rounded-full border border-bordefuerte px-3.5 font-sans text-[0.8125rem] font-medium text-texto transition-colors hover:border-acento hover:text-acento"
            >
              {t.rearmar}
            </button>
          )}
        </div>
      </div>

      <p role="status" className="sr-only">
        {anuncio}
      </p>
    </>
  );
}
