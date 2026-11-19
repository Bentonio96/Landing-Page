"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Un solo aviso flotante para toda la página (copiar correo, borrador).
 * `role="status"` lo anuncia sin robar el foco.
 */
type Valor = { avisar: (mensaje: string) => void };
const Contexto = createContext<Valor | null>(null);
const DURACION = 4000;

export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const relojes = useRef<number[]>([]);

  const limpiar = useCallback(() => {
    relojes.current.forEach((r) => window.clearTimeout(r));
    relojes.current = [];
  }, []);
  useEffect(() => limpiar, [limpiar]);

  const avisar = useCallback(
    (texto: string) => {
      limpiar();
      setMensaje(texto);
      setVisible(true);
      relojes.current.push(
        window.setTimeout(() => setVisible(false), DURACION),
        window.setTimeout(() => setMensaje(null), DURACION + 400),
      );
    },
    [limpiar],
  );

  return (
    <Contexto.Provider value={{ avisar }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-6"
      >
        <p
          className={`pildora mono max-w-[min(30rem,92vw)] rounded-lg px-4 py-3 text-menor text-texto transition-[opacity,transform] duration-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {mensaje ? (
            <>
              <span aria-hidden="true" className="text-acento">
                ${" "}
              </span>
              {mensaje}
            </>
          ) : null}
        </p>
      </div>
    </Contexto.Provider>
  );
}

export function useAvisos(): Valor | null {
  return useContext(Contexto);
}
