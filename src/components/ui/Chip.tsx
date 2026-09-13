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
        "inline-flex items-center gap-2 rounded-chip border px-3.5 py-1.5 text-sm",
        "transition-colors duration-200",
        // Principal: texto a tinta plena y un punto de acento. El punto hace
        // que la diferencia no dependa solo del tono del texto.
        resaltada
          ? "border-acento text-acento"
          : principal
            ? "border-bordefuerte text-texto"
            : "border-borde text-atenuado",
        className,
      )}
    >
      {principal ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-acentovivo" />
      ) : null}
      {children}
      {principal && etiquetaPrincipal ? (
        <span className="sr-only"> — {etiquetaPrincipal}</span>
      ) : null}
    </li>
  );
}
