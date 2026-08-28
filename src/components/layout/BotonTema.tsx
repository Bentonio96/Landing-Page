"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { CLAVE_TEMA } from "@/lib/tema";
import type { Diccionario } from "@/i18n/diccionario";

type Props = { t: Diccionario };

export function BotonTema({ t }: Props) {
  // null hasta hidratar: evita anunciar un estado equivocado.
  const [oscuro, setOscuro] = useState<boolean | null>(null);

  useEffect(() => {
    setOscuro(document.documentElement.classList.contains("dark"));
  }, []);

  function alternar() {
    const siguiente = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", siguiente);
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente ? "dark" : "light");
    } catch {
      // Modo privado o almacenamiento bloqueado: el tema igual cambia,
      // solo no persiste.
    }
    setOscuro(siguiente);
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
      className="inline-flex size-10 items-center justify-center rounded-pieza border border-borde text-atenuado transition-colors hover:border-acento hover:text-acento"
    >
      {/* Se alternan por CSS: correctos incluso antes de hidratar. */}
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      <Moon aria-hidden="true" className="block size-4 dark:hidden" />
    </button>
  );
}
