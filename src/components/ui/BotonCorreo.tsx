"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail } from "lucide-react";
import { Boton } from "./Boton";

type Props = {
  href: string;
  email: string;
  texto: string;
  avisoCopiado: string;
  variante?: "primario" | "secundario";
  className?: string;
};

/**
 * CTA de correo, con red de seguridad.
 *
 * `mailto:` no hace absolutamente nada si quien visita no tiene un cliente de
 * correo configurado — muy común en Windows con Gmail en una pestaña. El clic
 * falla en silencio, que en la sección de contacto de un portafolio es el peor
 * lugar posible para un fallo silencioso.
 *
 * Al pulsar se copia además la dirección al portapapeles y se avisa, así que
 * si el cliente no se abre la dirección ya está lista para pegar. El enlace
 * sigue siendo un <a href="mailto:"> normal: funciona sin JavaScript y se
 * puede copiar con el botón derecho.
 *
 * El aviso se posiciona fuera del flujo a propósito: si empujara el contenido
 * de abajo al aparecer, movería la página bajo el dedo de quien acaba de
 * pulsar.
 */
export function BotonCorreo({
  href,
  email,
  texto,
  avisoCopiado,
  variante = "primario",
  className,
}: Props) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  async function alPulsar() {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setCopiado(false), 6000);
    } catch {
      // Sin permiso de portapapeles o sin soporte: el mailto sigue su curso
      // y la dirección está visible más arriba, en la ficha de contacto.
    }
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <Boton
        href={href}
        variante={variante}
        onClick={alPulsar}
        className="w-full sm:w-auto"
      >
        <Mail aria-hidden="true" className="size-4" />
        {texto}
      </Boton>

      {/* role="status" lo anuncia sin robar el foco */}
      <p
        role="status"
        aria-live="polite"
        className={`absolute left-0 top-full mt-3 flex w-max max-w-[min(20rem,80vw)] items-start gap-2 text-menor text-atenuado transition-opacity duration-300 ${
          copiado ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {copiado ? (
          <>
            <Check aria-hidden="true" className="size-4 shrink-0 text-acento" />
            {avisoCopiado}
          </>
        ) : null}
      </p>
    </div>
  );
}
