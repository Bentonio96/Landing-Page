import { JetBrains_Mono, Saira } from "next/font/google";

/**
 * Saira es la voz de la v3: una grotesca de transmisión deportiva, variable
 * en peso y en ancho. Se pide dos veces, a propósito:
 *
 * - Recta y solo con el eje de peso, para leer. Es la única que se precarga:
 *   el párrafo del hero es el LCP en el teléfono.
 * - Itálica y con el eje de ancho, para los titulares expandidos (la
 *   velocidad). Pesa más (el eje de ancho la casi duplica) y no se precarga,
 *   así no compite con el texto en la ruta crítica.
 *
 * El nombre del hero no usa ninguna: es un tablero de LED dibujado en un
 * canvas con una tipografía de matriz propia (ver lib/matriz.ts).
 */
export const fuenteSaira = Saira({
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
  display: "swap",
  variable: "--fuente-saira",
});

export const fuenteSairaTitular = Saira({
  subsets: ["latin"],
  weight: "variable",
  style: "italic",
  axes: ["wdth"],
  display: "swap",
  preload: false,
  variable: "--fuente-titular",
});

/**
 * La voz de la radio y de la telemetría. Con `adjustFontFallback: false` el
 * respaldo es una mono de verdad: con Arial estirada las líneas de
 * telemetría envolvían distinto y la página saltaba al llegar la fuente.
 */
export const fuenteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fuente-mono",
  adjustFontFallback: false,
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const clasesFuentes = `${fuenteSaira.variable} ${fuenteSairaTitular.variable} ${fuenteMono.variable}`;
