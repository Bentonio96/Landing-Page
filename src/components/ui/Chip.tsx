"use client";

import { cn } from "@/lib/utils";
import { estaActiva, useTecnologia } from "./ContextoTecnologia";

type Props = {
  children: string;
  /** Resalta la tecnología con el color de acento. */
  principal?: boolean;
  /**
   * Texto solo para lectores de pantalla que explica el resalte. Sin esto,
   * "principal" se transmitiría únicamente por color, que es justo lo que
   * prohíbe el criterio WCAG 1.4.1.
   */
  etiquetaPrincipal?: string;
  /**
   * Origen del chip. Los del stack activan el cruce al apuntarlos; los de
   * las tarjetas solo reaccionan.
   */
  origen?: "stack" | "proyecto";
  className?: string;
};

/** Etiqueta discreta para nombres de tecnologías. */
export function Chip({
  children,
  principal = false,
  etiquetaPrincipal,
  origen = "proyecto",
  className,
}: Props) {
  const ctx = useTecnologia();
  const resaltada = ctx ? estaActiva(ctx.activas, children) : false;

  // Solo los chips del stack disparan el cruce.
  const manejadores =
    origen === "stack" && ctx
      ? {
          onMouseEnter: () => ctx.activar([children], "stack"),
          onMouseLeave: ctx.limpiar,
        }
      : {};

  return (
    <li
      {...manejadores}
      data-resaltada={resaltada ? "" : undefined}
      className={cn(
        "rounded-chip border px-2.5 py-1 font-mono text-etiqueta tracking-wide",
        "transition-colors duration-200",
        principal
          ? "border-acento/40 bg-acentotenue text-acento"
          : "border-borde bg-elevado text-atenuado",
        // El cruce sube el chip al tratamiento de acento, sin bajar contraste
        resaltada && "border-acento bg-acentotenue text-acento",
        className,
      )}
    >
      {children}
      {principal && etiquetaPrincipal ? (
        <span className="sr-only"> — {etiquetaPrincipal}</span>
      ) : null}
    </li>
  );
}
