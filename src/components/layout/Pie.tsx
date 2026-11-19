import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";

type Props = { t: Diccionario };

/** Banda negra con enlaces y, abajo, su nombre hecho de puntos que se apartan del cursor. */
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
      <div className="bg-black text-[#F2F2F2]">
        <div className="lienzo pb-10 pt-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_1fr]">
            <div>
              <p className="text-[1.75rem] font-semibold tracking-[-0.03em]">Benjamín.</p>
              <p className="mt-3 max-w-[22ch] text-mini text-[#B8B8B8]">{t.pie.descripcion}</p>
            </div>
            <nav aria-label={t.nav.explorar}>
              <p className="text-mini text-[#9A9A9A]">{t.nav.explorar}</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-menor">
                {enlaces.map((e) => (
                  <li key={e.href}>
                    <a href={e.href} download={e.descarga ? perfil.cvArchivo : undefined} className="enlace">
                      {e.texto}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="text-mini text-[#9A9A9A]">{t.pie.escribeme}</p>
              <a href={`mailto:${perfil.email}`} className="mt-4 inline-flex items-center gap-1.5 text-menor break-all">
                <span className="enlace">{perfil.email}</span>
                <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
              </a>
              <p className="mt-3 text-mini text-[#9A9A9A]">© 2026 {t.pie.derechos}</p>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <p className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-semibold leading-none tracking-[-0.035em]">
              {t.pie.nosVemos}
            </p>
            <a href="#inicio" className="inline-flex min-h-11 items-center gap-2 text-mini">
              <span className="enlace">{t.pie.volverArriba}</span>
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black pb-4 text-[#F2F2F2]">
        <div className="lienzo">
          <div className="relative h-[clamp(8rem,22vw,20rem)] border-t border-[#2A2A2A]">
            <div data-particulas="pie" data-oscuro data-margen="16,0,8,0" role="img" aria-label={t.pie.particulas} className="absolute inset-0" />
          </div>
        </div>
      </div>
    </footer>
  );
}
