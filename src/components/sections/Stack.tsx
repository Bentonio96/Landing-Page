import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { stack } from "@/data/stack";
import { EncabezadoSeccion } from "@/components/ui/Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Columnas con una regla arriba y chips. Las principales van rellenas, como
 * en el reel; la leyenda lo dice con palabras (no depende solo del color).
 */
export function Stack({ idioma, t }: Props) {
  return (
    <section id="stack" aria-labelledby="stack-titulo" className="lienzo py-seccion">
      <EncabezadoSeccion id="stack-titulo" titulo={t.stack.titulo} bajada={t.stack.bajada} />
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((categoria, i) => (
          <div key={categoria.id} className={i % 2 === 1 ? "lg:mt-16" : undefined}>
            <div className="border-t-2 border-texto pt-4">
              <h3 className="ancho text-t3 font-bold">{categoria.titulo[idioma]}</h3>
              <p className="mono mt-1 text-[0.75rem] text-tenue">
                {categoria.items.length} {t.stack.herramientas}
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categoria.items.map((item) => (
                <li key={item.nombre} className={item.principal ? "chip chip--principal" : "chip"}>
                  {item.nombre}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-12 flex items-center gap-3 text-menor text-atenuado">
        <span aria-hidden="true" className="chip chip--principal min-h-0 px-2 py-0.5 text-[0.7rem]">
          Aa
        </span>
        {t.stack.principal}
      </p>
    </section>
  );
}
