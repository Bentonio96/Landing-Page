"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  correo: string;
  etiqueta: string;
  copiado: string;
  fallo: string;
};

/** Copia el correo y lo anuncia en una región viva. */
export function CopiarCorreo({ correo, etiqueta, copiado, fallo }: Props) {
  const [estado, setEstado] = useState<"" | "ok" | "error">("");

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo);
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={copiar}
        className="etiqueta inline-flex min-h-11 items-center gap-2 border border-sobreasfalto px-4 text-sobreasfalto hover:bg-sobreasfalto hover:text-asfalto"
      >
        {estado === "ok" ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
        {etiqueta}
      </button>
      <p role="status" className="micro mt-2 min-h-[1.5em]">
        {estado === "ok" ? copiado : estado === "error" ? `${fallo} ${correo}` : ""}
      </p>
    </div>
  );
}
