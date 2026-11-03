import { ArrowUp } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";

type Props = { idioma: Idioma; t: Diccionario };

/** Versión publicada principal del portafolio, la de la rama main. */
const VERSION_PRINCIPAL = "https://benjamin-pena.vercel.app";

export function PieDePagina({ idioma, t }: Props) {
  return (
    <footer className="border-t border-borde py-10">
      <div className="lienzo flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1 text-menor text-tenue">
          <p>
            © {new Date().getFullYear()} {perfil.nombre}. {t.pie.derechos}
          </p>
          <p>{t.pie.construidoCon}</p>
          <p>
            {t.pie.otrasVersiones}{" "}
            <a href={`${VERSION_PRINCIPAL}${idioma === "en" ? "/en" : ""}`} className="enlace text-atenuado">
              {t.pie.versionPrincipal}
            </a>
          </p>
        </div>

        <a
          href="#inicio"
          className="inline-flex min-h-10 items-center gap-1.5 self-start font-mono text-etiqueta uppercase tracking-[0.1em] text-atenuado transition-colors hover:text-acento sm:self-auto"
        >
          {t.pie.volverArriba}
          <ArrowUp aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
