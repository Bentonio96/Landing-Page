import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Idioma, Proyecto } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { perfil } from "@/data/perfil";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { EncabezadoSeccion } from "@/components/ui/Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Cada proyecto es una carpeta, como en el reel: la captura del sitio es la
 * hoja que asoma y sale al apuntar o al llevar el foco adentro. Debajo va
 * todo el texto, completo: la carpeta es la imagen, no el contenedor.
 */
export function Proyectos({ idioma, t }: Props) {
  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="lienzo py-seccion">
      <EncabezadoSeccion
        id="proyectos-titulo"
        titulo={t.proyectos.titulo}
        bajada={t.proyectos.bajada}
        extra={
          <a
            href={perfil.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-semibold text-texto"
          >
            <span className="enlace">{t.proyectos.github}</span>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{t.proyectos.enlaceExterno}</span>
          </a>
        }
      />
      <ul className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {proyectos.map((p) => (
          <li key={p.slug}>
            <TarjetaProyecto proyecto={p} idioma={idioma} t={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TarjetaProyecto({ proyecto: p, idioma, t }: { proyecto: Proyecto; idioma: Idioma; t: Diccionario }) {
  const principal = p.demoUrl ?? p.repoUrl;
  return (
    <article className="tarjeta-proyecto" aria-labelledby={`p-${p.slug}`}>
      <div className="carpeta">
        <div aria-hidden="true" className="carpeta__fondo" />
        <div aria-hidden="true" className="carpeta__hoja carpeta__hoja--atras" />
        <div className="carpeta__hoja">
          {p.imagen ? (
            <Image
              src={p.imagen}
              alt={`${t.proyectos.captura} ${p.nombre}`}
              fill
              placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
              blurDataURL={BLUR_PROYECTOS[p.slug]}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, 26rem"
              className="object-cover object-top"
            />
          ) : (
            <div aria-hidden="true" className="hoja-renglones">
              <span style={{ width: "55%" }} />
              <span />
              <span style={{ width: "88%" }} />
              <span style={{ width: "70%" }} />
              <span style={{ width: "92%" }} />
              <span style={{ width: "40%" }} />
            </div>
          )}
        </div>
        <div className="carpeta__frente">
          <h3 id={`p-${p.slug}`} className="ancho text-t3 font-bold leading-tight">
            {p.nombre}
          </h3>
          {principal ? (
            <a
              href={principal}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.demoUrl ? t.proyectos.verSitio : t.proyectos.verCodigo}: ${p.nombre} ${t.proyectos.enlaceExterno}`}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-texto text-fondo transition-colors hover:bg-acento hover:text-acentosobre"
            >
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        {p.fecha ? <p className="mono text-[0.75rem] text-tenue">{p.fecha[idioma]}</p> : null}
        <p className="mt-2 text-base text-atenuado">{p.descripcion[idioma]}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={p.nombre}>
          {p.tecnologias.map((x) => (
            <li key={x} className="chip min-h-0 px-2 py-0.5 text-[0.75rem]">
              {x}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-menor font-semibold">
          {p.demoUrl ? (
            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
              <span className="enlace">{t.proyectos.verSitio}</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">
                {p.nombre} {t.proyectos.enlaceExterno}
              </span>
            </a>
          ) : null}
          {p.repoUrl ? (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
              <Github aria-hidden="true" className="size-3.5" />
              <span className="enlace">{t.proyectos.verCodigo}</span>
              <span className="sr-only">
                {p.nombre} {t.proyectos.enlaceExterno}
              </span>
            </a>
          ) : null}
          {!p.demoUrl && !p.repoUrl ? <p className="font-normal text-tenue">{t.proyectos.interno}</p> : null}
        </div>
      </div>
    </article>
  );
}
