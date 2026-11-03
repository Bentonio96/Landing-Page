import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { enlaceCorreo } from "@/lib/utils";
import { pieza } from "@/lib/pieza";
import { BotonCorreo } from "@/components/ui/BotonCorreo";
import { Titulo } from "@/components/ui/Titulo";

type Props = { t: Diccionario };

export function Contacto({ t }: Props) {
  const tc = t.contacto;
  const filas = [
    {
      id: "correo",
      icono: Mail,
      rotulo: tc.email,
      valor: perfil.email,
      href: enlaceCorreo(perfil.email, tc.asuntoCorreo, tc.cuerpoCorreo),
    },
    { id: "telefono", icono: Phone, rotulo: tc.telefono, valor: perfil.telefono, href: `tel:${perfil.telefonoEnlace}` },
    { id: "linkedin", icono: Linkedin, rotulo: "LinkedIn", valor: perfil.linkedinVisible, href: perfil.linkedin, externo: true },
    { id: "github", icono: Github, rotulo: "GitHub", valor: `github.com/${perfil.githubUsuario}`, href: perfil.github, externo: true },
    { id: "ubicacion", icono: MapPin, rotulo: tc.ubicacion, valor: perfil.ubicacion },
  ];

  return (
    <section
      id="contacto"
      data-seccion="contacto"
      aria-labelledby="titulo-contacto"
      className="lienzo grid gap-10 pb-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
    >
      <div>
        <Titulo id="contacto" etiqueta={tc.etiqueta} titulo={tc.titulo} bajada={tc.bajada} />
        <div className="mt-8 flex flex-wrap gap-3">
          <span {...pieza("botón")} className="inline-block">
            <BotonCorreo
              email={perfil.email}
              texto={tc.botonCorreo}
              avisoCopiado={tc.correoCopiado}
              avisoFallo={tc.correoFallo}
            />
          </span>
          <a
            {...pieza("botón")}
            href={perfil.cv}
            download={perfil.cvArchivo}
            className="boton boton-secundario"
          >
            <Download aria-hidden="true" className="size-4" />
            {tc.descargarCV}
            <span className="sr-only"> {tc.cvFormato}</span>
          </a>
        </div>
      </div>

      <ul {...pieza("ficha", "caja")} className="panel self-start divide-y divide-borde">
        {filas.map((f) => {
          const Icono = f.icono;
          const contenido = (
            <>
              <Icono aria-hidden="true" className="size-4 shrink-0 text-tenue" />
              <span className="w-24 shrink-0 font-mono text-etiqueta text-tenue">{f.rotulo}</span>
              <span className="min-w-0 break-words text-menor text-texto">{f.valor}</span>
              {f.href && f.externo ? (
                <ArrowUpRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-tenue" />
              ) : null}
            </>
          );
          return (
            <li key={f.id} {...pieza("fila")} className="block">
              {f.href ? (
                <a
                  href={f.href}
                  {...(f.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-elevado sm:px-5"
                >
                  {contenido}
                  {f.externo ? <span className="sr-only">{t.proyectos.enlaceExterno}</span> : null}
                </a>
              ) : (
                <p className="flex min-h-14 items-center gap-3 px-4 py-3 sm:px-5">{contenido}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
