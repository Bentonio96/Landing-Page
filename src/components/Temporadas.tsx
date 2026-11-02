import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * La experiencia como tabla de temporadas: el periodo en mono a la
 * izquierda, la organización y el puesto en la voz de carrera. La
 * temporada en curso lleva la señal violeta.
 */
export function Temporadas({ idioma, t }: Props) {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      className="bg-elevado/70 py-seccion"
    >
      <div className="lienzo">
        <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-acento" aria-hidden="true">
          {t.v2.temporadasFirma}
        </p>
        <h2 id="experiencia-titulo" className="voz-carrera mt-1 text-t1">
          {t.experiencia.titulo}
        </h2>

        <ol className="regla-sup mt-12">
          {experiencia.map((hito, i) => (
            <li
              key={hito.id}
              data-revelar=""
              style={{ ["--retardo" as string]: `${i * 0.06}s` }}
              className="regla-inf grid gap-3 py-8 md:grid-cols-12 md:gap-x-canal"
            >
              <div className="md:col-span-3">
                <p className="micro text-tinta">{hito.periodo[idioma]}</p>
                {hito.actual ? (
                  <p className="micro mt-2 inline-flex items-center gap-2 text-acento">
                    <span aria-hidden="true" className="bg-senal inline-block size-2.5 rounded-full" />
                    {t.experiencia.actual}
                  </p>
                ) : null}
              </div>
              <div className="md:col-span-5">
                <h3 className="voz-carrera text-t3">{hito.organizacion}</h3>
                <p className="mt-1.5 font-medium">{hito.rol[idioma]}</p>
                {hito.lugar ? <p className="micro mt-2 text-tenue">{hito.lugar}</p> : null}
              </div>
              <p className="text-atenuado md:col-span-4">{hito.descripcion[idioma]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
