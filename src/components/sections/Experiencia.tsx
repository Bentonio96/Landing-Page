import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario };

export function Experiencia({ idioma, t }: Props) {
  return (
    <Seccion
      id="experiencia"
      numero="04"
      etiqueta={t.experiencia.etiqueta}
      titulo={t.experiencia.titulo}
    >
      <ol className="relative">
        {/* Línea de tiempo: decorativa, se oculta a lectores de pantalla. */}
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-2 bottom-2 w-px bg-borde"
        />

        {experiencia.map((hito, i) => (
          <li key={hito.id} className="relative pl-8 pb-10 last:pb-0">
            <Reveal retardo={i * 0.06}>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-2 size-[11px] rounded-full border-2",
                  hito.actual
                    ? "border-acento bg-acento"
                    : "border-bordefuerte bg-fondo",
                )}
              />

              <p className="etiqueta flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={cn(hito.actual && "text-acento")}>
                  {hito.periodo[idioma]}
                </span>
                {hito.lugar ? (
                  <span className="text-tenue">{hito.lugar}</span>
                ) : null}
              </p>

              <h3 className="mt-3 text-t3">{hito.organizacion}</h3>

              <p className="mt-1 font-mono text-menor text-texto">
                {hito.rol[idioma]}
              </p>

              <p className="mt-3 max-w-medida text-base leading-relaxed text-atenuado">
                {hito.descripcion[idioma]}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}
