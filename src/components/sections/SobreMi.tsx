import type { Diccionario } from "@/i18n/diccionario";
import { Negritas } from "@/components/ui/Negritas";

type Props = { t: Diccionario };

/** El saludo: quién es, qué hace ahora y cómo trabaja. */
export function SobreMi({ t }: Props) {
  const h = t.hero;
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="border-t border-borde">
      <div className="lienzo grid gap-10 py-seccion md:grid-cols-2">
        <div>
          <h2 id="sobre-mi-titulo" className="titulo-seccion">
            {h.saludo}
          </h2>
          <div className="mt-8 max-w-xs border-t border-bordefuerte pt-4 text-menor">
            <p className="text-mini text-tenue">{h.actualmente}</p>
            <p className="mt-2 font-semibold">{h.actual}</p>
            <p className="text-atenuado">{h.actualRol}</p>
            <p className="text-tenue">{h.actualDetalle}</p>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-8">
          <div aria-hidden="true" data-particulas="sobre" className="h-36 md:h-56" />
          <p className="max-w-[28ch] text-guia text-atenuado">
            <Negritas texto={h.intro} />
          </p>
        </div>
      </div>
    </section>
  );
}
