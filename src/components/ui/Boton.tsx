import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario";

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  /** Abre en pestaña nueva y añade el aviso para lectores de pantalla. */
  externo?: boolean;
  /** Texto accesible completo, si el visible no basta por sí solo. */
  etiquetaAccesible?: string;
  avisoExterno?: string;
  className?: string;
};

const base =
  "group/boton inline-flex items-center justify-center gap-2 rounded-pieza " +
  "px-5 py-3 font-mono text-etiqueta uppercase tracking-[0.12em] " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acento";

const variantes: Record<Variante, string> = {
  primario:
    "bg-acento text-acentosobre hover:bg-acentohover",
  secundario:
    "border border-bordefuerte text-texto hover:border-acento hover:text-acento",
};

export function Boton({
  href,
  children,
  variante = "primario",
  externo = false,
  etiquetaAccesible,
  avisoExterno,
  className,
}: Props) {
  return (
    <a
      href={href}
      aria-label={etiquetaAccesible}
      {...(externo
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(base, variantes[variante], className)}
    >
      {children}
      {externo && avisoExterno ? (
        <span className="sr-only"> {avisoExterno}</span>
      ) : null}
    </a>
  );
}
