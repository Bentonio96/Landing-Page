export const CLAVE_TEMA = "tema-portafolio";

/**
 * Se inyecta como script bloqueante en <head>, antes de pintar.
 * Evita el destello de tema equivocado al cargar (FOUC).
 * Debe ser ES5 y autoejecutable.
 */
export const scriptTema = `
(function () {
  try {
    var guardado = localStorage.getItem('${CLAVE_TEMA}');
    var prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (guardado === 'dark' || (guardado !== 'light' && prefiereOscuro)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`.trim();
