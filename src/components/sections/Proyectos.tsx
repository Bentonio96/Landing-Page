import Image from "next/image";
import { ArrowUpRight, Github, Lock } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { pieza } from "@/lib/pieza";
import { Titulo } from "@/components/ui/Titulo";

type Props = { idioma: Idioma; t: Diccionario };

export function Proyectos({ idioma, t }: Props) {
  const tp = t.proyectos;
  return (
    <section
      id="proyectos"
      data-seccion="proyectos"
      aria-labelledby="titulo-proyectos"
      className="lienzo pb-seccion"
    >
      <Titulo id="proyectos" etiqueta={tp.etiqueta} titulo={tp.titulo} bajada={tp.bajada} />

      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {proyectos.map((p) => (
          <li key={p.slug} {...pieza(`tarjeta-${p.slug}`, "tarjeta", "caja")} className="panel flex flex-col p-3">
            <div
              {...pieza(`captura-${p.slug}`, "imagen", "caja")}
              className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-borde bg-elevado"
            >
              {p.imagen ? (
                <Image
                  src={p.imagen}
                  alt={`${tp.captura} ${p.nombre}`}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
                  blurDataURL={BLUR_PROYECTOS[p.slug]}
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,transparent_0_10px,var(--c-borde)_10px_11px)] p-4 text-center">
                  <Lock aria-hidden="true" className="size-5 text-tenue" />
                  <p className="font-mono text-etiqueta text-atenuado">{tp.interno}</p>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <div {...pieza(`nombre-${p.slug}`, "título")} className="flex items-baseline justify-between gap-3">
                <h3 className="text-[1.1875rem] font-semibold tracking-[-0.02em] text-texto">{p.nombre}</h3>
                {p.fecha ? (
                  <p className="shrink-0 font-mono text-[0.6875rem] text-tenue">{p.fecha[idioma]}</p>
                ) : null}
              </div>
              <p {...pieza(`desc-${p.slug}`, "texto")} className="mt-2 block text-menor text-atenuado">
                {p.descripcion[idioma]}
              </p>
              <ul {...pieza(`tec-${p.slug}`, "chips")} className="mt-4 flex flex-wrap gap-1.5" aria-label={`${idioma === "es" ? "Tecnologías de" : "Technologies in"} ${p.nombre}`}>
                {p.tecnologias.map((tec) => (
                  <li key={tec} className="chip">{tec}</li>
                ))}
              </ul>
              {p.demoUrl || p.repoUrl ? (
                <div {...pieza(`enlaces-${p.slug}`, "enlaces")} className="mt-auto flex flex-wrap gap-2 pt-5">
                  {p.demoUrl ? (
                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="boton boton-primario min-h-10 px-4">
                      {tp.verSitio}
                      <span className="sr-only">: {p.nombre} {tp.enlaceExterno}</span>
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  ) : null}
                  {p.repoUrl ? (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="boton boton-secundario min-h-10 px-4">
                      <Github aria-hidden="true" className="size-4" />
                      {tp.verCodigo}
                      <span className="sr-only">: {p.nombre} {tp.enlaceExterno}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
