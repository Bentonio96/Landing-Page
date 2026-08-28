/**
 * Capa de auras del fondo.
 *
 * Va detrás de todo con z-index negativo, lo que exige que el color de
 * fondo viva en <html> y no en <body> (ver globals.css). Es puramente
 * decorativa: sin contenido y oculta a lectores de pantalla.
 */
export function Ambiente() {
  return <div aria-hidden="true" className="ambiente" />;
}
