"use client";

import { useEffect, useState } from "react";
import type { Idioma } from "@/types";
import { idiomaAlterno, rutaDe } from "@/i18n/config";
import type { Diccionario } from "@/i18n/diccionario";

type Props = { idioma: Idioma; t: Diccionario };

/**
 * Cambia entre español (/) e inglés (/en).
 * Arrastra el hash actual, así que si estás en #proyectos sigues ahí.
 *
 * Es un <a> y no un <Link> a propósito. Con navegación blanda React
 * re-renderiza el root layout —cambia el segmento [idioma]— y al reconciliar
 * <html> descarta lo que no está en sus props: se perdía el tema, que el
 * script del <head> deja puesto en runtime. Con una carga completa ese
 * script vuelve a ejecutarse antes de pintar, así que el tema sobrevive y
 * sin destello. Para un cambio de idioma, que además cambia el `lang` del
 * documento, recargar es lo correcto.
 */
export function BotonIdioma({ idioma, t }: Props) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sincronizar = () => setHash(window.location.hash);
    sincronizar();
    window.addEventListener("hashchange", sincronizar);
    return () => window.removeEventListener("hashchange", sincronizar);
  }, []);

  const destino = `${rutaDe(idiomaAlterno(idioma))}${hash}`;

  return (
    <a
      href={destino}
      hrefLang={idiomaAlterno(idioma)}
      aria-label={t.idioma.etiqueta}
      title={t.idioma.etiqueta}
      className="inline-flex h-10 items-center justify-center rounded-pieza border border-borde px-3 font-mono text-etiqueta tracking-[0.12em] text-atenuado transition-colors hover:border-acento hover:text-acento"
    >
      {t.idioma.codigo}
    </a>
  );
}
