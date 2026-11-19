import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { Ciudad } from "./Ciudad";

type Props = { t: Diccionario };

/** «The footer is the main character now»: banda de tinta y, abajo, la ciudad. */
export function Pie({ t }: Props) {
  const enlaces = [
    { href: "#sobre-mi", texto: t.nav.sobreMi },
    { href: "#stack", texto: t.nav.stack },
    { href: "#proyectos", texto: t.nav.proyectos },
    { href: "#experiencia", texto: t.nav.experiencia },
    { href: "#contacto", texto: t.nav.contacto },
    { href: perfil.cv, texto: "CV", descarga: true },
  ];
  return (
    <footer id="pie">
      <div className="bg-pie text-pietexto">
        <div className="lienzo pb-10 pt-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <p className="ancho text-t3 font-bold">Benjamín.</p>
              <p className="mt-2 max-w-[24ch] text-menor text-pietenue">{t.pie.descripcion}</p>
            </div>
            <nav aria-label={t.nav.explorar}>
              <p className="text-menor text-pietenue">{t.nav.explorar}</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-menor font-medium">
                {enlaces.map((e) => (
                  <li key={e.href}>
                    <a
                      href={e.href}
                      download={e.descarga ? perfil.cvArchivo : undefined}
                      className="enlace inline-block py-0.5"
                    >
                      {e.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="text-menor text-pietenue">{t.pie.escribeme}</p>
              <a href={`mailto:${perfil.email}`} className="mt-3 inline-flex items-center gap-1.5 text-menor font-medium break-all">
                <span className="enlace">{perfil.email}</span>
                <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
              </a>
              <p className="mt-3 text-menor text-pietenue">
                © 2026 {t.pie.derechos}. {t.pie.construidoCon}
              </p>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-pieborde pt-6">
            <p className="ancho text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-bold leading-none tracking-[-0.035em]">
              {t.pie.nosVemos}
            </p>
            <a href="#inicio" className="inline-flex min-h-11 items-center gap-2 text-menor font-medium">
              <span className="enlace">{t.pie.volverArriba}</span>
              <ArrowUp aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <Ciudad textos={t.pie.ciudad} />
    </footer>
  );
}
