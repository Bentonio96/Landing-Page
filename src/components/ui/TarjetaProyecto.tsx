import Image from "next/image";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Idioma, Proyecto } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { cn } from "@/lib/utils";
import { Boton } from "./Boton";
import { Chip } from "./Chip";

type Props = {
  proyecto: Proyecto;
  idioma: Idioma;
  t: Diccionario;
  /** Número editorial mostrado junto al año, p.ej. "01". */
  indice: string;
  /** Pone la captura a la derecha en escritorio, para alternar filas. */
  invertida?: boolean;
};

/**
 * Un proyecto, como fila editorial: captura a un lado y texto al otro,
 * alternando lado de una fila a la siguiente.
 *
 * Los dos enlaces son independientes y condicionales: si el proyecto no
 * tiene `demoUrl` o `repoUrl`, ese enlace no se renderiza. La fila nunca
 * muestra un enlace roto.
 *
 * La captura se muestra siempre. En escritorio va en grises y recupera el
 * color al apuntar la fila; en pantallas táctiles va en color desde el
 * principio (ver .captura-proyecto en globals.css).
 *
 * Las imágenes se cargan en diferido: la sección queda bajo el pliegue en
 * todos los tamaños, así que precargarlas solo le quitaría ancho de banda a
 * la foto del hero, que sí es el elemento LCP.
 */
export function TarjetaProyecto({
  proyecto,
  idioma,
  t,
  indice,
  invertida = false,
}: Props) {
  const { nombre, descripcion, tecnologias, demoUrl, repoUrl, anio, imagen } =
    proyecto;
  const idTitulo = `proyecto-${proyecto.slug}-titulo`;
  const tieneEnlaces = Boolean(demoUrl ?? repoUrl);

  return (
    <article
      aria-labelledby={idTitulo}
      className="fila-proyecto grid items-center gap-x-canal gap-y-8 py-12 md:grid-cols-12 md:py-20"
    >
      <div
        className={cn(
          "marco-captura md:col-span-7",
          invertida && "md:order-last md:col-start-6",
        )}
      >
        {imagen ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-elevado">
            <Image
              src={imagen}
              alt={`${t.proyectos.captura} ${nombre}`}
              fill
              sizes="(max-width: 768px) 92vw, 56vw"
              loading="lazy"
              placeholder={BLUR_PROYECTOS[proyecto.slug] ? "blur" : "empty"}
              blurDataURL={BLUR_PROYECTOS[proyecto.slug]}
              className="captura-proyecto object-cover object-top"
            />
          </div>
        ) : (
          // Sin captura (sistemas internos) se reserva igual el hueco, con
          // el número en contorno: la alternancia de filas no se rompe y no
          // queda media fila vacía.
          <div className="flex aspect-[16/10] flex-col justify-between border border-borde p-6 sm:p-8">
            <p className="etiqueta">{t.proyectos.sinCaptura}</p>
            <span
              aria-hidden="true"
              className="numero-contorno self-end font-display text-[clamp(7rem,3rem+14vw,17rem)] leading-[0.78]"
            >
              {indice}
            </span>
          </div>
        )}
      </div>

      <div
        className={cn(
          "md:col-span-5",
          invertida ? "md:col-start-1 md:row-start-1" : "md:col-start-8",
        )}
      >
        <p className="etiqueta flex items-baseline gap-3">
          <span aria-hidden="true">{indice}</span>
          {anio ? <span>{anio}</span> : null}
        </p>

        <h3 id={idTitulo} className="mt-5 font-display text-t2 font-normal uppercase">
          {nombre}
        </h3>

        <p className="mt-5 text-base leading-relaxed text-atenuado">
          {descripcion[idioma]}
        </p>

        {tecnologias.length > 0 ? (
          <ul
            aria-label={`${t.proyectos.tecnologiasDe} ${nombre}`}
            className="mt-6 flex flex-wrap gap-2"
          >
            {tecnologias.map((tec) => (
              <Chip key={tec} origen="proyecto">
                {tec}
              </Chip>
            ))}
          </ul>
        ) : null}

        {tieneEnlaces ? (
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {demoUrl ? (
              <Boton
                href={demoUrl}
                variante="enlace"
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
                variante="enlace"
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
      </div>
    </article>
  );
}
