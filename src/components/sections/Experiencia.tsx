import { ArrowUpRight } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { EncabezadoSeccion } from "@/components/ui/Encabezado";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Línea de tiempo ondulada del reel. En escritorio la onda cruza la página
 * y cada hito cuelga de su nodo (arriba, abajo, arriba…). La onda se dibuja
 * con el scroll (--p, Movimiento.tsx). En pantallas angostas es una lista
 * con la línea a la izquierda.
 */
const ONDA =
  "M0,50 C60,50 70,18 125,18 S300,82 375,82 S550,18 625,18 S800,82 875,82 S960,50 1000,50";

export function Experiencia({ idioma, t }: Props) {
  const n = experiencia.length;
  return (
    <section id="experiencia" aria-labelledby="experiencia-titulo" className="lienzo py-seccion" data-progreso="entrada">
      <EncabezadoSeccion id="experiencia-titulo" titulo={t.experiencia.titulo} bajada={t.experiencia.bajada} />

      <div className="relative mt-14 hidden h-[7.5rem] lg:block" aria-hidden="true">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="onda absolute inset-0 size-full overflow-visible">
          <path d={ONDA} pathLength={1} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className="text-bordefuerte" />
        </svg>
        {experiencia.map((h, i) => (
          <span
            key={h.id}
            className={cn(
              "nodo absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-texto",
              h.actual ? "bg-acentovivo" : "bg-fondo",
            )}
            style={{ left: `${((i + 0.5) / n) * 100}%`, top: i % 2 === 0 ? "18%" : "82%" }}
          />
        ))}
      </div>

      <ol className="relative mt-12 grid gap-12 border-l border-bordefuerte pl-7 lg:mt-6 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
        {experiencia.map((h, i) => (
          <li key={h.id} className={cn("relative", i % 2 === 1 && "lg:mt-14")}>
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[2.2rem] top-1 size-3.5 rounded-full border-2 border-texto lg:hidden",
                h.actual ? "bg-acentovivo" : "bg-fondo",
              )}
            />
            <p className="mono flex flex-wrap items-center gap-2 text-[0.75rem] text-tenue">
              {h.actual ? (
                <span className="rounded-[4px] bg-texto px-1.5 py-0.5 font-medium text-fondo">{t.experiencia.actual}</span>
              ) : null}
              {h.periodo[idioma]}
            </p>
            <h3 className="ancho mt-3 text-t3 font-bold">
              {h.rol[idioma].split(" · ")[0]}
              {h.rol[idioma].includes(" · ") ? (
                <span className="mt-1 block text-base font-semibold tracking-normal [font-variation-settings:'wdth'_100]">
                  <span className="sr-only">, </span>
                  {h.rol[idioma].split(" · ").slice(1).join(" · ")}
                </span>
              ) : null}
            </h3>
            <p className="mt-2 text-menor font-semibold">
              {h.organizacion}
              {h.lugar ? <span className="font-normal text-atenuado">, {h.lugar}</span> : null}
            </p>
            <p className="mt-3 text-menor text-atenuado">{h.descripcion[idioma]}</p>
            {h.enlaces?.length ? (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-menor font-semibold">
                {h.enlaces.map((e) => (
                  <li key={e.url}>
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                      <span className="enlace">{e.etiqueta[idioma]}</span>
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
