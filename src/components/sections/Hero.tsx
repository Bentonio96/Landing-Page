import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { Boton } from "@/components/ui/Boton";
import { BotonCorreo } from "@/components/ui/BotonCorreo";
import { BLUR_PERFIL } from "@/lib/blur";

type Props = { t: Diccionario };

export function Hero({ t }: Props) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative isolate flex flex-col overflow-hidden pb-14 sm:pb-20 md:min-h-svh md:justify-end md:pt-28"
    >
      {/* Foto a sangre. En móvil es un bloque en el flujo y el texto sube
          solo sobre su borde inferior: montado encima de toda la foto, como
          en escritorio, el nombre le tapaba la cara. Desde md se va a la
          derecha y el nombre entra sobre el lado que no tiene rostro.
          Los velos (ver .velo-hero) la funden con el fondo en ambos temas. */}
      <div className="relative -z-10 h-[62svh] max-h-[36rem] w-full overflow-hidden md:absolute md:inset-y-0 md:right-0 md:h-auto md:max-h-none md:w-[74%] lg:w-[70%]">
        <Image
          src="/benjamin-pena.jpg"
          alt={t.hero.altFoto}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_PERFIL}
          sizes="(max-width: 768px) 100vw, 74vw"
          className="foto-hero object-cover object-[52%_28%] md:object-[58%_30%]"
        />
        <div aria-hidden="true" className="velo-hero absolute inset-0" />
        {/* La foto tapa el grano fijo del fondo. Sin repetirlo encima, el
            borde del contenedor se veía como un corte: fuera había ruido y
            dentro negro liso. */}
        <div aria-hidden="true" className="textura absolute inset-0" />
      </div>

      <div className="lienzo -mt-24 md:mt-0">
        <p className="flex items-center gap-2.5">
          <span aria-hidden="true" className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-acento opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-acento" />
          </span>
          <span className="etiqueta text-texto">{t.hero.disponible}</span>
        </p>

        {/* Cada línea sube desde su propia máscara al cargar. Solo se anima
            el desplazamiento: el texto nunca pasa por transparente. */}
        <h1 id="hero-titulo" className="mt-6 text-gigante text-texto">
          <span className="linea-titular">
            <span>Benjamín</span>
          </span>
          <span className="linea-titular">
            <span>Peña Díaz</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end md:gap-x-canal">
          <div className="md:col-span-6 lg:col-span-5">
            {/* Titular de rol en dos mitades, como en LinkedIn: quién soy y
                con qué trabajo. El tracking baja de 0.14em a 0.09em solo
                aquí: son las dos líneas de versales más largas de la página
                y con el valor por defecto quedaban muy justas en móvil. */}
            <p className="etiqueta tracking-[0.09em] text-texto">
              <span className="block">{t.hero.rol}</span>
              <span className="mt-1.5 block text-atenuado">
                {t.hero.herramientas}
              </span>
            </p>

            <p className="mt-6 max-w-[34rem] text-guia text-atenuado">
              {t.hero.intro}
            </p>
          </div>

          {/* Apilados a ancho completo en móvil: la altura no depende de
              cuánto mida el texto, así que no hay salto de layout cuando
              carga la tipografía. Desde sm vuelven a fila. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-6 md:justify-end lg:col-span-7">
            <Boton
              href="#proyectos"
              variante="primario"
              className="w-full sm:w-auto"
            >
              {t.hero.verProyectos}
              <ArrowDown aria-hidden="true" className="size-4" />
            </Boton>
            <BotonCorreo
              email={perfil.email}
              texto={t.hero.escribirme}
              avisoCopiado={t.contacto.correoCopiado}
              avisoFallo={t.contacto.correoFallo}
              variante="secundario"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
