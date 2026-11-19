import { ArrowUpRight, Download, Github, Linkedin } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { BotonCopiar } from "@/components/ui/BotonCopiar";
import { FormularioCorreo } from "@/components/ui/FormularioCorreo";

type Props = { t: Diccionario };

export function Contacto({ t }: Props) {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="lienzo py-seccion">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div>
          <h2 id="contacto-titulo" className="text-[clamp(3rem,1.6rem+4.8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {t.contacto.titulo}
          </h2>
          <p className="mt-6 max-w-[34ch] text-base text-atenuado">{t.contacto.bajada}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${perfil.email}`} className="inline-flex min-h-11 items-center gap-2 text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] font-semibold break-all">
              <span className="enlace">{perfil.email}</span>
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
            </a>
            <BotonCopiar
              email={perfil.email}
              texto={t.contacto.copiar}
              avisoCopiado={t.contacto.correoCopiado}
              avisoFallo={t.contacto.correoFallo}
            />
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-menor font-medium">
            <li>
              <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2">
                <Linkedin aria-hidden="true" className="size-4" />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={perfil.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2">
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
            </li>
            <li>
              <a href={perfil.cv} download={perfil.cvArchivo} className="inline-flex min-h-11 items-center gap-2">
                <Download aria-hidden="true" className="size-4" />
                {t.contacto.descargarCV} <span className="font-normal text-tenue">{t.contacto.cvFormato}</span>
              </a>
            </li>
          </ul>
          <div aria-hidden="true" data-particulas="contacto" className="mt-10 hidden h-48 lg:block" />
        </div>
        <FormularioCorreo email={perfil.email} t={t} />
      </div>
    </section>
  );
}
