import Image from "next/image";
import { ArrowDown, Mail } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { enlaceCorreo } from "@/lib/utils";
import { Boton } from "@/components/ui/Boton";
import { BLUR_PERFIL } from "@/lib/blur";

type Props = { t: Diccionario };

export function Hero({ t }: Props) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden pt-28 pb-seccion sm:pt-36"
    >
      <div className="lienzo">
        <div className="grid items-center gap-x-canal gap-y-12 md:grid-cols-12">
          {/* Texto */}
          <div className="md:col-span-7 lg:col-span-6">
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="relative flex size-2 shrink-0"
              >
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-acento opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-acento" />
              </span>
              <span className="etiqueta text-acento">{t.hero.disponible}</span>
            </p>

            <h1
              id="hero-titulo"
              className="mt-6 text-t1 font-normal tracking-[-0.03em]"
            >
              Benjamín
              <br />
              Peña Díaz
            </h1>

            <p className="etiqueta mt-6 text-texto">{t.hero.rol}</p>

            <p className="mt-6 max-w-medida text-guia text-atenuado">
              {t.hero.intro}
            </p>

            {/* Apilados a ancho completo en móvil: la altura no depende de
                cuánto mida el texto, así que no hay salto de layout cuando
                carga la tipografía. Desde sm vuelven a fila. */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton
                href="#proyectos"
                variante="primario"
                className="w-full sm:w-auto"
              >
                {t.hero.verProyectos}
                <ArrowDown aria-hidden="true" className="size-4" />
              </Boton>
              <Boton
                href={enlaceCorreo(
                  perfil.email,
                  t.contacto.asuntoCorreo,
                  t.contacto.cuerpoCorreo,
                )}
                variante="secundario"
                className="w-full sm:w-auto"
              >
                <Mail aria-hidden="true" className="size-4" />
                {t.hero.escribirme}
              </Boton>
            </div>
          </div>

          {/* Foto: bloque editorial con marco de acento desplazado detrás */}
          <div className="md:col-span-5 lg:col-span-6 lg:pl-8">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 border border-acento/35 sm:translate-x-4 sm:translate-y-4"
              />
              <div className="relative aspect-[4/3] overflow-hidden bg-elevado sm:aspect-[4/5]">
                <Image
                  src="/benjamin-pena.jpg"
                  alt={t.hero.altFoto}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR_PERFIL}
                  sizes="(max-width: 768px) 92vw, (max-width: 1024px) 42vw, 46vw"
                  className="object-cover object-[center_38%] sm:object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
