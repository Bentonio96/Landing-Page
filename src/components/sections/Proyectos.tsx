import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaProyecto } from "@/components/ui/TarjetaProyecto";
import { ResaltableProyecto } from "@/components/ui/ResaltableProyecto";

type Props = { idioma: Idioma; t: Diccionario };

export function Proyectos({ idioma, t }: Props) {
  return (
    <Seccion
      id="proyectos"
      numero="03"
      etiqueta={t.proyectos.etiqueta}
      titulo={t.proyectos.titulo}
      bajada={t.proyectos.bajada}
    >
      {proyectos.length === 0 ? (
        <p className="text-guia text-atenuado">{t.proyectos.vacio}</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {proyectos.map((proyecto, i) => (
            <li key={proyecto.slug} className="flex">
              <Reveal retardo={(i % 2) * 0.08} className="flex w-full">
                <ResaltableProyecto tecnologias={proyecto.tecnologias}>
                  <TarjetaProyecto
                    proyecto={proyecto}
                    idioma={idioma}
                    t={t}
                    indice={String(i + 1).padStart(2, "0")}
                  />
                </ResaltableProyecto>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Seccion>
  );
}
