"use client";

import { useEffect } from "react";
import { SECTORES, entrarA, largar, type Sector } from "@/lib/carrera";
import { abrirRadio, alternarTema, atajosActivos, irA } from "@/lib/cliente";

type Props = { otroIdioma: string };

/**
 * Lo que no se ve: la largada del cronómetro, qué sector ocupa la vista y
 * los atajos de teclado.
 *
 * Un sector «está en pista» cuando cruza la franja central de la pantalla,
 * igual que el nav. La parrilla (el hero) no es sector: ahí actual es null.
 */
export function Pista({ otroIdioma }: Props) {
  useEffect(() => {
    largar();

    const visibles = new Map<Element, boolean>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) visibles.set(e.target, e.isIntersecting);
        const enVista = [...visibles].find(([, v]) => v)?.[0] as HTMLElement | undefined;
        // La parrilla (o nada a la vista) cuenta como «ningún sector».
        const id = enVista?.id;
        entrarA(id && (SECTORES as readonly string[]).includes(id) ? (id as Sector) : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const parrilla = document.getElementById("parrilla");
    if (parrilla) observador.observe(parrilla);
    for (const id of SECTORES) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }
    const alTeclear = (e: KeyboardEvent) => {
      const objetivo = e.target as HTMLElement;
      const escribiendo =
        objetivo.closest("input, textarea, select, [contenteditable='true'], dialog[open]") !== null;

      // ⌘K / Ctrl+K abre la radio siempre: lleva modificador, no choca con
      // ninguna tecla de un lector de pantalla.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        abrirRadio();
        return;
      }
      if (escribiendo || e.metaKey || e.ctrlKey || e.altKey || !atajosActivos()) return;

      if (e.key === "/") {
        e.preventDefault();
        abrirRadio();
      } else if (/^[1-5]$/.test(e.key)) {
        irA(SECTORES[Number(e.key) - 1]);
      } else if (e.key === "0") {
        irA("parrilla");
      } else if (e.key.toLowerCase() === "n") {
        alternarTema();
      } else if (e.key.toLowerCase() === "l") {
        location.assign(otroIdioma + location.hash);
      } else if (e.key === "?") {
        abrirRadio(document.documentElement.lang === "en" ? "shortcuts" : "atajos");
      }
    };
    addEventListener("keydown", alTeclear);

    return () => {
      observador.disconnect();
      removeEventListener("keydown", alTeclear);
    };
  }, [otroIdioma]);

  return null;
}
