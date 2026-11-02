import Image from "next/image";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { idiomasHablados } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { Circuito } from "@/components/Circuito";
import { Tacometro } from "@/components/Tacometro";
import { BordeCuadros } from "@/components/BordeCuadros";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Sobre mí, como el corte a color fuerte del reel, llevado a la pista:
 * asfalto a sangre, la silueta del retrato, el 96 como número de carrera
 * y el trazado de un circuito que se dibuja al bajar. El tacómetro marca
 * un dato real: cuántos proyectos del portafolio tienen demo pública.
 */
export function Ficha({ idioma, t }: Props) {
  const [entrada, ...resto] = t.sobreMi.parrafos;
  const { cita } = t.sobreMi;
  const idiomas = idiomasHablados
    .map((i) => `${i.nombre[idioma]} (${i.nivel[idioma].toLowerCase()})`)
    .join(" · ");

  return (
    <section
      id="sobre-mi"
      aria-labelledby="sobre-mi-titulo"
      className="asfalto sobre-asfalto relative isolate overflow-hidden"
    >
      <BordeCuadros />

      <div className="lienzo mt-seccion grid gap-y-12 lg:grid-cols-12 lg:gap-x-canal">
        {/* Silueta, número y circuito. Decorativos: el retrato ya está en
            la portada y el número, en el encabezado. */}
        <div
          aria-hidden="true"
          className="relative mx-auto w-[min(80vw,24rem)] lg:sticky lg:top-28 lg:col-span-5 lg:mx-0 lg:w-full lg:self-start"
        >
          <Circuito className="absolute -left-[8%] top-[4%] w-[116%]" />
          <span className="voz-carrera absolute right-0 top-0 block text-[clamp(5rem,15vw,10rem)] leading-none text-transparent [-webkit-text-stroke:2px_var(--c-acento-asfalto)] [writing-mode:vertical-rl]">
            96
          </span>
          <Image
            src="/retrato.webp"
            alt=""
            width={887}
            height={862}
            sizes="(max-width: 1024px) 80vw, 36vw"
            className="silueta retrato-fundido relative mt-[14%] h-auto w-[84%]"
          />
        </div>

        <div className="lg:col-span-7">
          <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-acentoasfalto" aria-hidden="true">
            {t.v2.fichaFirma}
          </p>
          <h2 id="sobre-mi-titulo" className="voz-carrera mt-1 text-t1">
            {t.sobreMi.titulo}
          </h2>

          <p data-revelar="" className="mt-10 text-t3 font-light">
            {entrada}
          </p>
          <div className="mt-8 space-y-5">
            {resto.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} data-revelar="" className="text-guia text-atenuadoasfalto">
                {parrafo}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid border-t border-[var(--c-linea)] sm:grid-cols-2">
            {[...t.v2.ficha, { campo: t.sobreMi.idiomas, valor: idiomas }].map((dato) => (
              <div
                key={dato.campo}
                className="flex flex-col gap-1 border-b border-[var(--c-linea)] py-4 sm:pr-6"
              >
                <dt className="micro text-atenuadoasfalto">{dato.campo}</dt>
                <dd className="text-lg font-medium">{dato.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <Tacometro
              valor={proyectos.filter((p) => p.demoUrl).length}
              maximo={10}
              etiqueta={t.v2.tacometro}
            />
          </div>

          <figure data-revelar="" className="mt-16">
            <blockquote className="voz-carrera text-t2">
              <p>
                {cita.antes}
                <span className="underline decoration-[var(--c-acento-vivo)] decoration-[0.12em] underline-offset-[0.12em]">
                  {cita.resaltado}
                </span>
                {cita.despues}
              </p>
            </blockquote>
            <figcaption className="micro mt-5 text-atenuadoasfalto">{cita.pie}</figcaption>
          </figure>
        </div>
      </div>

      <div className="mt-seccion">
        <BordeCuadros abajo />
      </div>
    </section>
  );
}
