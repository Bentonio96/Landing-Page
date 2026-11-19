"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Download, Moon, MoreHorizontal, Sun, X } from "lucide-react";
import type { Idioma } from "@/types";
import type { Diccionario } from "@/i18n/diccionario";
import { idiomaAlterno, rutaDe } from "@/i18n/config";
import { perfil } from "@/data/perfil";
import { ATRIBUTO_TEMA, CLAVE_TEMA } from "@/lib/tema";

type Props = { idioma: Idioma; t: Diccionario };

type DocumentoConTransicion = Document & {
  startViewTransition?: (aplicar: () => void) => { ready: Promise<void> };
};

/**
 * La píldora flotante del reel: nombre, tema y menú. Al lado del nombre va
 * la ruta de la sección en la que estás, en voz de terminal (`~/stack`), y
 * rueda hacia arriba cada vez que cambia.
 */
export function Pildora({ idioma, t }: Props) {
  const secciones = [
    { id: "inicio", nombre: t.nav.inicio },
    { id: "sobre-mi", nombre: t.nav.sobreMi },
    { id: "stack", nombre: t.nav.stack },
    { id: "proyectos", nombre: t.nav.proyectos },
    { id: "experiencia", nombre: t.nav.experiencia },
    { id: "contacto", nombre: t.nav.contacto },
  ];

  const [ruta, setRuta] = useState({ actual: "inicio", previa: "", n: 0 });
  const [abierto, setAbierto] = useState(false);
  const [oscuro, setOscuro] = useState<boolean | null>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Sección actual: la última cuyo borde superior ya pasó el centro de la
  // pantalla. El saludo vive dentro del tramo fijo del inicio, así que
  // «empieza» cuando el tramo va en un 60 %.
  useEffect(() => {
    let pendiente = 0;
    function medir() {
      pendiente = 0;
      const linea = window.scrollY + window.innerHeight * 0.45;
      const escenario = document.getElementById("inicio");
      const marcas: [string, number][] = [["inicio", 0]];
      if (escenario) {
        const tramo = Math.max(0, escenario.offsetHeight - window.innerHeight);
        const inicioSaludo = tramo > 0
          ? escenario.offsetTop + tramo * 0.6 + window.innerHeight * 0.45
          : (document.getElementById("sobre-mi")?.getBoundingClientRect().top ?? 0) + window.scrollY;
        marcas.push(["sobre-mi", inicioSaludo]);
      }
      for (const id of ["quien-soy", "stack", "proyectos", "experiencia", "contacto"]) {
        const el = document.getElementById(id);
        if (el) marcas.push([id === "quien-soy" ? "sobre-mi" : id, el.getBoundingClientRect().top + window.scrollY]);
      }
      let actual = "inicio";
      for (const [id, y] of marcas) if (y <= linea) actual = id;
      setRuta((r) => (r.actual === actual ? r : { actual, previa: r.actual, n: r.n + 1 }));
    }
    const pedir = () => {
      if (!pendiente) pendiente = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
    };
  }, []);

  useEffect(() => {
    setOscuro(document.documentElement.getAttribute(ATRIBUTO_TEMA) === "dark");
  }, []);

  const cerrar = useCallback((devolverFoco: boolean) => {
    setAbierto(false);
    if (devolverFoco) boton.current?.focus();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar(true);
    };
    const fuera = (e: PointerEvent) => {
      const objetivo = e.target as Node;
      if (!panel.current?.contains(objetivo) && !boton.current?.contains(objetivo)) cerrar(false);
    };
    document.addEventListener("keydown", tecla);
    document.addEventListener("pointerdown", fuera);
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("pointerdown", fuera);
    };
  }, [abierto, cerrar]);

  function alternarTema(evento: MouseEvent<HTMLButtonElement>) {
    const siguiente = document.documentElement.getAttribute(ATRIBUTO_TEMA) !== "dark";
    const aplicar = () => {
      document.documentElement.setAttribute(ATRIBUTO_TEMA, siguiente ? "dark" : "light");
      try {
        localStorage.setItem(CLAVE_TEMA, siguiente ? "dark" : "light");
      } catch {
        // Sin almacenamiento el tema cambia igual, solo no persiste.
      }
      setOscuro(siguiente);
    };
    const doc = document as DocumentoConTransicion;
    const reducido =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.hasAttribute("data-reducido");
    if (typeof doc.startViewTransition !== "function" || reducido) {
      aplicar();
      return;
    }
    const caja = evento.currentTarget.getBoundingClientRect();
    const x = caja.left + caja.width / 2;
    const y = caja.top + caja.height / 2;
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(aplicar).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  const etiquetaTema = oscuro === null ? t.tema.generico : oscuro ? t.tema.etiquetaClaro : t.tema.etiqueta;
  const nombreDe = (id: string) => secciones.find((s) => s.id === id)?.nombre.toLowerCase() ?? id;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <div className="pointer-events-auto relative">
        <nav
          aria-label={t.nav.explorar}
          className="pildora flex items-center gap-1 rounded-xl p-1.5 pl-4"
        >
          <a href="#inicio" className="flex min-h-9 items-center gap-3 pr-2 text-menor">
            <span className="ancho font-bold">Benjamín</span>
            <span aria-hidden="true" className="rueda mono hidden min-w-[9.5ch] text-[0.75rem] text-tenue sm:inline-grid">
              {ruta.previa ? (
                <span key={`p${ruta.n}`} data-sale="">
                  ~/{nombreDe(ruta.previa)}
                </span>
              ) : null}
              <span key={`a${ruta.n}`} data-entra={ruta.n > 0 ? "" : undefined}>
                ~/{nombreDe(ruta.actual)}
              </span>
            </span>
          </a>
          <button
            type="button"
            onClick={alternarTema}
            aria-label={etiquetaTema}
            title={etiquetaTema}
            className="inline-flex size-9 items-center justify-center rounded-lg text-atenuado transition-colors hover:bg-elevado hover:text-texto"
          >
            <Sun aria-hidden="true" className="hidden size-4 dark:block" />
            <Moon aria-hidden="true" className="block size-4 dark:hidden" />
          </button>
          <button
            ref={boton}
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-principal"
            aria-label={abierto ? t.nav.cerrarMenu : t.nav.menu}
            onClick={() => setAbierto((a) => !a)}
            className="inline-flex size-9 items-center justify-center rounded-lg bg-texto text-fondo transition-colors hover:bg-acento hover:text-acentosobre"
          >
            {abierto ? <X aria-hidden="true" className="size-4" /> : <MoreHorizontal aria-hidden="true" className="size-4" />}
          </button>
        </nav>

        {abierto ? (
          <div
            ref={panel}
            id="menu-principal"
            className="pildora menu-panel absolute left-1/2 top-full mt-2 w-[min(19rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-xl p-2"
          >
            <ul className="grid">
              {secciones.slice(1).map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => cerrar(false)}
                    className="flex min-h-11 items-center justify-between rounded-lg px-3 text-base font-medium transition-colors hover:bg-elevado"
                  >
                    {s.nombre}
                    <span aria-hidden="true" className="mono text-[0.75rem] text-tenue">
                      ~/{s.nombre.toLowerCase()}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-2">
              <a
                href={rutaDe(idiomaAlterno(idioma))}
                hrefLang={idiomaAlterno(idioma)}
                lang={idiomaAlterno(idioma)}
                aria-label={t.idioma.etiqueta}
                className="boton"
              >
                {t.idioma.nombre}
              </a>
              <a href={perfil.cv} download={perfil.cvArchivo} className="boton">
                <Download aria-hidden="true" className="size-4" />
                CV
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
