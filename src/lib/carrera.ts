"use client";

import { useSyncExternalStore } from "react";

/**
 * La vuelta de quien visita: cuándo empezó, a qué sector llegó y cuándo,
 * y cuál es su mejor marca. Un store mínimo para useSyncExternalStore: el
 * HUD, la radio y el box leen de aquí sin un proveedor de React encima.
 *
 * Los parciales son tiempos de paso (desde la largada hasta entrar al
 * sector), como los intermedios de la televisión. La marca se compara con
 * la mejor guardada: morado si la mejora, ámbar si no. En la primera vuelta
 * no hay con qué comparar y todo sale morado, que es lo justo.
 */

export const SECTORES = ["piloto", "garage", "sistemas", "tiempos", "box"] as const;
export type Sector = (typeof SECTORES)[number];

export type Estado = {
  /** Instante de largada, en ms de performance.now(). */
  inicio: number;
  /** Sector que ocupa la vista, o null en la parrilla (hero). */
  actual: Sector | null;
  /** Tiempo de paso por cada sector, en ms desde la largada. */
  pasos: Partial<Record<Sector, number>>;
  /** Tiempo final, al llegar al box. */
  final: number | null;
  /** Mejores marcas guardadas antes de esta vuelta. */
  mejores: Partial<Record<Sector, number>> & { vuelta?: number };
  /** Cuántas vueltas completas lleva en este navegador. */
  vueltas: number;
};

const CLAVE = "v3-vuelta";

let estado: Estado = {
  inicio: 0,
  actual: null,
  pasos: {},
  final: null,
  mejores: {},
  vueltas: 0,
};
const oyentes = new Set<() => void>();

function emitir(siguiente: Estado) {
  estado = siguiente;
  oyentes.forEach((o) => o());
}

export function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export const leer = () => estado;

const ESTADO_SERVIDOR = estado;
export const leerServidor = () => ESTADO_SERVIDOR;

function leerGuardado(): Pick<Estado, "mejores" | "vueltas"> {
  try {
    const dato = JSON.parse(localStorage.getItem(CLAVE) ?? "{}");
    return { mejores: dato.mejores ?? {}, vueltas: dato.vueltas ?? 0 };
  } catch {
    return { mejores: {}, vueltas: 0 };
  }
}

function guardar(mejores: Estado["mejores"], vueltas: number) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ mejores, vueltas }));
  } catch {
    // Navegación privada o almacenamiento bloqueado: la vuelta sigue, solo
    // no se recuerda.
  }
}

export function largar() {
  emitir({
    ...estado,
    ...leerGuardado(),
    inicio: performance.now(),
    pasos: {},
    final: null,
  });
}

export function entrarA(sector: Sector | null) {
  if (sector === estado.actual) return;
  const ahora = performance.now() - estado.inicio;
  const pasos = { ...estado.pasos };
  const { mejores } = estado;
  let { final, vueltas } = estado;

  if (sector && pasos[sector] === undefined && final === null) {
    pasos[sector] = ahora;
    if (sector === "box") {
      final = ahora;
      vueltas += 1;
      // Las mejores se actualizan al cerrar la vuelta, comparando con las
      // de antes: así los colores de esta vuelta no cambian al terminarla.
      const nuevas: Estado["mejores"] = { ...mejores };
      for (const s of SECTORES) {
        const t = pasos[s];
        if (t !== undefined && (nuevas[s] === undefined || t < nuevas[s]!)) nuevas[s] = t;
      }
      if (nuevas.vuelta === undefined || final < nuevas.vuelta) nuevas.vuelta = final;
      // `mejores` se queda con las anteriores hasta la próxima largada.
      guardar(nuevas, vueltas);
    }
  }
  emitir({ ...estado, actual: sector, pasos, final, mejores, vueltas });
}

/** ¿Este paso es la mejor marca de quien visita en ese sector? */
export function esMejor(sector: Sector | "vuelta", tiempo: number): boolean {
  const previa = estado.mejores[sector];
  return previa === undefined || tiempo <= previa;
}

/** 83 456 ms → «1:23.456». Bajo un minuto, «23.456». */
export function formatearTiempo(ms: number, decimales = 3): string {
  const total = Math.max(0, ms) / 1000;
  const minutos = Math.floor(total / 60);
  const segundos = total - minutos * 60;
  const s = segundos.toFixed(decimales);
  return minutos ? `${minutos}:${s.padStart(decimales ? decimales + 3 : 2, "0")}` : s;
}

/** La vuelta en un componente: se re-renderiza cuando cambia. */
export const useCarrera = () => useSyncExternalStore(suscribir, leer, leerServidor);
