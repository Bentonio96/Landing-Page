"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvisos } from "./Avisos";

type Props = {
  email: string;
  texto: string;
  /** Mensaje del aviso flotante tras copiar. */
  avisoCopiado: string;
  /** Mensaje alternativo si el portapapeles no está disponible. */
  avisoFallo: string;
  variante?: "primario" | "secundario";
  className?: string;
};

const base =
  "group/boton inline-flex items-center justify-center gap-2 rounded-control " +
  "px-5 py-3 font-mono text-etiqueta uppercase tracking-[0.12em] " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-acento";

const variantes = {
  primario: "bg-acento text-acentosobre hover:bg-acentohover",
  secundario:
    "border border-bordefuerte text-texto hover:border-acento hover:text-acento",
} as const;

/**
 * Copia la dirección de correo y lo avisa.
 *
 * Es un <button> y no un enlace `mailto:` a propósito. `mailto:` depende de
 * que quien visita tenga un cliente de correo configurado: si no lo tiene
 * —muy común— el navegador abre una pestaña inútil o directamente no pasa
 * nada. Copiar la dirección funciona siempre y en cualquier dispositivo.
 *
 * Para quien sí prefiere abrir su cliente, la dirección de la ficha de
 * contacto sigue siendo un enlace `mailto:` normal.
 */
export function BotonCorreo({
  email,
  texto,
  avisoCopiado,
  avisoFallo,
  variante = "primario",
  className,
}: Props) {
  const avisos = useAvisos();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
      avisos?.avisar(avisoCopiado);
    } catch {
      // Sin permiso de portapapeles, en contexto inseguro o sin soporte:
      // se muestra la dirección para que se pueda copiar a mano.
      avisos?.avisar(`${avisoFallo} ${email}`);
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className={cn(base, variantes[variante], className)}
    >
      <Mail aria-hidden="true" className="size-4" />
      {texto}
    </button>
  );
}
