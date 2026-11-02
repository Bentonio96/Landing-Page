import Image from "next/image";
import { ArrowDown, Download, Radio as IconoRadio } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { BotonRadio } from "@/components/BotonRadio";
import { LineaRadio } from "@/components/LineaRadio";
import { TableroLed } from "@/components/TableroLed";

type Props = { t: Diccionario };

/**
 * La parrilla de salida. El nombre es un tablero de LED que se enciende y
 * se calienta con el puntero; al lado, la ficha del piloto con la foto en
 * una mira de cámara a bordo. ÁPEX abre la radio con la primera línea.
 */
export function Parrilla({ t }: Props) {
  return (
    <section
      id="parrilla"
      aria-labelledby="parrilla-titulo"
      data-estela
      className="relative px-4 pb-16 pt-24 md:px-8 md:pt-28 lg:min-h-[100svh]"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-14">
        <div data-parallax-texto className="min-w-0">
          <p className="mono-etiqueta flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-linea pb-3 text-atenuado">
            <span>{t.hero.piloto}</span>
            <span aria-hidden="true" className="tnum">
              33.4569° S · 70.5976° W
            </span>
          </p>

          <h1 id="parrilla-titulo" className="mt-6 max-w-[880px] focus:outline-none">
            <TableroLed lineas={["BENJAMÍN", "PEÑA"]}>
              <span>Benjamín</span>
              <span>Peña</span>
            </TableroLed>
          </h1>

          <p className="titular mt-7 text-t3">{t.hero.rol}</p>
          <p className="mt-4 max-w-[60ch] text-guia text-atenuado">{t.hero.intro}</p>

          <div className="mt-6 max-w-[60ch] border-y border-linea py-3">
            <LineaRadio autor={t.radio.apex} texto={t.hero.radio} />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <BotonRadio className="barrido inline-flex h-12 items-center gap-2.5 border border-tinta bg-tinta px-5 font-mono text-etiqueta uppercase tracking-[0.12em] text-papel [--barrido:var(--c-morado)] hover:border-morado hover:text-sobremorado">
              <IconoRadio aria-hidden="true" className="size-4" />
              {t.hero.hablar}
              <kbd aria-hidden="true" className="ml-1 hidden border border-current px-1.5 py-0.5 text-[0.6875rem] opacity-80 [@media(pointer:fine)]:inline">
                /
              </kbd>
            </BotonRadio>
            <a
              href="#garage"
              className="barrido inline-flex h-12 items-center gap-2.5 border border-tinta px-5 font-mono text-etiqueta uppercase tracking-[0.12em] [--barrido:var(--c-tinta)] hover:text-papel"
            >
              {t.hero.verProyectos}
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
            <a
              href={perfil.cv}
              download={perfil.cvArchivo}
              className="inline-flex h-12 items-center gap-2.5 px-2 font-mono text-etiqueta uppercase tracking-[0.12em] underline decoration-linea-fuerte underline-offset-4 hover:text-morado"
            >
              <Download aria-hidden="true" className="size-4" />
              {t.box.descargarCV}
              <span className="sr-only">{t.box.cvFormato}</span>
            </a>
          </div>
        </div>

        <aside aria-label={t.hero.piloto} data-parallax-foto className="min-w-0 lg:pt-10">
          <figure className="mira mx-auto max-w-[380px]">
            <div className="relative aspect-[4/5] overflow-hidden bg-panel">
              <Image
                src="/benjamin-pena.jpg"
                alt={t.hero.altFoto}
                fill
                priority
                sizes="(min-width: 1024px) 380px, (min-width: 480px) 380px, calc(100vw - 32px)"
                className="object-cover object-center grayscale"
              />
              {/* Cuadro de seguimiento sobre la cara, como una cámara a bordo. */}
              <span
                aria-hidden="true"
                className="seguimiento absolute left-[31%] top-[27%] h-[34%] w-[34%] border border-[#fff]/80"
              >
                <span className="absolute -top-5 left-0 bg-[#0c0e0f] px-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#f2f1ea]">
                  #29 · lock
                </span>
              </span>
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 flex items-center gap-2 bg-[#0c0e0f] px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[#f2f1ea]"
              >
                <span className="pulso text-[#ff4d4d]" /> Cam 01 · onboard
              </span>
            </div>
          </figure>

          <dl className="mx-auto mt-6 grid max-w-[380px] grid-cols-2 border-l border-t border-linea">
            {t.hero.ficha.map((f) => (
              <div key={f.etiqueta} className="border-b border-r border-linea px-3 py-2.5">
                <dt className="mono-etiqueta text-tenue">{f.etiqueta}</dt>
                <dd className="mt-1 flex items-center gap-2 text-[0.9375rem] font-medium">
                  {"vivo" in f && f.vivo && (
                    <span className="text-senal">
                      <span className="pulso" aria-hidden="true" />
                    </span>
                  )}
                  {f.valor}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
