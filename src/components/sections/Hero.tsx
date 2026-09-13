import { Fragment } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { Boton } from "@/components/ui/Boton";
import { BLUR_PERFIL } from "@/lib/blur";
import { cn } from "@/lib/utils";

type Props = { t: Diccionario };

/** El nombre en líneas y palabras, tal como se compone en el titular. */
const NOMBRE = [["Benjamín"], ["Peña", "Díaz"]];

/** Posición de una letra contando desde el principio, para escalonar. */
function indiceLetra(linea: number, palabra: number, letra: number) {
  let previas = 0;
  for (let i = 0; i < linea; i++) previas += NOMBRE[i].join("").length;
  for (let j = 0; j < palabra; j++) previas += NOMBRE[linea][j].length;
  return previas + letra;
}

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
        {/* Capa que mueve el parallax (Movimiento.tsx). Va aparte de la
            imagen porque la imagen ya tiene su propia animación de entrada
            en transform, y dos dueños del mismo transform se pisan. */}
        <div data-parallax-foto className="absolute inset-0">
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
        </div>
        <div aria-hidden="true" className="velo-hero absolute inset-0" />
        {/* La foto tapa el grano fijo del fondo. Sin repetirlo encima, el
            borde del contenedor se veía como un corte: fuera había ruido y
            dentro negro liso. */}
        <div aria-hidden="true" className="textura absolute inset-0" />
      </div>

      <div data-parallax-texto className="lienzo -mt-24 md:mt-0">
        <p className="flex items-center gap-2.5">
          <span aria-hidden="true" className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-acentovivo opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-acentovivo" />
          </span>
          <span className="etiqueta text-texto">{t.hero.disponible}</span>
        </p>

        {/* Cada letra gira en 3D al cargar (ver .letra). Es CSS y no GSAP a
            propósito: GSAP llega en un import diferido, y esperarlo dejaría
            ver el nombre quieto y luego saltar. El nombre para lectores de
            pantalla va entero en un span oculto, porque las letras sueltas
            se leerían deletreadas; es más fiable que un aria-label en un
            encabezado. El apellido en violeta, igual que en el CV. */}
        <h1 id="hero-titulo" className="mt-6 text-gigante text-texto">
          <span className="sr-only">{NOMBRE.flat().join(" ")}</span>
          {NOMBRE.map((palabras, linea) => (
            <span
              key={linea}
              aria-hidden="true"
              className={cn("linea-titular", linea === 1 && "text-acento")}
            >
              {palabras.map((palabra, p) => (
                <Fragment key={palabra}>
                  {p > 0 ? " " : null}
                  <span className="palabra-titular">
                    {Array.from(palabra).map((letra, l) => (
                      <span
                        key={l}
                        className="letra"
                        style={{ "--i": indiceLetra(linea, p, l) } as CSSProperties}
                      >
                        {letra}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
          ))}
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
            {/* El CV va aquí y no copiar el correo: es lo primero que busca
                quien evalúa un perfil, y copiar el correo ya está en Contacto. */}
            <Boton
              href={perfil.cv}
              variante="secundario"
              descargar={perfil.cvArchivo}
              className="w-full sm:w-auto"
            >
              <Download aria-hidden="true" className="size-4" />
              {t.contacto.descargarCV} {t.contacto.cvFormato}
            </Boton>
          </div>
        </div>
      </div>
    </section>
  );
}
