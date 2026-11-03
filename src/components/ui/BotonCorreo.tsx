"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvisos } from "./Avisos";

type Props = {
  email: string;
  texto: string;
  avisoCopiado: string;
  avisoFallo: string;
  className?: string;
};

/**
 * Copia la dirección de correo y lo avisa. Es un botón y no un `mailto:`
 * porque `mailto:` depende de tener un cliente de correo configurado; la
 * dirección de la ficha sigue siendo un enlace para quien sí lo tiene.
 */
export function BotonCorreo({ email, texto, avisoCopiado, avisoFallo, className }: Props) {
  const avisos = useAvisos();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
      avisos?.avisar(avisoCopiado);
    } catch {
      avisos?.avisar(`${avisoFallo} ${email}`);
    }
  }

  return (
    <button type="button" onClick={copiar} className={cn("boton boton-primario", className)}>
      <Mail aria-hidden="true" className="size-4" />
      {texto}
    </button>
  );
}
