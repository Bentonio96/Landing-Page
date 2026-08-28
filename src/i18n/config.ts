import type { Idioma } from "@/types";

export const IDIOMAS = ["es", "en"] as const;

/** Idioma por defecto: se sirve en la raíz `/`, sin prefijo visible. */
export const IDIOMA_POR_DEFECTO: Idioma = "es";

/** Valida un segmento de ruta desconocido. */
export function esIdioma(valor: string): valor is Idioma {
  return (IDIOMAS as readonly string[]).includes(valor);
}

/** Ruta pública de la página en un idioma dado. */
export function rutaDe(idioma: Idioma): string {
  return idioma === IDIOMA_POR_DEFECTO ? "/" : `/${idioma}`;
}

/** El otro idioma, para el switch. */
export function idiomaAlterno(idioma: Idioma): Idioma {
  return idioma === "es" ? "en" : "es";
}
