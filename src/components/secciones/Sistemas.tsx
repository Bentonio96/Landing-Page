"use client";

import { useState } from "react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import type { CategoriaStack } from "@/types";
import type { ProyectoRadio } from "@/lib/apex";
import { proyectosQueUsan } from "@/lib/apex";
import { irA } from "@/lib/cliente";
import { cn } from "@/lib/utils";

type Props = {
  idioma: Idioma;
  t: Diccionario;
  stack: CategoriaStack[];
  proyectos: ProyectoRadio[];
};

/**
 * S3 · Sistemas: el stack como las piezas del auto. Cada tecnología es un
 * botón; al elegirla, la lectura de telemetría dice en qué proyectos corre
 * (con enlace a cada uno) o, si la está incorporando, que todavía no sale a
 * pista. Los datos se cruzan solos desde src/data: no hay una lista a mano
 * que se pueda desactualizar.
 */
export function Sistemas({ idioma, t, stack, proyectos }: Props) {
  const [elegida, setElegida] = useState<string | null>(null);
  const categoria = stack.find((c) => c.items.some((i) => i.nombre === elegida));
  const aprendiendo = categoria?.id === "incorporando";
  const usan = elegida ? proyectosQueUsan(elegida, proyectos) : [];

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
      <div className="grid border-l border-t border-linea sm:grid-cols-2">
        {stack.map((c, n) => (
          <section
            key={c.id}
            aria-labelledby={`sistema-${c.id}`}
            className="border-b border-r border-linea p-5 md:p-6"
          >
            <h3 id={`sistema-${c.id}`} className="flex items-baseline justify-between gap-3">
              <span className="titular text-2xl">{c.titulo[idioma]}</span>
              <span className="mono-etiqueta text-tenue">
                {String(n + 1).padStart(2, "0")} · {t.sistemas.metaforas[c.id as keyof typeof t.sistemas.metaforas]}
              </span>
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {c.items.map((item) => {
                const activa = elegida === item.nombre;
                return (
                  <li key={item.nombre}>
                    <button
                      type="button"
                      aria-pressed={activa}
                      onClick={() => setElegida(activa ? null : item.nombre)}
                      className={cn(
                        "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[0.9375rem] transition-colors",
                        activa
                          ? "border-morado bg-morado text-sobremorado"
                          : item.principal
                            ? "border-tinta text-tinta hover:bg-tinta hover:text-papel"
                            : "border-linea text-atenuado hover:border-tinta hover:text-tinta",
                      )}
                    >
                      {item.principal && (
                        <span
                          aria-hidden="true"
                          className={cn("size-1.5", activa ? "bg-sobremorado" : "bg-moradovivo")}
                        />
                      )}
                      {item.nombre}
                      {item.principal && <span className="sr-only">({t.sistemas.principal})</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside
        aria-labelledby="lectura-titulo"
        className="self-start border border-tinta bg-panelalto lg:sticky lg:top-24"
      >
        <h3
          id="lectura-titulo"
          className="mono-etiqueta flex items-center justify-between border-b border-linea px-4 py-3 text-atenuado"
        >
          {t.sistemas.lectura}
          <span className={elegida ? (aprendiendo ? "text-ambar" : "text-senal") : "text-tenue"}>
            <span className="pulso" aria-hidden="true" />
          </span>
        </h3>
        <div aria-live="polite" className="min-h-[180px] px-4 py-5">
          {elegida ? (
            <>
              <p className="titular text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none">{elegida}</p>
              <p className="mono-etiqueta mt-2 text-tenue">
                {categoria?.titulo[idioma]} ·{" "}
                {t.sistemas.metaforas[categoria?.id as keyof typeof t.sistemas.metaforas]}
              </p>
              {aprendiendo ? (
                <p className="mt-4 text-ambar">{t.sistemas.aprendiendo}</p>
              ) : usan.length ? (
                <>
                  <p className="mt-4 text-atenuado">{t.sistemas.usadaEn}</p>
                  <ul className="mt-2 divide-y divide-linea border-y border-linea">
                    {usan.map((p) => (
                      <li key={p.slug}>
                        <a
                          href={`#proyecto-${p.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            irA(`proyecto-${p.slug}`);
                          }}
                          className="flex items-baseline justify-between gap-3 py-2 hover:text-morado"
                        >
                          <span className="font-medium">{p.nombre}</span>
                          <span className="font-mono text-etiqueta text-tenue">{p.clase}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-4 text-atenuado">{t.sistemas.sinProyecto}</p>
              )}
            </>
          ) : (
            <p className="text-atenuado">{t.sistemas.vacio}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
