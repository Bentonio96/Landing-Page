import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { Seccion } from "@/components/ui/Seccion";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Experiencia como tabla editorial: dónde y qué, cuándo, y el detalle, en
 * tres columnas separadas por reglas capilares. En móvil se apilan.
 */
export function Experiencia({ idioma, t }: Props) {
  return (
    <Seccion
      id="experiencia"
      numero="04"
      etiqueta={t.experiencia.etiqueta}
      titulo={t.experiencia.titulo}
      alterna
    >
      <ol data-trazo="" className="trazo-superior">
        {experiencia.map((hito) => (
          <li key={hito.id} data-trazo="" className="trazo-inferior">
            {/* Las tres columnas entran una tras otra: dónde, cuándo, qué. */}
            <div data-escalonar="" className="grid gap-x-canal gap-y-4 py-10 md:grid-cols-12 md:py-14">
              <div className="md:col-span-5">
                <h3 className="text-t3 text-texto">{hito.organizacion}</h3>
                <p className="mt-2 text-base text-atenuado">
                  {hito.rol[idioma]}
                </p>
                {hito.lugar ? (
                  <p className="mt-1 text-menor text-tenue">{hito.lugar}</p>
                ) : null}
              </div>

              <p className="etiqueta flex items-start gap-2.5 md:col-span-3 md:pt-2.5">
                {hito.actual ? (
                  <span
                    aria-hidden="true"
                    className="mt-1 size-1.5 shrink-0 rounded-full bg-acentovivo"
                  />
                ) : null}
                <span className={hito.actual ? "text-texto" : undefined}>
                  {hito.periodo[idioma]}
                  {hito.actual ? (
                    <span className="sr-only"> — {t.experiencia.actual}</span>
                  ) : null}
                </span>
              </p>

              <p className="text-base leading-relaxed text-atenuado md:col-span-4 md:pt-1.5">
                {hito.descripcion[idioma]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}
