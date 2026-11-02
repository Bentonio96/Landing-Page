"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = { email: string; texto: string; copiado: string; fallo: string };

/**
 * Copia el correo. Un botón y no un `mailto:` porque copiar funciona en
 * cualquier equipo, tenga o no un cliente de correo configurado; el
 * `mailto:` sigue disponible en la dirección escrita al lado.
 */
export function BotonCorreo({ email, texto, copiado, fallo }: Props) {
  const [aviso, setAviso] = useState("");

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setAviso(copiado);
          } catch {
            setAviso(`${fallo} ${email}`);
          }
        }}
        className="barrido inline-flex h-14 items-center gap-3 border border-tinta bg-tinta px-6 font-mono text-etiqueta uppercase tracking-[0.12em] text-papel [--barrido:var(--c-morado)] hover:border-morado hover:text-sobremorado"
      >
        {aviso === copiado ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
        {texto}
      </button>
      <p role="status" className="min-h-[1.5em] font-mono text-etiqueta text-senal">
        {aviso}
      </p>
    </div>
  );
}
