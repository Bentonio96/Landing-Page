"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { estaActiva, useTecnologia } from "./ContextoTecnologia";

type Props = {
  tecnologias: string[];
  children: ReactNode;
  className?: string;
};

/**
 * Envoltura de la tarjeta de proyecto para el cruce con el stack.
 *
 * Se separa del contenido de la tarjeta a propósito: así solo este envoltorio
 * viaja al cliente y `TarjetaProyecto` sigue siendo un componente de servidor.
 *
 * Reacciona a foco además de al puntero, de modo que quien navega con teclado
 * también ve resaltarse en el stack las tecnologías del proyecto que está
 * recorriendo.
 *
 * El resalte SUMA (marco de acento alrededor de la captura, ver
 * .marco-captura en globals.css) en vez de atenuar el resto: bajar la
 * opacidad de lo no coincidente reduciría el contraste del texto.
 */
export function ResaltableProyecto({
  tecnologias,
  children,
  className,
}: Props) {
  const ctx = useTecnologia();

  // Solo se marca la tarjeta cuando el cruce viene del stack; si viniera de
  // otra tarjeta se encenderían varias a la vez y sería ruido.
  const resaltada =
    ctx?.origen === "stack" &&
    tecnologias.some((t) => estaActiva(ctx.activas, t));

  const manejadores = ctx
    ? {
        onMouseEnter: () => ctx.activar(tecnologias, "proyecto"),
        onMouseLeave: ctx.limpiar,
        onFocus: () => ctx.activar(tecnologias, "proyecto"),
        onBlur: ctx.limpiar,
      }
    : {};

  return (
    <div
      {...manejadores}
      data-resaltada={resaltada ? "" : undefined}
      className={cn("block w-full", className)}
    >
      {children}
    </div>
  );
}
