import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { proyectos } from "@/data/proyectos";
import { stack } from "@/data/stack";
import { pieza } from "@/lib/pieza";
import { cn } from "@/lib/utils";
import { Titulo } from "@/components/ui/Titulo";

type Props = { idioma: Idioma; t: Diccionario };

const normalizar = (nombre: string) => nombre.replace(/\s+\d+$/, "").toLowerCase();

/** Proyectos publicados que usan al menos una herramienta de la categoría. */
function proyectosQueUsan(items: { nombre: string }[]) {
  const nombres = new Set(items.map((i) => normalizar(i.nombre)));
  return proyectos
    .filter((p) => p.tecnologias.some((tec) => nombres.has(normalizar(tec))))
    .map((p) => p.nombre);
}

/** Frontend ocupa dos columnas: es la categoría más larga y el foco. */
const ANCHO: Record<string, string> = {
  frontend: "sm:col-span-2",
};

/**
 * Cada herramienta es una capa propia: aquí es donde se ven las docenas.
 * La grilla cierra con «Cómo trabajo», el flujo con agentes que inspira
 * esta versión.
 */
export function Stack({ idioma, t }: Props) {
  const ts = t.stack;
  return (
    <section id="stack" data-seccion="stack" aria-labelledby="titulo-stack" className="lienzo pb-seccion">
      <Titulo id="stack" etiqueta={ts.etiqueta} titulo={ts.titulo} bajada={ts.bajada} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((categoria) => {
          const usados = proyectosQueUsan(categoria.items);
          const descripcion = ts.descripciones[categoria.id as keyof typeof ts.descripciones];
          return (
            <div
              key={categoria.id}
              {...pieza(`stack-${categoria.id}`, "grupo", "caja")}
              className={cn("panel flex flex-col p-5 sm:p-6", ANCHO[categoria.id])}
            >
              <h3 className="flex items-center justify-between font-mono text-etiqueta uppercase tracking-[0.08em] text-texto">
                {categoria.titulo[idioma]}
                <span className="text-tenue">{categoria.items.length}</span>
              </h3>
              {descripcion ? (
                <p {...pieza(`stack-desc-${categoria.id}`, "texto")} className="mt-2 block text-menor text-atenuado">
                  {descripcion}
                </p>
              ) : null}
              <ul className="mb-5 mt-4 flex flex-wrap gap-1.5">
                {categoria.items.map((item) => (
                  <li
                    key={item.nombre}
                    {...pieza(`chip-${categoria.id}-${item.nombre}`, "chip")}
                    className={item.principal ? "chip border-acento/40 text-texto" : "chip"}
                  >
                    {item.principal ? (
                      <>
                        <span className="size-1.5 rounded-full bg-acentovivo" aria-hidden="true" />
                        {item.nombre}
                        <span className="sr-only"> ({ts.principal})</span>
                      </>
                    ) : (
                      item.nombre
                    )}
                  </li>
                ))}
              </ul>
              {usados.length ? (
                <p
                  {...pieza(`stack-usados-${categoria.id}`, "proyectos")}
                  className="mt-auto block border-t border-borde pt-4 text-[0.8125rem] text-tenue"
                >
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em]">{ts.enProyectos}</span>
                  <span className="mt-1 block text-atenuado">{usados.join(" · ")}</span>
                </p>
              ) : null}
            </div>
          );
        })}

        <div
          {...pieza("stack-flujo", "flujo", "caja")}
          className="panel flex flex-col p-5 sm:p-6"
        >
          <h3 className="font-mono text-etiqueta uppercase tracking-[0.08em] text-texto">{ts.flujo.titulo}</h3>
          <ol className="mt-4 space-y-3">
            {ts.flujo.pasos.map((paso, i) => (
              <li key={i} {...pieza(`flujo-${i}`, `paso ${i + 1}`)} className="flex gap-3 text-menor text-atenuado">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.6875rem] font-medium text-[#0E1117]"
                  style={{ background: ["#FF7AC6", "#5CD0FF", "#5BE49B", "#FFD25C"][i % 4] }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
