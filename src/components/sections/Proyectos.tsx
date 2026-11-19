import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Idioma, Proyecto } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { perfil } from "@/data/perfil";
import { BLUR_PROYECTOS } from "@/lib/blur-proyectos";
import { EncabezadoSeccion } from "@/components/ui/Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Carpetas como las del reel: hojas oscuras que asoman, una tapa de vidrio
 * esmerilado con el nombre y una flecha. Al apuntar o llevar el foco adentro,
 * las hojas salen en abanico. Debajo: una bajada corta y el enlace.
 */
export function Proyectos({ idioma, t }: Props) {
  return (
    <section id="proyectos" aria-labelledby="proyectos-titulo" className="lienzo py-seccion">
      <EncabezadoSeccion
        id="proyectos-titulo"
        titulo={t.proyectos.titulo}
        bajada={t.proyectos.bajada}
        bajadaAbajo
        figura="proyectos"
        extra={
          <a
            href={perfil.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-medium"
          >
            <span className="enlace">{t.proyectos.github}</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only">{t.proyectos.enlaceExterno}</span>
          </a>
        }
      />
      <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div aria-hidden="true" className="carpeta__hoja carpeta__hoja--2">
          <div className="hoja-renglones">
            <span style={{ width: "45%" }} />
            <span />
            <span style={{ width: "80%" }} />
          </div>
        </div>
        <div aria-hidden="true" className="carpeta__hoja carpeta__hoja--1">
          <div className="hoja-renglones">
            <span style={{ width: "60%" }} />
            <span style={{ width: "90%" }} />
          </div>
        </div>
        <div className="carpeta__hoja carpeta__hoja--0">
          {p.imagen ? (
            <Image
              src={p.imagen}
              alt={`${t.proyectos.captura} ${p.nombre}`}
              fill
              placeholder={BLUR_PROYECTOS[p.slug] ? "blur" : "empty"}
              blurDataURL={BLUR_PROYECTOS[p.slug]}
              sizes="(max-width: 640px) 86vw, (max-width: 1280px) 30vw, 20rem"
              className="object-cover object-top"
            />
          ) : (
            <div aria-hidden="true" className="hoja-renglones">
              <span style={{ width: "55%" }} />
              <span />
              <span style={{ width: "88%" }} />
              <span style={{ width: "70%" }} />
            </div>
          )}
        </div>
        <div className="carpeta__frente">
          <FileText aria-hidden="true" className="size-3.5 text-atenuado" />
          <div className="flex items-end justify-between gap-3">
            <h3 id={`p-${p.slug}`} className="text-t3 font-semibold leading-tight tracking-[-0.02em]">
              {p.nombre}
            </h3>
            {principal ? (
              <a
                href={principal}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.demoUrl ? t.proyectos.verSitio : t.proyectos.verCodigo}: ${p.nombre} ${t.proyectos.enlaceExterno}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-texto text-fondo transition-opacity hover:opacity-85"
              >
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 text-mini">
        <p className="text-atenuado">{p.resumen?.[idioma] ?? p.fecha?.[idioma]}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
          {p.demoUrl ? (
            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
              <span className="enlace">{t.proyectos.verProyecto}</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">
                {p.nombre} {t.proyectos.enlaceExterno}
              </span>
            </a>
          ) : null}
          {p.repoUrl ? (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
              <span className="enlace">{t.proyectos.verCodigo}</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">
                {p.nombre} {t.proyectos.enlaceExterno}
              </span>
            </a>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-mini text-tenue">
        {p.descripcion[idioma]}
      </p>
    </article>
  );
}
