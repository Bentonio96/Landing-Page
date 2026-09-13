import { ArrowUp } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Pie mínimo: los enlaces a redes ya están, más grandes, en la sección de
 * contacto justo encima. Repetirlos aquí como iconos sumaba ruido.
 */
export function PieDePagina({ t }: Props) {
  return (
    <footer className="border-t border-borde py-10">
      <div className="lienzo flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-menor text-tenue">
          © {new Date().getFullYear()} {perfil.nombre}. {t.pie.derechos}{" "}
          {t.pie.construidoCon}
        </p>

        <a
          href="#inicio"
          className="inline-flex items-center gap-1.5 self-start font-mono text-etiqueta uppercase tracking-[0.12em] text-atenuado transition-colors hover:text-acento sm:self-auto"
        >
          {t.pie.volverArriba}
          <ArrowUp aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
