"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { perfil } from "@/data/perfil";

type Props = { t: Diccionario };

/**
 * El inicio: a la izquierda el rol y la disponibilidad; a la derecha (arriba
 * en celulares) su retrato hecho de puntos. Un botón alterna entre el retrato
 * y su nombre; un clic sobre los puntos hace lo mismo.
 */
export function Inicio({ t }: Props) {
  const h = t.hero;
  const [indice, setIndice] = useState(0);
  const [tactil, setTactil] = useState(false);

  useEffect(() => {
    setTactil(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // El campo de partículas (uno para toda la página) escucha este evento.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("particulas:forma", { detail: indice }));
  }, [indice]);

  const alternar = () => setIndice((i) => (i === 0 ? 1 : 0));

  return (
    <section id="inicio" aria-labelledby="titular" className="relative lg:min-h-[100svh]">
      <div className="lienzo grid lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="relative order-1 h-[min(64svh,36rem)] lg:order-2 lg:h-auto">
          <div
            data-particulas="inicio"
            data-margen="96,48,0,16"
            data-margen-movil="76,20,0,20"
            role="img"
            aria-label={h.particulas.descripcion}
            onClick={alternar}
            className="absolute inset-0 cursor-crosshair"
          />
        </div>

        <div className="order-2 flex flex-col justify-center pb-16 pt-6 lg:order-1 lg:pb-24 lg:pt-28">
          <p className="inline-flex items-center gap-2.5 text-menor text-atenuado">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-texto" />
            {h.disponible}
          </p>
          <h1 id="titular" className="mt-6">
            <span className="block text-guia font-medium text-atenuado">{perfil.nombre}</span>
            <span className="titular mt-3 block">
              {h.rol.split(" ").map((palabra) => (
                <span key={palabra} className="block">
                  {palabra}
                </span>
              ))}
            </span>
          </h1>
          <p className="mt-7 max-w-[30ch] text-guia text-atenuado">{h.subtitulo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#proyectos" className="boton">
              {h.verProyectos}
              <ArrowUpRight aria-hidden="true" className="flecha size-4" />
            </a>
            <a href={perfil.cv} download={perfil.cvArchivo} className="boton boton--hueco">
              <Download aria-hidden="true" className="size-4" />
              {h.descargarCV}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-borde pt-5">
            <button type="button" onClick={alternar} aria-pressed={indice === 1} className="boton boton--hueco min-h-10 py-2">
              {indice === 0 ? h.particulas.aNombre : h.particulas.aRetrato}
            </button>
            <p className="text-mini text-tenue">{tactil ? h.particulas.ayudaToque : h.particulas.ayudaCursor}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
