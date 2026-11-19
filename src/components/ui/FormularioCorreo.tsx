"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { enlaceCorreo } from "@/lib/utils";
import { useAvisos } from "./Avisos";

type Props = { email: string; t: Diccionario };

/**
 * El formulario del reel que arma un borrador: no envía nada a ningún
 * servidor. Junta nombre, correo y mensaje en un enlace mailto: y abre el
 * programa de correo de quien visita con todo escrito.
 */
export function FormularioCorreo({ email, t }: Props) {
  const f = t.contacto.formulario;
  const id = useId();
  const avisos = useAvisos();
  const [error, setError] = useState(false);

  function crear(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const correo = String(datos.get("correo") ?? "").trim();
    const mensaje = String(datos.get("mensaje") ?? "").trim();
    if (!mensaje) {
      setError(true);
      e.currentTarget.querySelector<HTMLTextAreaElement>("textarea")?.focus();
      return;
    }
    setError(false);
    const firma = [nombre, correo].filter(Boolean).join("\n");
    const cuerpo = `${t.contacto.saludoCorreo}\n\n${mensaje}\n\n${firma}`.trim();
    window.location.href = enlaceCorreo(email, t.contacto.asuntoCorreo, cuerpo);
    avisos?.avisar(f.abierto);
  }

  const campo =
    "mt-2 w-full rounded-md border border-bordefuerte bg-superficie px-3.5 py-3 text-base text-texto placeholder:text-tenue transition-colors hover:border-texto focus:border-acento focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento";

  return (
    <form onSubmit={crear} noValidate className="grid gap-5 rounded-xl border border-borde bg-superficie/60 p-5 sm:grid-cols-2 sm:p-7">
      <div>
        <label htmlFor={`${id}-n`} className="text-menor font-semibold">
          {f.nombre}
        </label>
        <input id={`${id}-n`} name="nombre" autoComplete="name" className={campo} />
      </div>
      <div>
        <label htmlFor={`${id}-c`} className="text-menor font-semibold">
          {f.correo}
        </label>
        <input id={`${id}-c`} name="correo" type="email" autoComplete="email" placeholder={f.correoEjemplo} className={campo} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-m`} className="text-menor font-semibold">
          {f.mensaje}
        </label>
        <textarea
          id={`${id}-m`}
          name="mensaje"
          rows={5}
          placeholder={f.mensajeEjemplo}
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-e` : `${id}-x`}
          className={`${campo} resize-y`}
          onInput={() => error && setError(false)}
        />
        {error ? (
          <p id={`${id}-e`} className="mt-2 text-menor font-semibold text-acento">
            {f.falta}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
        <p id={`${id}-x`} className="max-w-[34ch] text-menor text-atenuado">
          {f.nota}
        </p>
        <button type="submit" className="boton boton--lleno">
          {f.enviar}
          <ArrowUpRight aria-hidden="true" className="flecha size-4" />
        </button>
      </div>
    </form>
  );
}
