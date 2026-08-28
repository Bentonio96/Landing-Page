import { ArrowUpRight, Code2 } from "lucide-react";
import type { Idioma, Proyecto } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { Boton } from "./Boton";
import { Chip } from "./Chip";

type Props = {
  proyecto: Proyecto;
  idioma: Idioma;
  t: Diccionario;
  /** Número editorial mostrado en la esquina, p.ej. "01". */
  indice: string;
};

/**
 * Tarjeta de un proyecto.
 *
 * Los dos enlaces son independientes y condicionales: si el proyecto no
 * tiene `demoUrl` o `repoUrl`, ese botón no se renderiza. La tarjeta
 * nunca muestra un enlace roto.
 */
export function TarjetaProyecto({ proyecto, idioma, t, indice }: Props) {
  const { nombre, descripcion, tecnologias, demoUrl, repoUrl, anio } = proyecto;
  const idTitulo = `proyecto-${proyecto.slug}-titulo`;
  // Si el proyecto todavía no tiene URLs, no se reserva el espacio de los
  // botones: la tarjeta se cierra limpia en vez de dejar un hueco muerto.
  const tieneEnlaces = Boolean(demoUrl ?? repoUrl);

  return (
    <article
      aria-labelledby={idTitulo}
      className="group relative flex h-full flex-col border border-borde bg-superficie p-6 transition-colors duration-300 hover:border-bordefuerte sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="etiqueta" aria-hidden="true">
          {indice}
        </span>
        {anio ? <span className="etiqueta">{anio}</span> : null}
      </div>

      <h3 id={idTitulo} className="mt-5 text-t3">
        {nombre}
      </h3>

      <p className="mt-3 text-base leading-relaxed text-atenuado">
        {descripcion[idioma]}
      </p>

      {tecnologias.length > 0 ? (
        <ul
          aria-label={`${t.proyectos.tecnologiasDe} ${nombre}`}
          className="mt-6 flex flex-wrap gap-2"
        >
          {tecnologias.map((tec) => (
            <Chip key={tec}>{tec}</Chip>
          ))}
        </ul>
      ) : null}

      {/* Los botones se anclan abajo para que todas las tarjetas de una
          fila terminen alineadas, sin importar el largo del texto. */}
      {tieneEnlaces ? (
      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        {demoUrl ? (
          <Boton
            href={demoUrl}
            variante="primario"
            externo
            etiquetaAccesible={`${t.proyectos.verSitio}: ${nombre}`}
            avisoExterno={t.proyectos.enlaceExterno}
          >
            {t.proyectos.verSitio}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover/boton:translate-x-0.5 group-hover/boton:-translate-y-0.5"
            />
          </Boton>
        ) : null}

        {repoUrl ? (
          <Boton
            href={repoUrl}
            variante="secundario"
            externo
            etiquetaAccesible={`${t.proyectos.verCodigo}: ${nombre}`}
            avisoExterno={t.proyectos.enlaceExterno}
          >
            <Code2 aria-hidden="true" className="size-4" />
            {t.proyectos.verCodigo}
          </Boton>
        ) : null}
      </div>
      ) : null}
    </article>
  );
}
