/** Recuerda que esta persona ya vio la obra entera. */
export const CLAVE_OBRA = "v4-obra-vista";

/**
 * Script bloqueante de <head>: decide antes del primer pintado cómo llega
 * la página.
 *
 *   • data-obra="completa" — primera visita: telón, logo y obra entera.
 *   • data-obra="breve"    — ya la vio: sin intro, solo se rearma el titular.
 *   • sin atributo         — movimiento reducido o sin JavaScript: armada.
 *
 * Red de seguridad: si el bundle no llega a tomar el control en 6 s (falla
 * de red, bloqueador), se quita el atributo y la página aparece armada.
 * Va en atributos data-* porque React gestiona className de <html>.
 * Debe ser ES5.
 */
export const scriptObra = `
(function () {
  try {
    var h = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var vista = null;
    try { vista = localStorage.getItem('${CLAVE_OBRA}'); } catch (e) {}
    h.setAttribute('data-obra', vista ? 'breve' : 'completa');
    setTimeout(function () {
      if (!h.hasAttribute('data-obra-viva')) h.removeAttribute('data-obra');
    }, 6000);
  } catch (e) {}
})();
`.trim();
