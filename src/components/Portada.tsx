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
  /** Posición en escritorio, en % del área de la portada. */
  sitio: string;
  profundidad: number;
  /** Los que también caben en un teléfono. */
  movil?: boolean;
};

/**
 * La nube de microtexto del reel, con datos reales: proyectos, fechas,
 * cifras medidas y coordenadas. Es decorativa (todo esto está dicho más
 * abajo con su contexto), así que va oculta a lectores de pantalla.
 */
function nube(idioma: Idioma): Dato[] {
  const en = idioma === "en";
  const conDemo = proyectos.filter((p) => p.demoUrl);
  return [
    { texto: "33.45° S — 70.60° W", sitio: "left-[3%] top-[6%]", profundidad: 0.6, movil: true },
    { texto: en ? "Ñuñoa, Santiago, Chile" : "Ñuñoa, Santiago, Chile", sitio: "left-[3%] top-[10%]", profundidad: 0.6 },
    { texto: "React 19 · TypeScript · Next.js", sitio: "left-[8%] top-[24%]", profundidad: -0.8 },
    { texto: "Tailwind CSS · GSAP · WebGL2", sitio: "left-[8%] top-[28%]", profundidad: -0.8 },
    { texto: "Power BI · Power Query · Python", sitio: "left-[14%] top-[40%]", profundidad: 0.4 },
    { texto: "Lighthouse 100 / axe 0", sitio: "right-[4%] top-[6%]", profundidad: -0.5, movil: true },
    ...conDemo.slice(0, 5).map((p, i) => ({
      texto: `${String(i + 1).padStart(2, "0")} ${p.nombre} — ${p.fecha?.[idioma] ?? ""}`,
      sitio: ["right-[10%] top-[22%]", "right-[10%] top-[25.5%]", "right-[10%] top-[29%]", "right-[10%] top-[32.5%]", "right-[10%] top-[36%]"][i],
      profundidad: 0.9,
    })),
    { texto: en ? "CMPC — 2025 / 2026" : "CMPC — 2025 / 2026", sitio: "right-[18%] top-[48%]", profundidad: -0.4 },
    { texto: en ? "UNAB — graduating Nov 2026" : "UNAB — egreso nov 2026", sitio: "left-[18%] top-[52%]", profundidad: 0.7 },
    { texto: en ? "Spanish · English" : "Español · Inglés", sitio: "right-[6%] top-[58%]", profundidad: 0.3 },
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
        {/* Nube de datos. En escritorio se reparte por los costados; en
            un teléfono solo quedan dos líneas en las esquinas. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {datos.map((d) => (
            <p
              key={d.texto}
              data-profundidad={d.profundidad}
              className={cn(
                "micro absolute whitespace-nowrap text-tenue",
                d.sitio,
                d.movil ? "block" : "hidden lg:block",
              )}
            >
              {d.texto}
            </p>
          ))}
        </div>

        <div className="lienzo flex flex-col items-center pt-16 sm:pt-12">
          {/* El retrato, recortado y en grises, se funde con el papel por
              abajo. Encima, el nombre en dos voces. */}
          <div
            data-profundidad="-0.25"
            className="relative w-[min(88vw,30rem)] lg:w-[min(40vw,34rem)]"
          >
            <Image
              src="/retrato.webp"
              alt={t.hero.altFoto}
              width={892}
              height={865}
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
              {t.cancha.firma}
            </span>{" "}
            <span className="mascara-linea">
              <span
                className="voz-camiseta entra-linea block text-[clamp(3.5rem,21vw,11rem)] leading-[0.86]"
                style={{ "--retardo": "0.35s" } as CSSProperties}
              >
                {t.cancha.apellido}
              </span>
            </span>
            <span className="sr-only"> Díaz</span>
          </h1>
        </div>
      </Paralaje>

      <div className="lienzo mt-10 grid gap-8 pb-14 md:grid-cols-12 md:items-end md:gap-x-canal lg:mt-12">
        <div className="md:col-span-4">
          {/* En escritorio la disponibilidad va en el encabezado. */}
          <p className="micro mb-4 flex items-center gap-2 text-tinta md:hidden">
            <span aria-hidden="true" className="balon inline-block size-2.5 shrink-0 rounded-full" />
            {t.hero.disponible}
          </p>
          <p className="etiqueta text-tinta">{t.hero.rol}</p>
          <p className="etiqueta mt-1.5 text-tenue">{t.hero.herramientas}</p>
        </div>

        <p className="text-guia text-atenuado md:col-span-5">{t.hero.intro}</p>

        <div className="flex flex-col gap-3 md:col-span-3 md:items-end">
          <a
            href="#proyectos"
            className="boton-cancha etiqueta inline-flex items-center justify-center gap-2 border border-tinta bg-tinta px-5 py-3.5 text-papel"
          >
            {t.hero.verProyectos}
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
          <a
            href={perfil.cv}
            download={perfil.cvArchivo}
            className="boton-cancha etiqueta inline-flex items-center justify-center gap-2 border border-reglafuerte px-5 py-3.5 text-tinta"
          >
            <Download aria-hidden="true" className="size-4" />
            {t.contacto.descargarCV} {t.contacto.cvFormato}
          </a>
        </div>
      </div>
    </section>
  );
}
