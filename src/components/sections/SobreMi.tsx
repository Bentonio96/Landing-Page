import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { certificaciones, idiomasHablados } from "@/data/perfil";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { idioma: Idioma; t: Diccionario };

/** Envuelve cada palabra en un span y deja los espacios como texto. */
function enPalabras(texto: string) {
  return texto.split(/(\s+)/).map((trozo, i) =>
    trozo.trim() ? (
      <span key={i} className="palabra-cita">
        {trozo}
      </span>
    ) : (
      trozo
    ),
  );
}

export function SobreMi({ idioma, t }: Props) {
  const [entrada, ...resto] = t.sobreMi.parrafos;
  const trayectoria = resto.slice(0, -1);
  const cierre = resto[resto.length - 1];
  const { cita } = t.sobreMi;

  return (
    <Seccion
      id="sobre-mi"
      numero="01"
      etiqueta={t.sobreMi.etiqueta}
      titulo={t.sobreMi.titulo}
    >
      <div className="grid gap-x-canal gap-y-10 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="text-t3 font-light text-texto">{entrada}</p>
        </Reveal>

        <div className="space-y-6 md:col-span-6 md:col-start-7">
          {trayectoria.map((parrafo, i) => (
            <Reveal key={parrafo.slice(0, 24)} retardo={i * 0.06}>
              <p className="text-guia text-atenuado">{parrafo}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* La cita no repite texto: es la frase que cierra el tercer párrafo,
          sacada de él y puesta a tamaño de cartel. Por eso es un párrafo
          normal y no va oculta a lectores de pantalla. */}
      <Reveal className="my-24 md:my-40">
        {/* Cada palabra se enciende al ritmo del scroll (ver .palabra-cita y
            Movimiento.tsx). Los espacios quedan como texto normal entre
            spans, así que la frase se lee y se copia entera. */}
        <p data-cita-scroll="" className="font-display text-t1 uppercase text-cita">
          {enPalabras(cita.antes)}
          <span data-subrayado="" className="subrayado-cita">
            {enPalabras(cita.resaltado)}
          </span>
          {enPalabras(cita.despues)}
        </p>
        <p className="etiqueta mt-8">{cita.pie}</p>
      </Reveal>

      <div className="grid gap-x-canal gap-y-14 md:grid-cols-12">
        {cierre ? (
          <Reveal className="md:col-span-6">
            <p className="text-guia text-atenuado">{cierre}</p>
          </Reveal>
        ) : null}

        <Reveal
          retardo={0.08}
          className="grid gap-12 sm:grid-cols-2 md:col-span-5 md:col-start-8 md:grid-cols-1"
        >
          <div>
            <h3 className="etiqueta text-texto">{t.sobreMi.idiomas}</h3>
            <dl data-trazo="" className="trazo-superior mt-5">
              {idiomasHablados.map((item) => (
                <div
                  key={item.nombre.es}
                  data-trazo=""
                  className="trazo-inferior flex items-baseline justify-between gap-4 py-4"
                >
                  <dt className="text-lg font-light">{item.nombre[idioma]}</dt>
                  <dd className="font-mono text-etiqueta text-tenue">
                    {item.nivel[idioma]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="etiqueta text-texto">{t.sobreMi.certificaciones}</h3>
            <ul data-trazo="" className="trazo-superior mt-5">
              {certificaciones.map((cert) => (
                <li key={cert.nombre} data-trazo="" className="trazo-inferior py-4">
                  <span className="block text-lg font-light">{cert.nombre}</span>
                  <span className="mt-1 block font-mono text-etiqueta text-tenue">
                    {cert.emisor} · {cert.fecha[idioma]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Seccion>
  );
}
