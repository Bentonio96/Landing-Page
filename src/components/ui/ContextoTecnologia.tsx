"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

/**
 * Conecta la sección Stack con la de Proyectos.
 *
 * Al apuntar una tecnología del stack se resaltan los proyectos que la usan;
 * al apuntar (o enfocar) un proyecto se resaltan sus tecnologías en el stack.
 * Es una mejora progresiva: la relación ya está escrita en la página —cada
 * tarjeta lista sus tecnologías—, así que sin puntero no se pierde
 * información, solo la comodidad de verla cruzada.
 */

type Origen = "stack" | "proyecto";

type Valor = {
  activas: string[];
  origen: Origen | null;
  activar: (tecnologias: string[], origen: Origen) => void;
  limpiar: () => void;
};

const Contexto = createContext<Valor | null>(null);

/**
 * "React 19" y "React" son la misma tecnología; "Next.js 15" y "Next.js"
 * también. Se quita el número de versión del final antes de comparar.
 */
export function normalizar(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+\d+(\.\d+)*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function coinciden(a: string, b: string): boolean {
  return normalizar(a) === normalizar(b);
}

export function ProveedorTecnologia({ children }: { children: ReactNode }) {
  const [activas, setActivas] = useState<string[]>([]);
  const [origen, setOrigen] = useState<Origen | null>(null);

  const activar = useCallback((tecnologias: string[], desde: Origen) => {
    setActivas(tecnologias);
    setOrigen(desde);
  }, []);

  const limpiar = useCallback(() => {
    setActivas([]);
    setOrigen(null);
  }, []);

  const valor = useMemo(
    () => ({ activas, origen, activar, limpiar }),
    [activas, origen, activar, limpiar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/** Devuelve null si se usa fuera del proveedor, para no obligar a envolverlo. */
export function useTecnologia(): Valor | null {
  return useContext(Contexto);
}

/** ¿Alguna de las tecnologías activas coincide con esta? */
export function estaActiva(activas: string[], tecnologia: string): boolean {
  return activas.some((a) => coinciden(a, tecnologia));
}
