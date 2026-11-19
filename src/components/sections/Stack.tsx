import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { stack } from "@/data/stack";
import { EncabezadoSeccion } from "@/components/ui/Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Como en el reel: columnas en cascada (cada una más abajo que la anterior),
 * una regla larga arriba, el título, una bajada corta y los chips. Los
 * principales van rellenos; la leyenda lo dice con palabras.
 */
const CASCADA = ["", "lg:mt-14", "lg:mt-28", "lg:mt-42"];

export function Stack({ idioma, t }: Props) {
  const categorias = t.stack.categorias as Record<string, string>;
  return (
    <section id="stack" aria-labelledby="stack-titulo" className="lienzo py-seccion">
      <EncabezadoSeccion id="stack-titulo" titulo={t.stack.titulo} bajada={t.stack.bajada} figura="stack" />
      <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((categoria, i) => (
          <div key={categoria.id} className={CASCADA[i % CASCADA.length]}>
            <div className="border-t border-bordefuerte pt-6">
              <h3 className="text-t3 font-semibold tracking-[-0.02em]">{categoria.titulo[idioma]}</h3>
              <p className="mt-3 max-w-[30ch] text-mini text-atenuado">
                {categorias[categoria.id]}
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {categoria.items.map((item) => (
                <li key={item.nombre} className={item.principal ? "chip chip--principal" : "chip"}>
                  {item.nombre}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-14 flex items-center gap-3 text-mini text-atenuado">
        <span aria-hidden="true" className="chip chip--principal min-h-0 px-2 py-0.5 text-mini">
          Aa
        </span>
        {t.stack.principal}
      </p>
    </section>
  );
}
