"use client";

import { Copy } from "lucide-react";
import { useAvisos } from "./Avisos";

type Props = { email: string; texto: string; avisoCopiado: string; avisoFallo: string };

/** Copia el correo: funciona aunque no haya un cliente de correo configurado. */
export function BotonCopiar({ email, texto, avisoCopiado, avisoFallo }: Props) {
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
    <button type="button" onClick={copiar} aria-label={texto} title={texto} className="boton size-11 p-0">
      <Copy aria-hidden="true" className="size-4" />
    </button>
  );
}
