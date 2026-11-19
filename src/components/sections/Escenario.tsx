import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
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
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3ecf6e] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[#3ecf6e]" />
            </span>
            {t.hero.disponible}
          </p>

          <h1 id="titular" className="titular mt-6 sm:mt-8">
            <span className="sr-only">
              {perfil.nombre}, {t.hero.rol}
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap md:pr-[0.8em]">
              <span className="corchete mr-[0.12em]" style={{ ["--i" as string]: 0, ["--lado" as string]: -1 }}>
                &lt;
              </span>
              <Letras palabra={primera} desde={1} />
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap md:pl-[0.8em]">
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
          {/* Retrato recortado con BiRefNet (sin el cerro de fondo), sobre un
              fondo claro como el del reel. */}
          <Image
            src="/retrato.webp"
            alt={t.hero.altFoto}
            fill
            priority
            sizes="(max-width: 768px) 62vw, 24rem"
            className="object-contain object-bottom grayscale"
          />
        </figure>

        <div className="escenario__pie lienzo mt-8 lg:!pr-[calc(var(--spacing-canal)+8rem)] flex flex-wrap items-end justify-between gap-x-6 gap-y-2 md:mt-0">
          <p className="text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] font-semibold tracking-[-0.03em]">©2026</p>
          <p className="text-mini font-medium uppercase tracking-[0.02em]">
            <span aria-hidden="true">{"{{ "}</span>/{t.hero.etiqueta}
            <span aria-hidden="true">{" }}"}</span>
          </p>
        </div>

        <div id="sobre-mi" className="escenario__sobre lienzo grid gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="sobre__izq">
            <h2 className="text-[clamp(2.75rem,1.7rem+3.6vw,5rem)] font-semibold leading-[1] tracking-[-0.035em]">
              {t.hero.saludo}
            </h2>
            <p className="mt-6 max-w-[16ch] text-t3 font-semibold leading-tight">{t.hero.subtitulo}</p>
            <div className="mt-7 max-w-xs border-t border-bordefuerte pt-4 text-menor">
              <p className="text-mini text-tenue">{t.hero.actualmente}</p>
              <p className="mt-2 font-semibold">{t.hero.actual}</p>
              <p className="text-atenuado">{t.hero.actualRol}</p>
              <p className="text-tenue">{t.hero.actualDetalle}</p>
            </div>
          </div>
          <div className="sobre__der">
            <p className="max-w-[24ch] text-guia text-atenuado">
              <Negritas texto={t.hero.intro} />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#proyectos" className="boton">
                {t.hero.verProyectos}
                <ArrowUpRight aria-hidden="true" className="flecha size-4" />
              </a>
              <a href={perfil.cv} download={perfil.cvArchivo} className="boton boton--hueco">
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
