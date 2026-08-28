"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { cn } from "@/lib/utils";
import { BotonIdioma } from "./BotonIdioma";
import { BotonTema } from "./BotonTema";

type Props = { idioma: Idioma; t: Diccionario };

/** Los ids son iguales en ambos idiomas: así el hash sobrevive al cambio. */
const SECCIONES = [
  { id: "sobre-mi", clave: "sobreMi" },
  { id: "stack", clave: "stack" },
  { id: "proyectos", clave: "proyectos" },
  { id: "experiencia", clave: "experiencia" },
  { id: "contacto", clave: "contacto" },
] as const;

export function Encabezado({ idioma, t }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState<string | null>(null);
  const [desplazado, setDesplazado] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);

  const cerrar = useCallback(() => {
    setAbierto(false);
    botonMenu.current?.focus();
  }, []);

  // Marca en el nav la sección que se está leyendo.
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiva(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const { id } of SECCIONES) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, []);

  // Sombra/borde del encabezado solo cuando ya se bajó.
  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 12);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  // Escape cierra el menú móvil y devuelve el foco al botón.
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        desplazado || abierto
          ? "border-b border-borde bg-fondo/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="lienzo flex h-16 items-center justify-between gap-4 sm:h-20">
        <a
          href="#inicio"
          className="font-display text-lg tracking-tight transition-colors hover:text-acento"
        >
          Benjamín Peña
        </a>

        <nav
          aria-label={idioma === "es" ? "Principal" : "Main"}
          className="hidden md:block"
        >
          <ul className="flex items-center gap-1">
            {SECCIONES.map(({ id, clave }) => {
              const esActiva = activa === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={esActiva ? "true" : undefined}
                    className={cn(
                      "relative inline-block px-3 py-2 font-mono text-etiqueta uppercase tracking-[0.12em] transition-colors",
                      esActiva
                        ? "text-acento"
                        : "text-atenuado hover:text-texto",
                    )}
                  >
                    {t.nav[clave]}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 bottom-1 h-px origin-left bg-acento transition-transform duration-300",
                        esActiva ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BotonIdioma idioma={idioma} t={t} />
          <BotonTema t={t} />
          <button
            ref={botonMenu}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? t.nav.cerrarMenu : t.nav.abrirMenu}
            className="inline-flex size-10 items-center justify-center rounded-pieza border border-borde text-atenuado transition-colors hover:border-acento hover:text-acento md:hidden"
          >
            {abierto ? (
              <X aria-hidden="true" className="size-4" />
            ) : (
              <Menu aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil: se desmonta al cerrar, no queda en el orden de tabulación. */}
      {abierto ? (
        <nav
          id="menu-movil"
          aria-label={idioma === "es" ? "Principal, móvil" : "Main, mobile"}
          className="border-t border-borde bg-fondo md:hidden"
        >
          <ul className="lienzo flex flex-col py-2">
            {SECCIONES.map(({ id, clave }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={cerrar}
                  aria-current={activa === id ? "true" : undefined}
                  className={cn(
                    "block border-b border-borde py-4 font-mono text-etiqueta uppercase tracking-[0.12em] transition-colors last:border-b-0",
                    activa === id ? "text-acento" : "text-atenuado",
                  )}
                >
                  {t.nav[clave]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
