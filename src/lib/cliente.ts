"use client";

import { ATRIBUTO_TEMA, CLAVE_TEMA } from "@/lib/tema";

/**
 * Acciones de página que comparten la radio, los atajos y los botones:
 * saltar de sector, cambiar la luz y abrir la radio.
 */

type Desplazador = { scrollTo: (destino: HTMLElement, opciones?: { offset?: number }) => void };
let desplazador: Desplazador | null = null;

/** Movimiento.tsx registra aquí su Lenis; sin él se usa el scroll nativo. */
export function registrarDesplazador(d: Desplazador | null) {
  desplazador = d;
}

export const sinMovimiento = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lleva la vista a un sector y le pasa el foco a su titular, para que el
 * teclado y el lector de pantalla sigan desde ahí y no desde arriba.
 */
export function irA(id: string, { enfocar = true } = {}) {
  const destino = document.getElementById(id);
  if (!destino) return;
  if (desplazador) desplazador.scrollTo(destino);
  else destino.scrollIntoView({ behavior: sinMovimiento() ? "auto" : "smooth", block: "start" });
  if (enfocar) {
    const titular = destino.matches("h1,h2,h3")
      ? destino
      : destino.querySelector<HTMLElement>("h1, h2, h3");
    titular?.setAttribute("tabindex", "-1");
    titular?.focus({ preventScroll: true });
  }
  history.replaceState(null, "", id === "parrilla" ? location.pathname : `#${id}`);
}

/** Cambia la luz de la pista, con un barrido circular desde `origen`. */
export function alternarTema(origen?: { x: number; y: number }) {
  const html = document.documentElement;
  const siguiente = html.getAttribute(ATRIBUTO_TEMA) === "dark" ? "light" : "dark";
  const aplicar = () => {
    html.setAttribute(ATRIBUTO_TEMA, siguiente);
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {}
    window.dispatchEvent(new Event("v3:tema"));
  };

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (!doc.startViewTransition || sinMovimiento()) return aplicar();

  const x = origen?.x ?? innerWidth / 2;
  const y = origen?.y ?? 0;
  const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc.startViewTransition(aplicar).ready.then(() => {
    html.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

export const temaActual = () =>
  document.documentElement.getAttribute(ATRIBUTO_TEMA) === "dark" ? "dark" : "light";

/** Abre la radio, opcionalmente con una pregunta ya enviada. */
export function abrirRadio(pregunta?: string) {
  window.dispatchEvent(new CustomEvent("v3:radio", { detail: { pregunta } }));
}

// --- Atajos de teclado (se pueden apagar: WCAG 2.1.4) ---------------------

const CLAVE_ATAJOS = "v3-atajos";
const oyentesAtajos = new Set<() => void>();

export function atajosActivos(): boolean {
  try {
    return localStorage.getItem(CLAVE_ATAJOS) !== "off";
  } catch {
    return true;
  }
}

export function alternarAtajos(): boolean {
  const activos = !atajosActivos();
  try {
    localStorage.setItem(CLAVE_ATAJOS, activos ? "on" : "off");
  } catch {}
  oyentesAtajos.forEach((o) => o());
  return activos;
}

export function suscribirAtajos(oyente: () => void) {
  oyentesAtajos.add(oyente);
  return () => oyentesAtajos.delete(oyente);
}
