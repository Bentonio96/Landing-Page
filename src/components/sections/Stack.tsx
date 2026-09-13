import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { stack } from "@/data/stack";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { idioma: Idioma; t: Diccionario };

export function Stack({ idioma, t }: Props) {
  return (
    <Seccion
      id="stack"
      numero="02"
      etiqueta={t.stack.etiqueta}
      titulo={t.stack.titulo}
      bajada={t.stack.bajada}
      alterna
    >
      {/* Una fila por categoría separada por reglas capilares, con el nombre
          a la izquierda y las tecnologías a la derecha. */}
      <div className="border-t border-borde">
        {stack.map((categoria, i) => (
          <Reveal key={categoria.id} retardo={i * 0.06}>
            <div className="grid gap-5 border-b border-borde py-8 md:grid-cols-12 md:gap-x-canal md:py-10">
              <h3 className="flex items-baseline gap-4 text-t3 md:col-span-4">
                <span aria-hidden="true" className="font-mono text-etiqueta text-tenue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {categoria.titulo[idioma]}
              </h3>
              <ul className="flex flex-wrap gap-2 md:col-span-8 md:pt-1">
                {categoria.items.map((item) => (
                  <Chip
                    key={item.nombre}
                    principal={item.principal}
                    etiquetaPrincipal={t.stack.principal}
                    origen="stack"
                  >
                    {item.nombre}
                  </Chip>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Seccion>
  );
}
