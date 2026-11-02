import Image from "next/image";
import { ArrowUpRight, Github, Radio as IconoRadio } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { BotonRadio } from "@/components/BotonRadio";
import { Encabezado } from "./Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * S2 · Garage: los proyectos, uno por box. Cada captura está detrás de una
 * cortina de garage que sube con el scroll (Movimiento.tsx); sin JavaScript
 * o sin movimiento, la cortina ya está arriba.
 */
export function Garage({ idioma, t }: Props) {
  const s = t.nav.sectores.garage;
  return (
    <section id="garage" aria-labelledby="garage-titulo" className="relative z-[1] px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Encabezado id="garage" codigo={s.codigo} metafora={s.metafora} titulo={t.garage.titulo} bajada={t.garage.bajada} />

        <ol className="mt-14 border-t border-tinta">
          {proyectos.map((p, i) => {
            const posicion = String(i + 1).padStart(2, "0");
            return (
              <li
                key={p.slug}
                id={`proyecto-${p.slug}`}
                className="grid scroll-mt-20 gap-6 border-b border-linea py-10 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:py-14"
              >
                <article aria-labelledby={`p-${p.slug}`} className="flex min-w-0 flex-col">
                  <p className="mono-etiqueta flex items-center gap-3 text-atenuado">
                    <span className="tnum text-morado">P{posicion}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-lineafuerte" />
                    {p.clase[idioma]}
                  </p>
                  <h3 id={`p-${p.slug}`} className="titular mt-3 text-[clamp(2rem,1.5rem+2.8vw,4rem)] leading-[0.95] hyphens-auto [overflow-wrap:anywhere]">
                    {p.nombre}
                  </h3>
                  <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-atenuado">
                    {p.descripcion[idioma]}
                  </p>

                  <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-linea pt-4 text-[0.9375rem]">
                    <dt className="mono-etiqueta pt-0.5 text-tenue">{t.garage.motor}</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-x-3 gap-y-1">
                        {p.tecnologias.map((tec, j) => (
                          <li key={tec} className={j === 0 ? "font-medium text-tinta" : "text-atenuado"}>
                            {tec}
                          </li>
                        ))}
                      </ul>
                    </dd>
                    {p.fecha && (
                      <>
                        <dt className="mono-etiqueta pt-0.5 text-tenue">{t.garage.fecha}</dt>
                        <dd className="text-atenuado">{p.fecha[idioma]}</dd>
                      </>
                    )}
                  </dl>

                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="barrido inline-flex h-11 items-center gap-2 border border-tinta bg-tinta px-4 font-mono text-etiqueta uppercase tracking-[0.1em] text-papel [--barrido:var(--c-morado)] hover:border-morado hover:text-sobremorado"
                      >
                        {t.garage.verSitio}
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                        <span className="sr-only">
                          {p.nombre} {t.garage.enlaceExterno}
                        </span>
                      </a>
                    )}
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="barrido inline-flex h-11 items-center gap-2 border border-tinta px-4 font-mono text-etiqueta uppercase tracking-[0.1em] [--barrido:var(--c-tinta)] hover:text-papel"
                      >
                        <Github aria-hidden="true" className="size-4" />
                        {t.garage.verCodigo}
                        <span className="sr-only">
                          {p.nombre} {t.garage.enlaceExterno}
                        </span>
                      </a>
                    )}
                    <BotonRadio
                      pregunta={p.nombre}
                      className="inline-flex h-11 items-center gap-2 px-2 font-mono text-etiqueta uppercase tracking-[0.1em] underline decoration-lineafuerte underline-offset-4 hover:text-morado"
                    >
                      <IconoRadio aria-hidden="true" className="size-4" />
                      {t.garage.preguntar}
                      <span className="sr-only">: {p.nombre}</span>
                    </BotonRadio>
                  </div>
                  {!p.demoUrl && <p className="mt-3 text-[0.9375rem] text-tenue">{t.garage.interno}</p>}
                </article>

                <div className="mira min-w-0 self-start">
                  <div data-garage className="relative aspect-[16/10] overflow-hidden border border-tinta bg-panel">
                    {p.imagen ? (
                      <Image
                        src={p.imagen}
                        alt={`${t.garage.captura} ${p.nombre}`}
                        fill
                        sizes="(min-width: 1440px) 720px, (min-width: 1024px) 52vw, calc(100vw - 32px)"
                        placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
                        blurDataURL={BLUR_PROYECTOS[p.slug]}
                        className="object-cover object-top"
                      />
                    ) : (
                      <PlanoInterno nombre={p.nombre} />
                    )}
                    <span aria-hidden="true" data-cortina className="cortina absolute inset-0" />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 bg-tinta px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-papel"
                    >
                      Box {posicion} · {p.slug}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** El portal de CMPC no tiene captura pública: un plano de sus piezas. */
function PlanoInterno({ nombre }: { nombre: string }) {
  const piezas = ["Power Pages", "Power Apps", "Power BI", "Chatbot IA"];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(45deg,transparent_0_10px,var(--c-linea)_10px_11px)]"
    >
      <div className="grid w-[78%] grid-cols-2 gap-px border border-tinta bg-tinta">
        <p className="titular col-span-2 bg-panelalto px-4 py-3 text-center text-xl">{nombre}</p>
        {piezas.map((p) => (
          <p key={p} className="bg-panelalto px-3 py-3 text-center font-mono text-etiqueta uppercase tracking-[0.1em]">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
