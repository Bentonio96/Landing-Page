import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { stack } from "@/data/stack";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * El stack como parrilla de largada: cada categoría es una fila, de la
 * primera (lo que más uso) a los boxes (lo que estoy sumando). Las
 * principales llevan la señal violeta. Por debajo es una lista normal: un
 * título por fila y sus herramientas.
 */
export function Formacion({ idioma, t }: Props) {
  const lineas = t.v2.lineas as Record<string, string>;

  return (
    <section id="stack" aria-labelledby="stack-titulo" className="py-seccion">
      <div className="lienzo">
        <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-acento" aria-hidden="true">
          {t.v2.formacionFirma}
        </p>
        <div className="mt-1 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="stack-titulo" className="voz-carrera text-t1 md:col-span-7">
            {t.stack.titulo}
          </h2>
          <p className="text-guia text-atenuado md:col-span-5">{t.stack.bajada}</p>
        </div>

        {/* La parrilla: línea de largada a cuadros arriba y los cajones
            de cada fila marcados en el asfalto, en tinta sobre papel. */}
        <div className="relative mt-12 border-2 border-tinta px-3 pb-2 sm:px-8">
          <div aria-hidden="true" className="cuadros -mx-3 h-3 [--cuadro:6px] sm:-mx-8" />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <g fill="none" stroke="var(--c-regla-fuerte)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="6 6">
              <line x1="3" y1="0" x2="3" y2="100" vectorEffect="non-scaling-stroke" />
              <line x1="97" y1="0" x2="97" y2="100" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          {stack.map((categoria, i) => (
            <div
              key={categoria.id}
              data-revelar=""
              style={{ ["--retardo" as string]: `${i * 0.07}s` }}
              className={cn(
                "relative py-7 text-center sm:py-9",
                i > 0 && "border-t border-dashed border-regla",
              )}
            >
              <h3 className="micro relative inline-flex items-center gap-2 bg-fondo px-2 text-tenue">
                <span className="voz-carrera text-[0.8125rem] tracking-normal text-acento">
                  {lineas[categoria.id] ?? ""}
                </span>
                {" — "}
                {categoria.titulo[idioma]}
              </h3>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {categoria.items.map((item) => (
                  <li
                    key={item.nombre}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.9375rem]",
                      item.principal
                        ? "border-tinta bg-tinta text-fondo"
                        : "border-reglafuerte bg-fondo text-tinta",
                    )}
                  >
                    {item.principal ? (
                      <span aria-hidden="true" className="bg-senal inline-block size-2.5 rounded-full" />
                    ) : null}
                    {item.nombre}
                    {item.principal ? (
                      <span className="sr-only"> ({t.stack.principal})</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
