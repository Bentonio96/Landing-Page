"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Idioma, Proyecto } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario; proyectos: Proyecto[] };

const dorsal = (i: number) => `P${i + 1}`;

/**
 * Los proyectos como clasificación: P1, P2… del más reciente al más
 * antiguo. En
 * escritorio, la captura del que se apunta o se enfoca aparece en una
 * pizarra fija a la derecha (decorativa: cada fila ya tiene todo su
 * contenido). En un teléfono, cada fila lleva su captura dentro.
 */
export function Plantel({ idioma, t, proyectos }: Props) {
  const [activo, setActivo] = useState(proyectos[0]?.slug ?? "");
  const indiceActivo = Math.max(0, proyectos.findIndex((p) => p.slug === activo));

  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="py-seccion">
      <div className="lienzo">
        <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-acento" aria-hidden="true">
          {t.v2.plantelFirma}
        </p>
        <h2 id="proyectos-titulo" className="voz-carrera mt-1 text-t1">
          {t.proyectos.titulo}
        </h2>
        <p className="mt-6 text-guia text-atenuado">{t.proyectos.bajada}</p>

        <div className="mt-12 grid gap-x-canal lg:grid-cols-12">
          <ol className="regla-sup lg:col-span-7">
            {proyectos.map((p, i) => (
              <li
                key={p.slug}
                onPointerEnter={() => setActivo(p.slug)}
                onFocusCapture={() => setActivo(p.slug)}
                className="regla-inf"
              >
                <article
                  aria-labelledby={`proyecto-${p.slug}`}
                  className={cn(
                    "grid gap-y-3 py-8 transition-colors sm:grid-cols-[auto_1fr] sm:gap-x-6",
                    activo === p.slug && "lg:bg-elevado/60",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "voz-carrera pl-1 text-[clamp(2rem,5vw,3.25rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--c-tinta)]",
                      activo === p.slug && "lg:text-acento lg:[-webkit-text-stroke:0]",
                    )}
                  >
                    {dorsal(i)}
                  </span>

                  <div className="min-w-0 pr-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3
                        id={`proyecto-${p.slug}`}
                        className={cn(
                          "voz-carrera leading-[0.98]",
                          // Los nombres largos bajan de cuerpo para no partirse.
                          p.nombre.length > 14
                            ? "text-[clamp(1.25rem,0.9rem+1.6vw,2.125rem)]"
                            : "text-[clamp(1.375rem,1rem+2.2vw,3.25rem)]",
                        )}
                      >
                        {p.nombre}
                      </h3>
                      {p.fecha ? (
                        <p className="micro text-tenue">{p.fecha[idioma]}</p>
                      ) : null}
                    </div>

                    {p.imagen ? (
                      <div className="relative mt-5 aspect-[16/10] overflow-hidden border border-regla lg:hidden">
                        <Image
                          src={p.imagen}
                          alt={`${t.proyectos.captura} ${p.nombre}`}
                          fill
                          sizes="(max-width: 1024px) 85vw, 1px"
                          placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
                          blurDataURL={BLUR_PROYECTOS[p.slug]}
                          className="object-cover object-top"
                        />
                      </div>
                    ) : null}

                    <p className="mt-4 max-w-[60ch] text-guia text-atenuado">
                      {p.descripcion[idioma]}
                    </p>

                    <ul
                      aria-label={`${t.proyectos.tecnologiasDe} ${p.nombre}`}
                      className="mt-4 flex flex-wrap gap-1.5"
                    >
                      {p.tecnologias.map((tec) => (
                        <li
                          key={tec}
                          className="micro rounded-full border border-reglafuerte px-2.5 py-1 text-tinta"
                        >
                          {tec}
                        </li>
                      ))}
                    </ul>

                    {p.demoUrl || p.repoUrl ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.demoUrl ? (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="boton-pista etiqueta inline-flex min-h-11 items-center gap-2 border border-tinta bg-tinta px-4 text-fondo"
                          >
                            {t.proyectos.verSitio}
                            <span className="sr-only">
                              {" "}
                              {p.nombre} {t.proyectos.enlaceExterno}
                            </span>
                            <ArrowUpRight aria-hidden="true" className="size-4" />
                          </a>
                        ) : null}
                        {p.repoUrl ? (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="boton-pista etiqueta inline-flex min-h-11 items-center gap-2 border border-reglafuerte px-4 text-tinta"
                          >
                            <Code2 aria-hidden="true" className="size-4" />
                            {t.proyectos.verCodigo}
                            <span className="sr-only">
                              {" "}
                              {p.nombre} {t.proyectos.enlaceExterno}
                            </span>
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <p className="micro mt-5 text-tenue">{t.v2.sinDemo}</p>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ol>

          {/* Pizarra de vista previa, solo en escritorio. */}
          <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="asfalto relative aspect-[16/11] overflow-hidden p-3 pb-5">
                {proyectos.map((p, i) =>
                  p.imagen ? (
                    <div
                      key={p.slug}
                      data-activa={activo === p.slug}
                      className="previa-captura absolute inset-3 bottom-5"
                    >
                      <Image
                        src={p.imagen}
                        alt=""
                        fill
                        sizes="36vw"
                        loading={i === 0 ? "eager" : "lazy"}
                        placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
                        blurDataURL={BLUR_PROYECTOS[p.slug]}
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      key={p.slug}
                      data-activa={activo === p.slug}
                      className="previa-captura absolute inset-3 bottom-5 flex items-center justify-center bg-fondo p-8 text-center"
                    >
                      <p className="voz-carrera text-t3 text-tinta">{p.nombre}</p>
                    </div>
                  ),
                )}
                <div className="piano absolute inset-x-0 bottom-0 h-2" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="micro text-tenue">{t.v2.vistaPrevia}</p>
                <p className="voz-carrera text-t2 text-acento">
                  {dorsal(indiceActivo)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
