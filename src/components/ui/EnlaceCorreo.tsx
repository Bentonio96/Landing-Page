"use client";

import type { MouseEvent, ReactNode } from "react";
import { useAvisos } from "./Avisos";

type Props = {
  email: string;
  /** Mensaje del aviso flotante tras copiar. */
  avisoCopiado: string;
  /** Mensaje alternativo si el portapapeles no está disponible. */
  avisoFallo: string;
  className?: string;
  children: ReactNode;
};

/**
 * Enlace de correo que copia la dirección en escritorio y abre la app de
 * correo en el teléfono.
 *
 * Un `mailto:` a secas depende de que haya un cliente de correo configurado.
 * En un teléfono casi siempre lo hay; en un PC con Windows casi nunca, y
 * Edge o Chrome abren una pestaña en blanco titulada "Sin título" con la
 * dirección en la barra. Así que:
 *
 * - Con puntero fino (ratón o trackpad) se intercepta el clic y se copia la
 *   dirección, con el mismo aviso que el botón "Copiar mi correo".
 * - Con puntero táctil el enlace sigue su curso y abre la app de correo.
 * - Sin JavaScript sigue siendo un `mailto:` normal: nunca queda muerto.
 *
 * El icono y el texto para lectores de pantalla cambian con la misma media
 * query (pointer-fine), así que lo que el enlace promete coincide con lo que
 * hace en cada dispositivo.
 */
export function EnlaceCorreo({
  email,
  avisoCopiado,
  avisoFallo,
  className,
  children,
}: Props) {
  const avisos = useAvisos();

  async function alPulsar(evento: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    evento.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      avisos?.avisar(avisoCopiado);
    } catch {
      avisos?.avisar(`${avisoFallo} ${email}`);
    }
  }

  return (
    <a href={`mailto:${email}`} onClick={alPulsar} className={className}>
      {children}
    </a>
  );
}
