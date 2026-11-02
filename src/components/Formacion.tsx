import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { stack } from "@/data/stack";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * El stack como pizarra táctica: cada categoría es una línea del equipo,
 * de la delantera (lo que más uso) a la banca (lo que estoy sumando). Las
 * principales llevan el balón. Debajo de la pizarra es una lista normal:
 * un título por línea y sus herramientas.
 */
export function Formacion({ idioma, t }: Props) {
  const lineas = t.cancha.lineas as Record<string, string>;

  return (
    <section id="stack" aria-labelledby="stack-titulo" className="py-seccion">
      <div className="lienzo">
        <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-acento" aria-hidden="true">
          {t.cancha.formacionFirma}
        </p>
        <div className="mt-1 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="stack-titulo" className="voz-camiseta text-t1 md:col-span-7">
            {t.stack.titulo}
          </h2>
          <p className="text-guia text-atenuado md:col-span-5">{t.stack.bajada}</p>
        </div>

        {/* La pizarra: líneas de cal en tinta sobre papel. */}
        <div className="relative mt-12 border-2 border-tinta px-3 py-2 sm:px-8">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <g fill="none" stroke="var(--c-regla)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
              <line x1="0" y1="50" x2="100" y2="50" vectorEffect="non-scaling-stroke" />
              <rect x="30" y="0" width="40" height="13" vectorEffect="non-scaling-stroke" />
              <rect x="30" y="87" width="40" height="13" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 sm:size-44"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--c-regla)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
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
              <h3 className="micro relative inline-block bg-papel px-2 text-tenue">
                <span className="text-tinta">{lineas[categoria.id] ?? ""}</span>
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
                        ? "border-tinta bg-tinta text-papel"
                        : "border-reglafuerte bg-papel text-tinta",
                    )}
                  >
                    {item.principal ? (
                      <span aria-hidden="true" className="balon inline-block size-2.5 rounded-full" />
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
