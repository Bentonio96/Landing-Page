"use client";

import { useEffect, useRef } from "react";

/**
 * Capa de auras del fondo, con paralaje suave según el puntero.
 *
 * Va detrás de todo con z-index negativo, lo que exige que el color de fondo
 * viva en <html> y no en <body> (ver globals.css). Es puramente decorativa:
 * sin contenido y oculta a lectores de pantalla.
 *
 * El desplazamiento se aplica como `transform` sobre la capa entera, no
 * moviendo los centros de los gradientes: así lo resuelve el compositor y no
 * obliga a repintar el fondo en cada movimiento del ratón. Además el estado
 * se escribe directo sobre el nodo con una ref, sin estado de React, para no
 * disparar un render por cada evento.
 *
 * A propósito NO se añade un halo que siga al cursor: pasaría por encima del
 * texto y le bajaría el contraste justo donde se está leyendo. El paralaje
 * mueve auras ancladas a los bordes, que nunca invaden la columna de texto.
 */

/** Desplazamiento máximo, en píxeles. Suficiente para notarse, no para marear. */
const MAXIMO = 22;

export function Ambiente() {
  const capa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = capa.current;
    if (!elemento) return;

    // Sin puntero fino (táctiles) o con movimiento reducido, se queda quieta.
    const finoYSuave =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finoYSuave) return;

    let pendiente = 0;
    let x = 0;
    let y = 0;

    const pintar = () => {
      pendiente = 0;
      elemento.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const alMover = (evento: PointerEvent) => {
      // Normalizado a [-1, 1] y en sentido contrario al cursor: da sensación
      // de profundidad, como si el fondo estuviera más lejos.
      const nx = (evento.clientX / window.innerWidth) * 2 - 1;
      const ny = (evento.clientY / window.innerHeight) * 2 - 1;
      x = -nx * MAXIMO;
      y = -ny * MAXIMO;
      if (!pendiente) pendiente = requestAnimationFrame(pintar);
    };

    window.addEventListener("pointermove", alMover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", alMover);
      if (pendiente) cancelAnimationFrame(pendiente);
    };
  }, []);

  return (
    <>
      <div ref={capa} aria-hidden="true" className="ambiente" />
      <div aria-hidden="true" className="grano" />
    </>
  );
}
