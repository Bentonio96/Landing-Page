"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { ATRIBUTO_TEMA, CLAVE_TEMA } from "@/lib/tema";
import type { Diccionario } from "@/i18n/diccionario";

type Props = { t: Diccionario };

/** `startViewTransition` todavía no está en los tipos del DOM. */
type DocumentoConTransicion = Document & {
  startViewTransition?: (aplicar: () => void) => { ready: Promise<void> };
};

export function BotonTema({ t }: Props) {
  // null hasta hidratar: evita anunciar un estado equivocado.
  const [oscuro, setOscuro] = useState<boolean | null>(null);

  useEffect(() => {
    setOscuro(
      document.documentElement.getAttribute(ATRIBUTO_TEMA) === "dark",
    );
  }, []);

  function alternar(evento: MouseEvent<HTMLButtonElement>) {
    const siguiente =
      document.documentElement.getAttribute(ATRIBUTO_TEMA) !== "dark";

    const aplicar = () => {
      document.documentElement.setAttribute(
        ATRIBUTO_TEMA,
        siguiente ? "dark" : "light",
      );
      try {
        localStorage.setItem(CLAVE_TEMA, siguiente ? "dark" : "light");
      } catch {
        // Modo privado o almacenamiento bloqueado: el tema igual cambia,
        // solo no persiste.
      }
      setOscuro(siguiente);
    };

    const doc = document as DocumentoConTransicion;
    const puedeAnimar =
      typeof doc.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sin soporte o con movimiento reducido, el tema cambia al instante.
    if (!puedeAnimar) {
      aplicar();
      return;
    }

    // El tema nuevo se abre en círculo desde el propio botón.
    const caja = evento.currentTarget.getBoundingClientRect();
    const x = caja.left + caja.width / 2;
    const y = caja.top + caja.height / 2;
    const radio = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    doc.startViewTransition!(aplicar).ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radio}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  const etiqueta =
    oscuro === null
      ? t.tema.generico
      : oscuro
        ? t.tema.etiquetaClaro
        : t.tema.etiqueta;

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={etiqueta}
      title={etiqueta}
      className="vidrio backdrop-blur-xl backdrop-saturate-150 inline-flex size-10 items-center justify-center rounded-full text-atenuado transition-colors hover:text-acento"
    >
      {/* Se alternan por CSS: correctos incluso antes de hidratar. */}
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      <Moon aria-hidden="true" className="block size-4 dark:hidden" />
    </button>
  );
}
