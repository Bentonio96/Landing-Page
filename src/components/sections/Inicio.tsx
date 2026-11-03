import { ArrowDown, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
import { pieza } from "@/lib/pieza";

type Props = { t: Diccionario };

/**
 * Cuenta las tecnologías de todos los proyectos. "React 19" y "Next.js 15"
 * se agrupan por su nombre base: es la misma herramienta.
 */
function tecnologiasMasUsadas(cuantas: number) {
  const conteo = new Map<string, number>();
  for (const p of proyectos) {
    for (const tec of p.tecnologias) {
      const base = tec.replace(/\s+\d+$/, "");
      conteo.set(base, (conteo.get(base) ?? 0) + 1);
    }
  }
  return [...conteo.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, cuantas);
}

/**
 * El titular y el panel de resumen, como el dashboard del reel. Todos los
 * números salen de src/data al compilar: nada se escribe a mano.
 */
export function Inicio({ t }: Props) {
  const conDemo = proyectos.filter((p) => p.demoUrl).length;
  const herramientas = stack.reduce((n, c) => n + c.items.length, 0);
  const top = tecnologiasMasUsadas(6);
  const maximo = top[0]?.[1] ?? 1;
  const panel = t.inicio.panel;

  return (
    <section
      id="inicio"
      data-seccion="inicio"
      aria-labelledby="titulo-inicio"
      className="lienzo grid items-center gap-12 pb-seccion pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20"
    >
      <div>
        <p
          {...pieza("badge")}
          className="inline-flex items-center gap-2 rounded-full border border-borde bg-superficie px-3 py-1.5 font-mono text-etiqueta text-atenuado"
        >
          <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
          {t.inicio.disponible}
        </p>

        <h1
          id="titulo-inicio"
          className="mt-6 text-t1 font-semibold tracking-[-0.045em] text-texto"
        >
          <span {...pieza("h1")} className="inline-block">
            Benjamín
          </span>{" "}
          <span {...pieza("h1")} className="inline-block">
            Peña
          </span>
        </h1>

        <p
          {...pieza("h2")}
          className="mt-5 block text-t3 font-medium tracking-[-0.02em] text-texto"
        >
          {t.inicio.rol}
        </p>

        <p
          {...pieza("párrafo")}
          className="mt-4 block max-w-[52ch] text-cuerpo text-atenuado"
        >
          {t.inicio.intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            {...pieza("botón")}
            href="#proyectos"
            className="boton boton-primario"
          >
            {t.inicio.verProyectos}
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
          <a
            {...pieza("botón")}
            href={perfil.cv}
            download={perfil.cvArchivo}
            className="boton boton-secundario"
          >
            <Download aria-hidden="true" className="size-4" />
            {t.inicio.descargarCV}
            <span className="sr-only"> {t.inicio.cvFormato}</span>
          </a>
        </div>

        <p {...pieza("meta")} className="etiqueta mt-8 block normal-case tracking-normal">
          {t.inicio.base}
        </p>
      </div>

      <div {...pieza("panel", "caja")} className="panel p-4 sm:p-6">
        <div {...pieza("cabecera")} className="flex items-baseline justify-between gap-3">
          <h2 className="text-t3 font-semibold tracking-[-0.02em]">{panel.titulo}</h2>
          <p className="font-mono text-etiqueta text-tenue">{panel.fuente}</p>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { id: "a", rotulo: panel.publicados, valor: String(conDemo) },
            { id: "b", rotulo: panel.herramientas, valor: String(herramientas) },
            { id: "c", rotulo: panel.experiencia, valor: panel.experienciaValor },
          ].map((dato) => (
            <div
              key={dato.id}
              {...pieza("métrica", "caja")}
              className="flex flex-col-reverse justify-end rounded-[10px] border border-borde bg-elevado p-3"
            >
              <dt className="mt-1 text-[0.75rem] leading-snug text-atenuado">{dato.rotulo}</dt>
              <dd className="text-[clamp(1.375rem,1rem+1.4vw,2rem)] font-semibold leading-none tracking-[-0.03em] text-texto">
                {dato.valor}
              </dd>
            </div>
          ))}
        </dl>

        <figure {...pieza("gráfico", "caja")} className="mt-3 rounded-[10px] border border-borde p-3 sm:p-4">
          <figcaption className="text-menor font-medium text-texto">{panel.grafico}</figcaption>
          <ul className="mt-3 space-y-2">
            {top.map(([nombre, n]) => (
              <li key={nombre} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-menor">
                <span className="truncate font-mono text-[0.75rem] text-atenuado">{nombre}</span>
                <span className="h-2 overflow-hidden rounded-full bg-elevado" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-acentovivo"
                    style={{ width: `${(n / maximo) * 100}%` }}
                  />
                </span>
                <span className="font-mono text-[0.75rem] text-texto">
                  {n} <span className="sr-only">{panel.proyectos}</span>
                </span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
