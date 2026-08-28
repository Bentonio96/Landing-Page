import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * primario  — CTA sólido. Uno por sección como máximo.
 * acento    — destacado sin llenar: borde y texto en acento sobre fondo
 *             teñido. Para acciones importantes que no son EL CTA.
 * secundario— neutro.
 */
type Variante = "primario" | "acento" | "secundario";

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

const base =
  "group/boton inline-flex items-center justify-center gap-2 rounded-control " +
  "px-5 py-3 font-mono text-etiqueta uppercase tracking-[0.12em] " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acento";

const variantes: Record<Variante, string> = {
  primario: "bg-acento text-acentosobre hover:bg-acentohover",
  acento:
    "border border-acento/45 bg-acentotenue text-acento hover:border-acento hover:bg-acento hover:text-acentosobre",
  secundario:
    "border border-bordefuerte text-texto hover:border-acento hover:text-acento",
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
