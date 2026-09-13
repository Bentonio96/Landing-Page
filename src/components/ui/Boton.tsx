import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * primario  — CTA sólido, tinta sobre papel (o al revés en oscuro). Pasa al
 *             acento al apuntarlo. Uno por sección como máximo.
 * acento    — destacado sin llenar: borde y texto en acento. Para acciones
 *             importantes que no son EL CTA.
 * secundario— neutro.
 * enlace    — texto subrayado sin caja, para las filas editoriales.
 */
type Variante = "primario" | "acento" | "secundario" | "enlace";

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  /** Abre en pestaña nueva y añade el aviso para lectores de pantalla. */
  externo?: boolean;
  /** Fuerza la descarga en vez de abrir el archivo en el navegador. */
  descargar?: boolean;
  /** Texto accesible completo, si el visible no basta por sí solo. */
  etiquetaAccesible?: string;
  avisoExterno?: string;
  /** Acción extra al pulsar; no reemplaza la navegación del enlace. */
  onClick?: () => void;
  className?: string;
};

// El relleno va en cada variante y no aquí: `cn` solo concatena, no resuelve
// conflictos, así que un px-5 en la base le ganaría al px-0 del enlace.
const base =
  "group/boton inline-flex items-center justify-center gap-2 rounded-control " +
  "font-mono text-etiqueta uppercase tracking-[0.12em] " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acento";

const caja = "border px-6 py-3.5";

const variantes: Record<Variante, string> = {
  primario: `${caja} border-texto bg-texto text-fondo hover:border-acento hover:bg-acento hover:text-acentosobre`,
  acento: `${caja} border-acento text-acento hover:bg-acento hover:text-acentosobre`,
  secundario: `${caja} border-bordefuerte text-texto hover:border-texto`,
  enlace:
    "rounded-none border-b border-bordefuerte py-2 text-texto hover:border-acento hover:text-acento",
};

export function Boton({
  href,
  children,
  variante = "primario",
  externo = false,
  descargar = false,
  etiquetaAccesible,
  avisoExterno,
  onClick,
  className,
}: Props) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={etiquetaAccesible}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(descargar ? { download: "" } : {})}
      className={cn(base, variantes[variante], className)}
    >
      {children}
      {externo && avisoExterno ? (
        <span className="sr-only"> {avisoExterno}</span>
      ) : null}
    </a>
  );
}
