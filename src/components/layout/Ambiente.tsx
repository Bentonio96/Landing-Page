/**
 * Capa de grano del fondo, fija detrás de todo el contenido.
 *
 * Va con z-index negativo, lo que exige que el color de fondo viva en <html>
 * y no en <body> (ver globals.css). Es puramente decorativa: sin contenido y
 * oculta a lectores de pantalla.
 *
 * Antes llevaba además unas auras con paralaje según el puntero. Con el fondo
 * casi negro del diseño actual no se distinguían del plano, así que se fueron
 * junto con el JavaScript que las movía: esto ya es un componente de servidor.
 */
export function Ambiente() {
  return <div aria-hidden="true" className="grano" />;
}
