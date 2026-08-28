import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";

type Props = { idioma: Idioma; t: Diccionario };

export function PieDePagina({ idioma, t }: Props) {
  const redes = [
    { id: "github", icono: Github, nombre: "GitHub", href: perfil.github },
    { id: "linkedin", icono: Linkedin, nombre: "LinkedIn", href: perfil.linkedin },
    { id: "email", icono: Mail, nombre: t.contacto.email, href: `mailto:${perfil.email}` },
  ] as const;

  return (
    <footer className="border-t border-borde py-12">
      <div className="lienzo">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-t3">{perfil.nombre}</p>
            <p className="etiqueta mt-2">{t.hero.rol}</p>
            <p className="mt-4 text-menor text-tenue">
              {t.pie.derechos} {t.pie.construidoCon}
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:items-end">
            <ul className="flex items-center gap-2">
              {redes.map(({ id, icono: Icono, nombre, href }) => (
                <li key={id}>
                  <a
                    href={href}
                    {...(id === "email"
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="inline-flex size-10 items-center justify-center rounded-pieza border border-borde text-atenuado transition-colors hover:border-acento hover:text-acento"
                  >
                    <Icono aria-hidden="true" className="size-4" />
                    <span className="sr-only">{nombre}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <p className="etiqueta">
                © {new Date().getFullYear()} {perfil.nombreCorto}
              </p>
              <a
                href="#inicio"
                className="inline-flex items-center gap-1.5 font-mono text-etiqueta uppercase tracking-[0.12em] text-atenuado transition-colors hover:text-acento"
              >
                {t.pie.volverArriba}
                <ArrowUp aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" lang={idioma}>
        {perfil.ubicacion}
      </span>
    </footer>
  );
}
