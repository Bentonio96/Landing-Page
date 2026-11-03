import type { CSSProperties } from "react";

export type TipoPieza = "texto" | "caja";

/** FNV-1a: el mismo id da siempre el mismo desorden, en servidor y cliente. */
function hash(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Marca un elemento como una capa que arma un agente.
 *
 * `etiqueta` es lo que aparece en el marco de selección («h1», «tarjeta»).
 * El desorden inicial (desplazamiento y giro) sale de un hash del `id` y no
 * de Math.random: así el HTML del servidor y el del cliente coinciden y no
 * hay error de hidratación.
 *
 * Las piezas de texto tienen que ser block o inline-block para que el
 * transform aplique.
 */
export function pieza(
  id: string,
  etiqueta: string,
  tipo: TipoPieza = "texto",
): Record<string, string | CSSProperties> {
  const h = hash(id);
  const dx = (h % 221) - 110;
  const dy = (((h >>> 8) % 2 === 0 ? 1 : -1) * (36 + ((h >>> 10) % 90)));
  const rot = ((h >>> 18) % 11) - 5;
  return {
    "data-pieza": etiqueta,
    "data-tipo": tipo,
    style: {
      "--dx": `${dx}px`,
      "--dy": `${dy}px`,
      "--rot": `${rot}deg`,
    } as CSSProperties,
  };
}
