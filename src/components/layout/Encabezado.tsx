import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { rutaDe } from "@/i18n/config";
import { Marca } from "@/components/ui/Marca";
import { BotonIdioma } from "./BotonIdioma";
import { BotonTema } from "./BotonTema";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Barra superior. No es parte de la obra: tiene que funcionar desde el
 * primer cuadro. El logo es el «hueco» donde aterriza el de la intro.
 */
export function Encabezado({ idioma, t }: Props) {
  const enlaces = [
    { href: "#proyectos", texto: t.nav.proyectos },
    { href: "#stack", texto: t.nav.stack },
    { href: "#experiencia", texto: t.nav.experiencia },
    { href: "#contacto", texto: t.nav.contacto },
  ];

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="lienzo">
        <div className="vidrio flex h-14 items-center gap-2 rounded-full pl-4 pr-2 shadow-[0_10px_30px_-18px_var(--c-sombra)]">
          <a
            href={rutaDe(idioma)}
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 text-texto"
          >
            <span className="sr-only">Benjamín Peña — {t.nav.inicio}. </span>
            <span data-logo-slot className="block transition-opacity duration-300">
              <Marca className="h-7" />
            </span>
            <span className="hidden font-mono text-[0.75rem] text-atenuado sm:inline">v4 · obra</span>
          </a>

          <nav aria-label={t.nav.principal} className="ml-auto hidden md:block">
            <ul className="flex items-center gap-1">
              {enlaces.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    className="rounded-full px-3 py-2 text-menor text-atenuado transition-colors hover:bg-elevado hover:text-texto"
                  >
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-2">
            <a
              href="#contacto"
              className="rounded-full px-3 py-2 text-menor text-atenuado transition-colors hover:text-texto md:hidden"
            >
              {t.nav.contacto}
            </a>
            <BotonIdioma idioma={idioma} t={t} />
            <BotonTema t={t} />
          </div>
        </div>
      </div>
    </header>
  );
}
