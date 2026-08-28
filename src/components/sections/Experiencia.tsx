import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { HitoLinea } from "@/components/ui/HitoLinea";
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
        {/* Línea de tiempo: decorativa, se oculta a lectores de pantalla.
            La segunda capa se rellena en acento a medida que se baja. */}
        <span
          aria-hidden="true"
          className="absolute left-[10px] top-3 bottom-3 w-px -translate-x-1/2 bg-borde"
        />
        <span
          aria-hidden="true"
          className="linea-progreso absolute left-[10px] top-3 bottom-3 w-px -translate-x-1/2 origin-top bg-acento"
        />

        {experiencia.map((hito, i) => (
          <li key={hito.id} className="relative pl-10 pb-12 last:pb-0">
            <HitoLinea actual={hito.actual} retardo={i * 0.06}>
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
            </HitoLinea>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}
