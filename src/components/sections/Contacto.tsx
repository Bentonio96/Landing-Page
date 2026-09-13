import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";
import { BotonCorreo } from "@/components/ui/BotonCorreo";
import { Reveal } from "@/components/ui/Reveal";
import { Seccion } from "@/components/ui/Seccion";

type Props = { t: Diccionario };

type Fila = {
  id: string;
  etiqueta: string;
  valor: string;
  href: string;
  icono: LucideIcon;
  externo?: boolean;
  descargar?: boolean;
};

export function Contacto({ t }: Props) {
  const filas: Fila[] = [
    {
      id: "email",
      etiqueta: t.contacto.email,
      valor: perfil.email,
      href: `mailto:${perfil.email}`,
      icono: ArrowUpRight,
    },
    {
      id: "telefono",
      etiqueta: t.contacto.telefono,
      valor: perfil.telefono,
      href: `tel:${perfil.telefonoEnlace}`,
      icono: ArrowUpRight,
    },
    {
      id: "linkedin",
      etiqueta: "LinkedIn",
      valor: perfil.linkedinVisible,
      href: perfil.linkedin,
      icono: ArrowUpRight,
      externo: true,
    },
    {
      id: "github",
      etiqueta: "GitHub",
      valor: `github.com/${perfil.githubUsuario}`,
      href: perfil.github,
      icono: ArrowUpRight,
      externo: true,
    },
    {
      id: "cv",
      etiqueta: "CV",
      valor: `${t.contacto.descargarCV} ${t.contacto.cvFormato}`,
      href: perfil.cv,
      icono: ArrowDown,
      descargar: true,
    },
  ];

  return (
    <Seccion
      id="contacto"
      numero="05"
      etiqueta={t.contacto.etiqueta}
      titulo={t.contacto.titulo}
    >
      <div className="grid gap-x-canal gap-y-14 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="text-t3 font-light uppercase text-texto">
            {t.contacto.bajada}
          </p>
          <p className="etiqueta mt-6">
            {t.contacto.ubicacion} · {perfil.ubicacion}
          </p>
          <BotonCorreo
            email={perfil.email}
            texto={t.contacto.botonCorreo}
            avisoCopiado={t.contacto.correoCopiado}
            avisoFallo={t.contacto.correoFallo}
            className="mt-10 w-full sm:w-auto"
          />
        </Reveal>

        {/* Filas enteras pulsables, como un índice: la etiqueta a la
            izquierda, el dato y la flecha que indica qué pasa al pulsar. */}
        <Reveal retardo={0.08} className="md:col-span-6 md:col-start-7">
          <ul className="border-t border-borde">
            {filas.map(
              ({ id, etiqueta, valor, href, icono: Icono, externo, descargar }) => (
                <li key={id} className="border-b border-borde">
                  <a
                    href={href}
                    {...(externo
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    {...(descargar ? { download: "" } : {})}
                    className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5 transition-colors sm:grid-cols-[6.5rem_1fr_auto]"
                  >
                    <span className="etiqueta">{etiqueta}</span>
                    <span className="break-words text-base text-texto transition-colors group-hover:text-acento sm:text-lg">
                      {valor}
                    </span>
                    <Icono
                      aria-hidden="true"
                      className="size-4 text-tenue transition-[color,transform] duration-200 group-hover:text-acento group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    {externo ? (
                      <span className="sr-only">
                        {t.proyectos.enlaceExterno}
                      </span>
                    ) : null}
                  </a>
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </div>
    </Seccion>
  );
}
