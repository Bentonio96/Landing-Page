"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

/**
 * Avisos flotantes en el borde inferior.
 *
 * Hay un solo emisor montado en la página y un contexto para dispararlo, de
 * modo que dos botones distintos no puedan apilar dos avisos superpuestos.
 *
 * `role="status"` con `aria-live="polite"` lo anuncia a lectores de pantalla
 * sin robar el foco de donde esté la persona.
 */

type Valor = { avisar: (mensaje: string) => void };

const Contexto = createContext<Valor | null>(null);

const DURACION = 4000;

export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const temporizadores = useRef<number[]>([]);

  const limpiar = useCallback(() => {
    temporizadores.current.forEach((t) => window.clearTimeout(t));
    temporizadores.current = [];
  }, []);

  useEffect(() => limpiar, [limpiar]);

  const avisar = useCallback(
    (texto: string) => {
      limpiar();
      setMensaje(texto);
      setVisible(true);
      temporizadores.current.push(
        window.setTimeout(() => setVisible(false), DURACION),
        // Se desmonta el texto después de la transición de salida
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
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-6 sm:pb-8"
      >
        <div
          className={`vidrio backdrop-blur-xl backdrop-saturate-150 flex max-w-[min(28rem,92vw)] items-center gap-3 rounded-control px-4 py-3 shadow-[0_12px_36px_-12px_var(--c-sombra)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            visible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          {mensaje ? (
            <>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-acento">
                <Check
                  aria-hidden="true"
                  strokeWidth={3}
                  className="size-3.5 text-acentosobre"
                />
              </span>
              <p className="text-menor text-texto">{mensaje}</p>
            </>
          ) : null}
        </div>
      </div>
    </Contexto.Provider>
  );
}

/** Devuelve null fuera del proveedor, para no obligar a envolverlo. */
export function useAvisos(): Valor | null {
  return useContext(Contexto);
}
