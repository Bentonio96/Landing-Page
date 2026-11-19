import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
import { BLUR_PERFIL } from "@/lib/blur";
import { Negritas } from "@/components/ui/Negritas";

type Props = { t: Diccionario };

/**
 * El código tenue del fondo sale del propio contenido del sitio: el perfil,
 * los proyectos y el stack, escritos como TypeScript. Es decorativo (oculto a
 * lectores) y se repite dos veces para que el bucle de la animación no salte.
 */
function lineasDeCodigo(rol: string): string[] {
  const lineas = [
    "export const perfil = {",
    `  nombre: "${perfil.nombre}",`,
    `  rol: "${rol}",`,
    `  ubicacion: "${perfil.ubicacion}",`,
    `  github: "${perfil.githubUsuario}",`,
    `  disponible: "freelance",`,
    "} as const;",
    "",
  ];
  for (const p of proyectos) {
    lineas.push(`deploy({ slug: "${p.slug}", stack: [${p.tecnologias.map((x) => `"${x}"`).join(", ")}] });`);
  }
  lineas.push("");
  for (const c of stack) {
    lineas.push(`stack.${c.id} = [${c.items.slice(0, 6).map((i) => `"${i.nombre}"`).join(", ")}];`);
  }
  lineas.push("", "git commit -m \"feat: build the whole city\"", "npm run build && vercel --prod", "");
  return lineas;
}

/** Letras del titular, con su índice para escalonar la entrada. */
function Letras({ palabra, desde }: { palabra: string; desde: number }) {
  return (
    <>
      {[...palabra].map((letra, i) => (
        <span key={i} className="letra" style={{ ["--i" as string]: desde + i }}>
          {letra}
        </span>
      ))}
    </>
  );
}

export function Escenario({ t }: Props) {
  const codigo = lineasDeCodigo(t.hero.rol);
  const [primera, segunda] = t.hero.rol.toUpperCase().split(" ");

  return (
    <section id="inicio" aria-labelledby="titular" className="escenario" data-progreso="fijo">
      <div className="escenario__fijo">
        <div aria-hidden="true" className="codigo-fondo">
          <div className="codigo-fondo__pista lienzo">
            {[0, 1].map((copia) => (
              <div key={copia} className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
                {[0, 1].map((col) => (
                  <div key={col} className={col === 1 ? "hidden overflow-hidden lg:block" : "overflow-hidden"}>
                    {(col === 0 ? codigo : [...codigo].reverse()).map((l, i) => (
                      <div key={i}>{l || " "}</div>
                    ))}
                    {codigo.map((l, i) => (
                      <div key={`b${i}`}>{l || " "}</div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="escenario__hero lienzo">
          <p className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-borde bg-superficie/70 px-3.5 py-1.5 text-menor text-atenuado">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-acentovivo opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-acentovivo" />
            </span>
            {t.hero.disponible}
          </p>

          <h1 id="titular" className="titular mt-6 sm:mt-8">
            <span className="sr-only">
              {perfil.nombre}, {t.hero.rol}
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap md:pr-[0.9em]">
              <span className="corchete mr-[0.12em]" style={{ ["--i" as string]: 0, ["--lado" as string]: -1 }}>
                &lt;
              </span>
              <Letras palabra={primera} desde={1} />
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap md:pl-[0.9em]">
              <Letras palabra={segunda ?? ""} desde={primera.length + 1} />
              <span
                className="corchete ml-[0.12em]"
                style={{ ["--i" as string]: primera.length + (segunda?.length ?? 0) + 1, ["--lado" as string]: 1 }}
              >
                /&gt;
              </span>
            </span>
          </h1>
        </div>

        <figure className="escenario__foto">
          <Image
            src="/benjamin-pena.jpg"
            alt={t.hero.altFoto}
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR_PERFIL}
            sizes="(max-width: 768px) 62vw, 24rem"
            className="object-cover object-[52%_28%] grayscale"
          />
        </figure>

        <div className="escenario__pie lienzo mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 md:mt-0">
          <p className="ancho text-t3 font-bold">©2026</p>
          <p className="mono text-menor font-medium">
            <span aria-hidden="true" className="text-tenue">{"{{ "}</span>/{t.hero.etiqueta}
            <span aria-hidden="true" className="text-tenue">{" }}"}</span>
          </p>
        </div>

        <div id="sobre-mi" className="escenario__sobre lienzo grid gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="sobre__izq">
            <h2 className="ancho text-[clamp(2.5rem,1.6rem+3.4vw,4.5rem)] font-bold leading-[0.98]">
              {t.hero.saludo}
            </h2>
            <p className="mt-5 max-w-[22ch] text-t3 font-semibold">{t.hero.subtitulo}</p>
            <div className="mt-6 max-w-sm border-t border-bordefuerte pt-4 text-menor">
              <p className="text-tenue">{t.hero.actualmente}</p>
              <p className="mt-1 font-semibold">{t.hero.actual}</p>
              <p className="text-atenuado">{t.hero.actualDetalle}</p>
            </div>
          </div>
          <div className="sobre__der">
            <p className="max-w-[34ch] text-guia text-atenuado">
              <Negritas texto={t.hero.intro} />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#proyectos" className="boton boton--lleno">
                {t.hero.verProyectos}
                <ArrowUpRight aria-hidden="true" className="flecha size-4" />
              </a>
              <a href={perfil.cv} download={perfil.cvArchivo} className="boton">
                <Download aria-hidden="true" className="size-4" />
                {t.hero.descargarCV}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
