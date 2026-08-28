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
    >
      <div className="space-y-10">
        {stack.map((categoria, i) => (
          <Reveal key={categoria.id} retardo={i * 0.08}>
            <div className="border-t border-borde pt-6">
              <h3 className="etiqueta text-texto">
                {categoria.titulo[idioma]}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {categoria.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Seccion>
  );
}
