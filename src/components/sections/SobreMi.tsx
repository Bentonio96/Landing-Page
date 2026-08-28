import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { certificaciones, idiomasHablados } from "@/data/perfil";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { idioma: Idioma; t: Diccionario };

export function SobreMi({ idioma, t }: Props) {
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

      <Reveal retardo={0.18}>
        <div className="mt-12 grid gap-8 border-t border-borde pt-8 sm:grid-cols-2">
          <div>
            <h3 className="etiqueta text-texto">{t.sobreMi.idiomas}</h3>
            <dl className="mt-4 space-y-2">
              {idiomasHablados.map((item) => (
                <div
                  key={item.nombre.es}
                  className="flex items-baseline justify-between gap-4 text-menor"
                >
                  <dt>{item.nombre[idioma]}</dt>
                  <dd className="font-mono text-etiqueta text-tenue">
                    {item.nivel[idioma]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="etiqueta text-texto">{t.sobreMi.certificaciones}</h3>
            <ul className="mt-4 space-y-3">
              {certificaciones.map((cert) => (
                <li key={cert.nombre} className="text-menor">
                  <span className="block">{cert.nombre}</span>
                  <span className="font-mono text-etiqueta text-tenue">
                    {cert.emisor} · {cert.fecha[idioma]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Seccion>
  );
}
