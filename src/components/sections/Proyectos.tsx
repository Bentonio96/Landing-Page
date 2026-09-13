import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
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
        <ul data-trazo="" className="trazo-superior">
          {proyectos.map((proyecto, i) => (
            <li key={proyecto.slug} data-trazo="" className="trazo-inferior">
              <ResaltableProyecto tecnologias={proyecto.tecnologias}>
                <TarjetaProyecto
                  proyecto={proyecto}
                  idioma={idioma}
                  t={t}
                  invertida={i % 2 === 1}
                />
              </ResaltableProyecto>
            </li>
          ))}
        </ul>
      )}
    </Seccion>
  );
}
