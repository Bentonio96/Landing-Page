import { ArrowUpRight, Download } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { enlaceCorreo } from "@/lib/utils";
import { CopiarCorreo } from "@/components/CopiarCorreo";
import { BordeCuadros } from "@/components/BordeCuadros";

type Props = { idioma: Idioma; t: Diccionario };

/** Contacto: se vuelve al asfalto para cerrar, tras la bandera a cuadros. */
export function Pitazo({ idioma, t }: Props) {
  const enlaces = [
    { href: perfil.linkedin, texto: "LinkedIn", visible: perfil.linkedinVisible },
    { href: perfil.github, texto: "GitHub", visible: `github.com/${perfil.githubUsuario}` },
  ];

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="asfalto sobre-asfalto relative isolate overflow-hidden pb-seccion"
    >
      <BordeCuadros />

      <div className="lienzo mt-seccion">
        <h2 id="contacto-titulo" className="flex flex-col items-start">
          <span className="voz-firma -rotate-3 text-[clamp(3rem,10vw,6.5rem)]">
            {t.v2.contactoFirma}
          </span>
          <span className="voz-carrera -mt-[0.15em] text-[clamp(2.75rem,12vw,9rem)] leading-[0.9]">
            {t.v2.contactoApellido}
          </span>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-x-canal">
          <div className="md:col-span-7">
            <p className="text-t3 font-light">{t.contacto.bajada}</p>
            <a
              href={enlaceCorreo(perfil.email, t.contacto.asuntoCorreo, t.contacto.cuerpoCorreo)}
              className="mt-8 inline-block break-all text-[clamp(1.25rem,1rem+1.6vw,2.25rem)] font-medium underline decoration-senal decoration-2 underline-offset-[0.2em] hover:decoration-4"
            >
              {perfil.email}
            </a>
            <div className="mt-5">
              <CopiarCorreo
                correo={perfil.email}
                etiqueta={t.contacto.botonCorreo}
                copiado={t.contacto.correoCopiado}
                fallo={t.contacto.correoFallo}
              />
            </div>
          </div>

          <div className="md:col-span-5">
          <dl className="border-t border-[var(--c-linea)]">
            <div className="border-b border-[var(--c-linea)] py-4">
              <dt className="micro">{t.contacto.telefono}</dt>
              <dd className="mt-1 text-lg">
                <a href={`tel:${perfil.telefonoEnlace}`} className="underline-offset-4 hover:underline">
                  {perfil.telefono}
                </a>
              </dd>
            </div>
            <div className="border-b border-[var(--c-linea)] py-4">
              <dt className="micro">{t.contacto.ubicacion}</dt>
              <dd className="mt-1 text-lg">{perfil.ubicacion}</dd>
            </div>
            {enlaces.map((e) => (
              <div key={e.texto} className="border-b border-[var(--c-linea)] py-4">
                <dt className="micro">{e.texto}</dt>
                <dd className="mt-1 text-lg">
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 break-all underline-offset-4 hover:underline"
                  >
                    {e.visible}
                    <span className="sr-only"> {t.proyectos.enlaceExterno}</span>
                    <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                  </a>
                </dd>
              </div>
            ))}
          </dl>
            <div className="py-5">
              <a
                href={perfil.cv}
                download={perfil.cvArchivo}
                className="etiqueta inline-flex min-h-11 items-center gap-2 bg-sobreasfalto px-4 text-asfalto hover:bg-acentoasfalto hover:text-tinta"
                lang={idioma}
              >
                <Download aria-hidden="true" className="size-4" />
                {t.contacto.descargarCV} {t.contacto.cvFormato}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
