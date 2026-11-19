import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { idiomasHablados } from "@/data/perfil";

type Props = { idioma: Idioma; t: Diccionario };

export function QuienSoy({ idioma, t }: Props) {
  return (
    <section id="quien-soy" aria-labelledby="quien-soy-titulo" className="lienzo py-seccion">
      <div className="grid gap-10 border-t border-bordefuerte pt-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div>
          <h2 id="quien-soy-titulo" className="titulo-seccion">
            {t.sobreMi.titulo}
          </h2>
          <blockquote className="mt-8 max-w-[24ch] border-l-2 border-acentovivo pl-5 text-t3 font-semibold">
            <p>“{t.sobreMi.cita}”</p>
          </blockquote>
        </div>
        <div>
          <div className="grid gap-5 text-atenuado lg:grid-cols-2 lg:gap-x-10">
            {t.sobreMi.parrafos.map((p, i) => (
              <p key={i} className={i === 0 ? "text-texto" : undefined}>
                {p}
              </p>
            ))}
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t pt-5 text-menor">
            <dt className="text-tenue">{t.sobreMi.idiomas}</dt>
            {idiomasHablados.map((h) => (
              <dd key={h.nombre.es}>
                <span className="font-semibold">{h.nombre[idioma]}</span>{" "}
                <span className="text-atenuado">{h.nivel[idioma]}</span>
              </dd>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
