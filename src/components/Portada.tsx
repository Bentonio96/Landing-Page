import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { Paralaje } from "@/components/Paralaje";
import { cn } from "@/lib/utils";

type Props = { idioma: Idioma; t: Diccionario };

type Dato = {
  texto: string;
  /** Lado de la portada: el borde interior del texto queda en x (%). */
  lado: "izq" | "der";
  x: number;
  y: number;
  /** Si lleva hilo hasta el retrato. */
  hilo?: boolean;
};

/** Hacia dónde van los hilos: detrás de la cara del retrato. */
const CENTRO = { x: 50, y: 34 };

/**
 * La nube de microtexto del reel, con datos reales (proyectos, fechas,
 * cifras medidas, coordenadas) y unida al retrato por hilos finos, como
 * la telemetría de un auto. Es decorativa: todo esto está dicho más abajo
 * con su contexto, así que va oculta a lectores de pantalla.
 */
function nube(idioma: Idioma): Dato[] {
  const en = idioma === "en";
  const conDemo = proyectos.filter((p) => p.demoUrl).slice(0, 5);
  return [
    { texto: "33.45° S — 70.60° W", lado: "izq", x: 26, y: 8, hilo: true },
    { texto: "Ñuñoa, Santiago, Chile", lado: "izq", x: 26, y: 11.5 },
    { texto: "React 19 · TypeScript · Next.js", lado: "izq", x: 31, y: 24, hilo: true },
    { texto: "Tailwind CSS · GSAP · WebGL2", lado: "izq", x: 31, y: 27.5 },
    { texto: "Power BI · Power Query · Python", lado: "izq", x: 24, y: 41, hilo: true },
    { texto: en ? "UNAB — graduating Nov 2026" : "UNAB — egreso nov 2026", lado: "izq", x: 30, y: 54, hilo: true },
    { texto: "Lighthouse 100 / axe 0", lado: "der", x: 72, y: 8, hilo: true },
    ...conDemo.map((p, i): Dato => ({
      texto: `P${i + 1} ${p.nombre} — ${p.fecha?.[idioma] ?? ""}`,
      lado: "der",
      x: 69,
      y: 21 + i * 3.5,
      hilo: i === 0,
    })),
    { texto: "CMPC — 2025 / 2026", lado: "der", x: 74, y: 46, hilo: true },
    { texto: en ? "Spanish · English" : "Español · Inglés", lado: "der", x: 70, y: 56, hilo: true },
  ];
}

export function Portada({ idioma, t }: Props) {
  const datos = nube(idioma);

  return (
    <section
      id="inicio"
      aria-labelledby="portada-titulo"
      className="relative isolate overflow-hidden"
    >
      <Paralaje className="relative">
        {/* Nube de datos con sus hilos, solo en escritorio. En un
            teléfono quedan dos líneas en las esquinas. */}
        <div
          aria-hidden="true"
          data-profundidad="0.5"
          className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        >
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {datos
              .filter((d) => d.hilo)
              .map((d) => (
                <line
                  key={d.texto}
                  x1={d.lado === "izq" ? d.x + 0.6 : d.x - 0.6}
                  y1={d.y + 0.9}
                  x2={CENTRO.x}
                  y2={CENTRO.y}
                  stroke="var(--c-regla-fuerte)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
          </svg>
          {datos.map((d) => (
            <p
              key={d.texto}
              className="micro absolute flex items-center gap-2 whitespace-nowrap text-tenue"
              style={
                d.lado === "izq"
                  ? { right: `${100 - d.x}%`, top: `${d.y}%` }
                  : { left: `${d.x}%`, top: `${d.y}%`, flexDirection: "row-reverse" }
              }
            >
              {d.texto}
              <span className={cn("size-1.5 shrink-0 rounded-full", d.hilo ? "bg-acento" : "bg-transparent")} />
            </p>
          ))}
        </div>
        <div aria-hidden="true" className="lienzo pointer-events-none absolute inset-x-0 top-3 flex justify-between lg:hidden">
          <p className="micro text-tenue">33.45° S — 70.60° W</p>
          <p className="micro text-tenue">Lighthouse 100 / axe 0</p>
        </div>

        <div className="lienzo flex flex-col items-center pt-16 sm:pt-12">
          {/* El retrato, recortado y en grises, se funde con el fondo por
              abajo. Encima, el nombre en dos voces. */}
          <div
            data-profundidad="-0.25"
            className="relative w-[min(88vw,30rem)] lg:w-[min(40vw,34rem)]"
          >
            <Image
              src="/retrato.webp"
              alt={t.hero.altFoto}
              width={887}
              height={862}
              priority
              sizes="(max-width: 1024px) 88vw, 34rem"
              className="retrato-fundido entra-retrato h-auto w-full"
            />
          </div>

          <h1
            id="portada-titulo"
            className="relative z-10 -mt-[18vw] flex flex-col items-center text-center sm:-mt-[11rem] lg:-mt-[12rem]"
          >
            <span
              className="voz-firma entra-firma block -rotate-6 text-[clamp(3.25rem,13vw,7.5rem)] text-acento -mb-[0.32em] self-start pl-[4vw] sm:pl-0 sm:-ml-[4em]"
              style={{ "--retardo": "0.55s" } as CSSProperties}
            >
              {t.v2.firma}
            </span>{" "}
            <span className="mascara-linea">
              <span
                className="voz-carrera entra-linea block text-[clamp(3.5rem,21vw,11rem)] leading-[0.86]"
                style={{ "--retardo": "0.35s" } as CSSProperties}
              >
                {t.v2.apellido}
              </span>
            </span>
            <span className="sr-only"> Díaz</span>
          </h1>
        </div>
      </Paralaje>

      <div className="lienzo mt-10 grid gap-8 pb-14 md:grid-cols-2 md:gap-x-canal lg:mt-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          {/* En escritorio la disponibilidad va en el encabezado. */}
          <p className="micro mb-4 flex items-center gap-2 text-tinta md:hidden">
            <span aria-hidden="true" className="bg-senal inline-block size-2.5 shrink-0 rounded-full" />
            {t.hero.disponible}
          </p>
          <p className="etiqueta text-tinta">{t.hero.rol}</p>
          <p className="etiqueta mt-1.5 text-tenue">{t.hero.herramientas}</p>
        </div>

        <p className="text-guia text-atenuado lg:col-span-5">{t.hero.intro}</p>

        <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 lg:col-span-3 lg:flex-col lg:items-end">
          <a
            href="#proyectos"
            className="boton-pista etiqueta inline-flex items-center justify-center gap-2 border border-tinta bg-tinta px-5 py-3.5 text-fondo"
          >
            {t.hero.verProyectos}
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
          <a
            href={perfil.cv}
            download={perfil.cvArchivo}
            className="boton-pista etiqueta inline-flex items-center justify-center gap-2 border border-reglafuerte px-5 py-3.5 text-tinta"
          >
            <Download aria-hidden="true" className="size-4" />
            {t.contacto.descargarCV} {t.contacto.cvFormato}
          </a>
        </div>
      </div>
    </section>
  );
}
