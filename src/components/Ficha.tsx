import Image from "next/image";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { idiomasHablados } from "@/data/perfil";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Sobre mí, como el corte verde del reel: césped a sangre, la silueta
 * blanca del retrato y el dorsal gigante girado. El texto va siempre en
 * blanco sobre el césped (5.0:1 en la franja más clara).
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
      className="cesped sobre-cesped relative isolate overflow-hidden py-seccion"
    >
      <div className="lienzo grid gap-y-12 lg:grid-cols-12 lg:gap-x-canal">
        {/* Silueta y dorsal. Decorativos: el dorsal ya está en el
            encabezado y la foto, en la portada. */}
        <div
          aria-hidden="true"
          className="relative mx-auto w-[min(78vw,22rem)] lg:sticky lg:top-28 lg:col-span-5 lg:mx-0 lg:w-full lg:self-start"
        >
          <span className="voz-camiseta absolute right-0 top-0 block text-[clamp(5rem,16vw,11rem)] leading-none text-transparent [-webkit-text-stroke:2px_var(--c-cal)] [writing-mode:vertical-rl]">
            96
          </span>
          <Image
            src="/retrato.webp"
            alt=""
            width={892}
            height={865}
            sizes="(max-width: 1024px) 78vw, 36vw"
            className="silueta retrato-fundido relative mt-[12%] h-auto w-[86%]"
          />
        </div>

        <div className="lg:col-span-7">
          <p className="voz-firma text-[clamp(2.25rem,5vw,3.5rem)] text-sobrecesped" aria-hidden="true">
            {t.cancha.fichaFirma}
          </p>
          <h2
            id="sobre-mi-titulo"
            className="voz-camiseta mt-1 text-t1"
          >
            {t.sobreMi.titulo}
          </h2>

          <p data-revelar="" className="mt-10 text-t3 font-light">
            {entrada}
          </p>
          <div className="mt-8 space-y-5">
            {resto.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} data-revelar="" className="text-guia">
                {parrafo}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid border-t border-[var(--c-cal)] sm:grid-cols-2">
            {[...t.cancha.ficha, { campo: t.sobreMi.idiomas, valor: idiomas }].map(
              (dato) => (
                <div
                  key={dato.campo}
                  className="flex flex-col gap-1 border-b border-[var(--c-cal)] py-4 sm:pr-6"
                >
                  <dt className="micro">{dato.campo}</dt>
                  <dd className="text-lg font-medium">{dato.valor}</dd>
                </div>
              ),
            )}
          </dl>

          <figure data-revelar="" className="mt-16">
            <blockquote className="voz-camiseta text-t2">
              <p>
                {cita.antes}
                <span className="underline decoration-balon decoration-[0.12em] underline-offset-[0.12em]">
                  {cita.resaltado}
                </span>
                {cita.despues}
              </p>
            </blockquote>
            <figcaption className="micro mt-5">{cita.pie}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
