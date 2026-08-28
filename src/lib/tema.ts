export const CLAVE_TEMA = "tema-portafolio";

/** Atributo donde vive el tema. */
export const ATRIBUTO_TEMA = "data-tema";

/**
 * Se inyecta como script bloqueante en <head>, antes de pintar, para que no
 * haya destello de tema equivocado al cargar.
 *
 * El tema va en un atributo `data-tema` y NO en una clase de <html>: React
 * gestiona `className` y `lang` del elemento raíz, y al navegar entre
 * idiomas re-renderiza el root layout y reaplica `className`, lo que
 * borraba una clase añadida en runtime. Un atributo `data-*` que React no
 * conoce queda intacto.
 *
 * Debe ser ES5 y autoejecutable.
 */
export const scriptTema = `
(function () {
  try {
    var guardado = localStorage.getItem('${CLAVE_TEMA}');
    var oscuro = guardado === 'dark' ||
      (guardado !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('${ATRIBUTO_TEMA}', oscuro ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('${ATRIBUTO_TEMA}', 'light');
  }
})();
`.trim();
