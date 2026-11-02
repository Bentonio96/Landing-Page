import { Plus } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { Encabezado } from "./Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * S4 · Tiempos: la experiencia como la torre de posiciones de una
 * transmisión. P1 es lo más reciente. Cada fila es un <details> nativo:
 * se abre con teclado y lector de pantalla sin una línea de JavaScript.
 */
export function Tiempos({ idioma, t }: Props) {
  const s = t.nav.sectores.tiempos;
  return (
    <section id="tiempos" aria-labelledby="tiempos-titulo" className="relative z-[1] px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Encabezado id="tiempos" codigo={s.codigo} metafora={s.metafora} titulo={t.tiempos.titulo} bajada={t.tiempos.bajada} />

        <ol data-torre className="mt-12 border-t-2 border-tinta">
          {experiencia.map((h, i) => (
            <li key={h.id} className="border-b border-linea">
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-4 hover:bg-[color-mix(in_srgb,var(--c-panel)_70%,transparent)] md:grid-cols-[4rem_minmax(0,1.3fr)_minmax(0,1fr)_9rem_2.5rem] md:gap-x-6 md:px-2 [&::-webkit-details-marker]:hidden">
                  <span className="titular text-2xl tnum md:text-3xl">
                    <span className="sr-only">{t.tiempos.pos} </span>P{i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] font-semibold leading-tight">{h.organizacion}</span>
                    <span className="block text-[0.9375rem] leading-snug text-atenuado">{h.rol[idioma]}</span>
                  </span>
                  <span className="col-start-2 font-mono text-etiqueta text-atenuado tnum md:col-start-auto">
                    {h.periodo[idioma]}
                  </span>
                  <span className="col-start-2 row-start-3 md:col-start-auto md:row-start-auto">
                    <span
                      className={
                        h.actual
                          ? "mono-etiqueta inline-flex items-center gap-2 text-senal"
                          : "mono-etiqueta inline-flex items-center gap-2 text-tenue"
                      }
                    >
                      {h.actual ? <span className="pulso" aria-hidden="true" /> : <span aria-hidden="true" className="cuadros h-2.5 w-4 [--tam:2.5px]" />}
                      {h.actual ? t.tiempos.enPista : t.tiempos.completada}
                    </span>
                  </span>
                  <span className="col-start-3 row-span-3 row-start-1 grid size-9 place-items-center self-center border border-linea transition-transform group-open:rotate-45 md:col-start-auto md:row-span-1 md:row-start-auto">
                    <Plus aria-hidden="true" className="size-4" />
                  </span>
                </summary>
                <div className="grid pb-6 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-x-6 md:px-2">
                  <p className="max-w-[70ch] text-[1.0625rem] leading-relaxed text-atenuado md:col-start-2">
                    {h.descripcion[idioma]}
                    {h.lugar && <span className="mt-2 block font-mono text-etiqueta text-tenue">{h.lugar}</span>}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
