import { Archivo, JetBrains_Mono } from "next/font/google";

/**
 * Una sola familia con dos voces, más una mono para la voz de terminal.
 *
 * Archivo es variable en peso y en ancho. El titular «< Software Engineer />»
 * y los títulos de sección van anchos (wdth 118–125) y pesados, como el reel;
 * el cuerpo va al ancho normal. Así el carácter sale del eje de ancho y no de
 * sumar una segunda familia.
 */
export const fuenteSans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fuente-sans",
});

/**
 * La mono es la voz de terminal: el código del fondo del hero, la etiqueta
 * entre llaves y la ruta de la píldora. Con `adjustFontFallback: false` cae a
 * monoespaciadas de verdad, cuyo avance es casi el de JetBrains Mono (el
 * respaldo automático estira Arial y hacía envolver las líneas).
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fuente-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const clasesFuentes = `${fuenteSans.variable} ${fuenteMono.variable}`;

/**
 * Retiene la entrada de las letras del titular hasta que carga Archivo: cada
 * letra es su propia caja y con la fuente de respaldo quedan en otro sitio.
 * Mientras espera, la animación está en su primer fotograma (en pausa). Sin
 * JS nunca se pone el atributo; si la fuente tarda, a los 2 s se suelta igual.
 * Debe ser ES5.
 */
export const scriptFuentes = `
(function () {
  try {
    var h = document.documentElement;
    h.setAttribute('data-js', '');
    if (/[?&]reduced=1/.test(location.search)) h.setAttribute('data-reducido', '');
    if (!document.fonts || !document.fonts.load) return;
    h.setAttribute('data-fuentes', 'pendientes');
    var hecho = false;
    var listo = function () {
      if (hecho) return;
      hecho = true;
      h.removeAttribute('data-fuentes');
    };
    setTimeout(listo, 1200);
    var cargar = function () {
      document.fonts.load('800 1em ' + ${JSON.stringify(fuenteSans.style.fontFamily)})
        .then(function () { return document.fonts.ready; })
        .then(listo, listo);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cargar);
    } else {
      cargar();
    }
  } catch (e) {}
})();
`.trim();
