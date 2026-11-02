"use client";

import { abrirRadio } from "@/lib/cliente";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  pregunta?: string;
  className?: string;
};

/** Cualquier botón que abre la radio, opcionalmente con una pregunta. */
export function BotonRadio({ children, pregunta, className }: Props) {
  return (
    <button type="button" onClick={() => abrirRadio(pregunta)} className={cn(className)}>
      {children}
    </button>
  );
}
