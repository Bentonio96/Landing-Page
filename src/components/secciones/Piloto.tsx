import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { idiomasHablados } from "@/data/perfil";
import { Encabezado } from "./Encabezado";

type Props = { idioma: Idioma; t: Diccionario };

/** S1 · Piloto: quién es, en texto, y su telemetría en cifras reales. */
export function Piloto({ idioma, t }: Props) {
  const s = t.nav.sectores.piloto;
  return (
    <section id="piloto" aria-labelledby="piloto-titulo" className="relative z-[1] px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Encabezado id="piloto" codigo={s.codigo} metafora={s.metafora} titulo={t.piloto.titulo} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="space-y-5 text-guia" data-revelar>
            {t.piloto.parrafos.map((p, i) => (
              <p key={i} className={i === 0 ? "text-tinta" : "text-atenuado"}>
                {p}
              </p>
            ))}
            <blockquote className="!mt-10 border-l-2 border-moradovivo pl-5">
              <p className="titular text-t3 normal-case">
                {idioma === "es" ? "«" : "“"}
                {t.piloto.cita.antes}
                <span className="text-morado">{t.piloto.cita.resaltado}</span>
                {t.piloto.cita.despues}
                {idioma === "es" ? "»" : "”"}
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="mono-etiqueta flex items-center gap-3 text-atenuado">
              <span className="text-senal">
                <span className="pulso" aria-hidden="true" />
              </span>
              {t.piloto.telemetria}
            </h3>
            <ul data-escalonar className="mt-4 grid grid-cols-2 border-l border-t border-linea">
              {t.piloto.datos.map((d) => (
                <li key={d.unidad} className="border-b border-r border-linea bg-[color-mix(in_srgb,var(--c-panel)_55%,transparent)] p-4 md:p-6">
                  <p className="flex items-baseline gap-2">
                    <span className="titular text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none tnum">{d.valor}</span>
                    <span className="mono-etiqueta text-atenuado">{d.unidad}</span>
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-snug text-atenuado">{d.etiqueta}</p>
                </li>
              ))}
            </ul>

            <h3 className="mono-etiqueta mt-8 text-atenuado">{t.piloto.idiomas}</h3>
            <ul className="mt-3 divide-y divide-linea border-y border-linea">
              {idiomasHablados.map((h) => (
                <li key={h.nombre.es} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className="font-medium">{h.nombre[idioma]}</span>
                  <span className="font-mono text-etiqueta text-atenuado">{h.nivel[idioma]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
