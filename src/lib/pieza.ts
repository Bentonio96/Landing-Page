export type TipoPieza = "texto" | "caja";

/**
 * Marca un elemento como una capa que arma un agente.
 *
 * `etiqueta` es lo que aparece en el marco de selección («h1», «tarjeta»).
 * Las de texto el agente las escribe línea a línea; las cajas las dibuja
 * desde la esquina (ver la sección «La obra» de globals.css y motor.ts).
 */
export function pieza(etiqueta: string, tipo: TipoPieza = "texto") {
  return { "data-pieza": etiqueta, "data-tipo": tipo };
}
