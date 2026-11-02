import { ArrowUpRight, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { BotonCorreo } from "@/components/BotonCorreo";
import { Encabezado } from "./Encabezado";
import { Vuelta } from "./Vuelta";

type Props = { t: Diccionario };

/** S5 · Box: el contacto, y la bandera a cuadros de la vuelta. */
export function Box({ t }: Props) {
  const s = t.nav.sectores.box;
  const filas = [
    { etiqueta: t.box.correo, valor: perfil.email, href: `mailto:${perfil.email}` },
    { etiqueta: t.box.telefono, valor: perfil.telefono, href: `tel:${perfil.telefonoEnlace}` },
    { etiqueta: "LinkedIn", valor: perfil.linkedinVisible, href: perfil.linkedin, externo: true },
    { etiqueta: "GitHub", valor: `github.com/${perfil.githubUsuario}`, href: perfil.github, externo: true },
    { etiqueta: t.box.ubicacion, valor: t.box.ubicacionValor },
  ];

  return (
    <section id="box" aria-labelledby="box-titulo" data-estela className="relative z-[1] px-4 pb-16 pt-24 md:px-8 md:pt-32">
      <div aria-hidden="true" data-bandera className="cuadros absolute inset-x-0 top-0 h-7 opacity-90" />
      <div className="mx-auto max-w-[1440px]">
        <Encabezado id="box" codigo={s.codigo} metafora={s.metafora} titulo={t.box.titulo} bajada={t.box.bajada} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-start gap-3">
              <BotonCorreo
                email={perfil.email}
                texto={t.box.botonCorreo}
                copiado={t.box.correoCopiado}
                fallo={t.box.correoFallo}
              />
              <a
                href={perfil.cv}
                download={perfil.cvArchivo}
                className="barrido inline-flex h-14 items-center gap-3 border border-tinta px-6 font-mono text-etiqueta uppercase tracking-[0.12em] [--barrido:var(--c-tinta)] hover:text-papel"
              >
                <Download aria-hidden="true" className="size-4" />
                {t.box.descargarCV}
                <span className="sr-only">{t.box.cvFormato}</span>
              </a>
            </div>

            <dl className="mt-8 border-t border-tinta">
              {filas.map((f) => (
                <div key={f.etiqueta} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-linea py-3.5 md:grid-cols-[9rem_minmax(0,1fr)]">
                  <dt className="mono-etiqueta text-tenue">{f.etiqueta}</dt>
                  <dd className="min-w-0 break-words text-[1.0625rem]">
                    {f.href ? (
                      <a
                        href={f.href}
                        {...(f.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex items-center gap-1.5 underline decoration-lineafuerte underline-offset-4 hover:text-morado hover:decoration-moradovivo"
                      >
                        {f.valor}
                        {f.externo && (
                          <>
                            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                            <span className="sr-only">{t.garage.enlaceExterno}</span>
                          </>
                        )}
                      </a>
                    ) : (
                      f.valor
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Vuelta t={t} />
        </div>
      </div>
    </section>
  );
}
