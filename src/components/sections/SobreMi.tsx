import type { Diccionario } from "@/i18n/diccionario";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { t: Diccionario };

export function SobreMi({ t }: Props) {
  return (
    <Seccion
      id="sobre-mi"
      numero="01"
      etiqueta={t.sobreMi.etiqueta}
      titulo={t.sobreMi.titulo}
    >
      <div className="max-w-medida space-y-6">
        {t.sobreMi.parrafos.map((parrafo, i) => (
          <Reveal key={parrafo.slice(0, 24)} retardo={i * 0.06}>
            <p className="text-guia text-atenuado">{parrafo}</p>
          </Reveal>
        ))}
      </div>
    </Seccion>
  );
}
