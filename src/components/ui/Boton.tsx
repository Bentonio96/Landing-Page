import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * primario  — CTA sólido, tinta sobre papel (o al revés en oscuro). Uno por
 *             sección como máximo.
 * acento    — destacado sin llenar: borde y texto en acento. Para acciones
 *             importantes que no son EL CTA.
 * secundario— neutro.
 * enlace    — texto subrayado sin caja, para las filas editoriales.
 *
 * Todas llevan el barrido de color al apuntar (.boton-barrido en
 * globals.css): --barrido es el color que entra y --barrido-texto el del
 * texto encima. Los neutros se llenan de tinta; el primario, que ya es
 * tinta, se llena de violeta.
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
// conflictos, así que un px-6 en la base le ganaría al px-3 del enlace.
const base =
  "boton-barrido group/boton inline-flex items-center justify-center gap-2 rounded-control " +
  "font-mono text-etiqueta uppercase tracking-[0.12em] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acento";

const caja = "border px-6 py-3.5";

const variantes: Record<Variante, string> = {
  primario: `${caja} border-texto bg-texto text-fondo [--barrido:var(--c-acento)] [--barrido-texto:var(--c-acento-sobre)]`,
  acento: `${caja} border-acento text-acento [--barrido:var(--c-acento)] [--barrido-texto:var(--c-acento-sobre)]`,
  secundario: `${caja} border-bordefuerte text-texto [--barrido:var(--c-texto)] [--barrido-texto:var(--c-fondo)]`,
  enlace:
    "rounded-none border-b border-bordefuerte px-3 py-2 text-texto [--barrido:var(--c-texto)] [--barrido-texto:var(--c-fondo)]",
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
