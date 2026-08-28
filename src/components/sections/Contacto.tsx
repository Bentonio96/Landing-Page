import { Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { Boton } from "@/components/ui/Boton";
import { BotonCorreo } from "@/components/ui/BotonCorreo";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { t: Diccionario };

export function Contacto({ t }: Props) {
  const datos = [
    {
      id: "email",
      icono: Mail,
      etiqueta: t.contacto.email,
      valor: perfil.email,
      href: `mailto:${perfil.email}`,
    },
    {
      id: "telefono",
      icono: Phone,
      etiqueta: t.contacto.telefono,
      valor: perfil.telefono,
      href: `tel:${perfil.telefonoEnlace}`,
    },
    {
      id: "ubicacion",
      icono: MapPin,
      etiqueta: t.contacto.ubicacion,
      valor: perfil.ubicacion,
      href: null,
    },
  ] as const;

  const redes = [
    {
      id: "github",
      icono: Github,
      nombre: "GitHub",
      visible: `github.com/${perfil.githubUsuario}`,
      href: perfil.github,
    },
    {
      id: "linkedin",
      icono: Linkedin,
      nombre: "LinkedIn",
      visible: perfil.linkedinVisible,
      href: perfil.linkedin,
    },
  ] as const;

  return (
    <Seccion
      id="contacto"
      numero="05"
      etiqueta={t.contacto.etiqueta}
      titulo={t.contacto.titulo}
      bajada={t.contacto.bajada}
    >
      <div className="space-y-10">
        <Reveal>
          <dl className="grid gap-px overflow-hidden border border-borde bg-borde sm:grid-cols-3">
            {datos.map(({ id, icono: Icono, etiqueta, valor, href }) => (
              <div key={id} className="bg-superficie p-5">
                <dt className="etiqueta flex items-center gap-2">
                  <Icono aria-hidden="true" className="size-3.5" />
                  {etiqueta}
                </dt>
                <dd className="mt-2 text-menor break-words">
                  {href ? (
                    <a href={href} className="enlace">
                      {valor}
                    </a>
                  ) : (
                    <span className="text-atenuado">{valor}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal retardo={0.08}>
          <ul className="flex flex-wrap gap-3">
            {redes.map(({ id, icono: Icono, nombre, visible, href }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-pieza border border-borde px-4 py-3 text-menor text-atenuado transition-colors hover:border-acento hover:text-acento"
                >
                  <Icono aria-hidden="true" className="size-4" />
                  <span>{visible}</span>
                  <span className="sr-only">
                    — {nombre} {t.proyectos.enlaceExterno}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal retardo={0.14}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BotonCorreo
              email={perfil.email}
              texto={t.contacto.botonCorreo}
              avisoCopiado={t.contacto.correoCopiado}
              avisoFallo={t.contacto.correoFallo}
              className="w-full sm:w-auto"
            />

            {/* El CV es de lo que más se pide para evaluar experiencia:
                lleva la variante de acento para que no se pierda al lado del
                CTA de correo, sin volverse un segundo botón sólido. */}
            <Boton
              href={perfil.cv}
              variante="acento"
              descargar
              className="w-full sm:w-auto"
            >
              <Download aria-hidden="true" className="size-4" />
              {/* El formato hereda el color del botón a propósito: sobre el
                  fondo teñido de acento, el gris atenuado caía a 4.31:1. */}
              <span>
                {t.contacto.descargarCV} {t.contacto.cvFormato}
              </span>
            </Boton>
          </div>
        </Reveal>
      </div>
    </Seccion>
  );
}
