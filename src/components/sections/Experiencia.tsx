import Image from "next/image";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { experiencia } from "@/data/experiencia";
import { pieza } from "@/lib/pieza";
import { Titulo } from "@/components/ui/Titulo";

type Props = { idioma: Idioma; t: Diccionario };

export function Experiencia({ idioma, t }: Props) {
  return (
    <section
      id="experiencia"
      data-seccion="experiencia"
      aria-labelledby="titulo-experiencia"
      className="lienzo pb-seccion"
    >
      <Titulo id="experiencia" etiqueta={t.experiencia.etiqueta} titulo={t.experiencia.titulo} />

      <ol className="mt-10 grid gap-4">
        {experiencia.map((hito) => (
          <li
            key={hito.id}
            {...pieza(`hito-${hito.id}`, "hito", "caja")}
            className="panel grid gap-3 p-5 sm:p-6 md:grid-cols-[13rem_1fr] md:gap-8"
          >
            <div className="flex items-start gap-4 md:flex-col">
              {hito.logo ? (
                <div
                  {...pieza(`hito-logo-${hito.id}`, "logo", "caja")}
                  className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[10px] border border-borde bg-white p-2 md:h-20 md:w-28"
                >
                  {/* El nombre de la organización ya está escrito al lado: el logo es decorativo. */}
                  <Image
                    src={hito.logo}
                    alt=""
                    width={112}
                    height={80}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <div {...pieza(`hito-periodo-${hito.id}`, "periodo")} className="block">
                <p className="font-mono text-etiqueta text-atenuado">{hito.periodo[idioma]}</p>
                {hito.actual ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-etiqueta text-ok">
                    <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
                    {t.experiencia.actual}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <h3 {...pieza(`hito-rol-${hito.id}`, "h3")} className="block text-[1.1875rem] font-semibold tracking-[-0.02em] text-texto">
                {hito.rol[idioma]}
              </h3>
              <p {...pieza(`hito-org-${hito.id}`, "org")} className="mt-1 block text-menor text-tenue">
                {hito.organizacion}
                {hito.lugar ? ` · ${hito.lugar}` : ""}
              </p>
              <p {...pieza(`hito-desc-${hito.id}`, "texto")} className="mt-3 block max-w-[70ch] text-menor text-atenuado">
                {hito.descripcion[idioma]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
