import { Bebas_Neue, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Las tres se sirven autoalojadas por next/font: cero requests a Google en
 * producción y `size-adjust` automático en la fuente de respaldo, que es lo
 * que evita el salto de layout mientras cargan.
 *
 * Solo se pide lo que el sistema de diseño usa de verdad. Cada peso extra son
 * ~20 KB en la ruta crítica compitiendo con la foto del hero por ancho de
 * banda, y eso empuja el LCP en móvil.
 */

/**
 * Titulares. Una grotesca condensada de un solo peso: a tamaño de cartel es
 * lo que da el impacto, y al ser estrecha deja escribir el nombre enorme sin
 * que desborde en un teléfono. Solo tiene mayúsculas, así que los titulares
 * se escriben normal en el diccionario y se versalizan con CSS: los lectores
 * de pantalla siguen leyendo "Quién soy" y no "QUIÉN SOY" deletreado.
 */
export const fuenteDisplay = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--fuente-display",
});

/** Cuerpo. El 300 es para los subtítulos grandes y ligeros de las filas. */
export const fuenteSans = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--fuente-sans",
});

/**
 * La mono es el único caso donde el respaldo automático de next/font hace
 * daño. Lo genera a partir de `local("Arial")` con `size-adjust: 134.59%`:
 * ajusta las métricas verticales, pero Arial es proporcional y estirarla un
 * 35 % deja cada carácter casi un 30 % más ancho que JetBrains Mono. Las
 * líneas largas de versales del hero envolvían con el respaldo y se
 * recolocaban al llegar la tipografía real, que es de donde salía el CLS
 * en móvil.
 *
 * Con `adjustFontFallback: false` se cae a monoespaciadas de verdad, cuyo
 * avance (~0.6em) es prácticamente el de JetBrains Mono. Se pierde el ajuste
 * vertical automático, pero aquí no hace falta: todo lo que usa la mono
 * declara su propio line-height en globals.css.
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--fuente-mono",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "monospace",
  ],
});

export const clasesFuentes = `${fuenteDisplay.variable} ${fuenteSans.variable} ${fuenteMono.variable}`;

/**
 * Script bloqueante de <head> que retiene la entrada 3D del nombre hasta que
 * carga la condensada.
 *
 * Cada letra del hero es su propia caja. Con la fuente de respaldo (más
 * ancha) ocupan otro sitio, y al llegar Bebas Neue todas se recolocaban de
 * golpe: el CLS subía de 0.002 a 0.03. Mientras dura la espera las letras
 * están de canto (el primer fotograma de la animación, en pausa), así que
 * no se ven ni cuentan como desplazamiento visible.
 *
 * Tres redes: sin JavaScript el atributo nunca se pone y la animación corre
 * sola; si la fuente falla o tarda, a los 2 s se suelta igual; y va en un
 * atributo data-* y no en una clase, porque React gestiona el className de
 * <html> (ver lib/tema.ts).
 *
 * `document.fonts.load` se llama en DOMContentLoaded y no antes: hasta que
 * el CSS está aplicado el @font-face no existe y la promesa se resolvería al
 * instante, sin esperar nada. Debe ser ES5.
 */
export const scriptFuentes = `
(function () {
  try {
    var h = document.documentElement;
    if (!document.fonts || !document.fonts.load) return;
    h.setAttribute('data-fuentes', 'pendientes');
    var hecho = false;
    var listo = function () {
      if (hecho) return;
      hecho = true;
      h.removeAttribute('data-fuentes');
    };
    setTimeout(listo, 2000);
    var cargar = function () {
      document.fonts.load('1em ' + ${JSON.stringify(fuenteDisplay.style.fontFamily)})
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
