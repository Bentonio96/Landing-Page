/** Une clases condicionales sin traer dependencias extra. */
export function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

/** Construye un enlace mailto: con asunto y cuerpo ya codificados. */
export function enlaceCorreo(
  email: string,
  asunto: string,
  cuerpo: string,
): string {
  return `mailto:${email}?subject=${encodeURIComponent(
    asunto,
  )}&body=${encodeURIComponent(cuerpo)}`;
}
