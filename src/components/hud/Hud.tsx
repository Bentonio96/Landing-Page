"use client";

import { useEffect, useRef } from "react";
import { Moon, Radio as IconoRadio, Sun } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { Marca } from "@/components/Marca";
import { SECTORES, esMejor, formatearTiempo, leer, useCarrera } from "@/lib/carrera";
import { abrirRadio, alternarTema, irA } from "@/lib/cliente";
import { cn } from "@/lib/utils";

type Props = { t: Diccionario };

/**
 * La cabina: una barra fija con la marca, los cinco sectores, la telemetría
 * del scroll, el cronómetro de la vuelta y los mandos (idioma, luz, radio).
 *
 * Todo lo que es número vivo (velocidad, marcha, tiempo) es decorativo y va
 * con aria-hidden: lo que importa de verdad (el tiempo final) se anuncia en
 * el box, en texto.
 */
export function Hud({ t }: Props) {
  const carrera = useCarrera();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-linea bg-velo backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 md:gap-5 md:px-6">
        <a
          href="#parrilla"
          onClick={(e) => {
            e.preventDefault();
            irA("parrilla");
          }}
          className="flex shrink-0 items-center gap-2.5"
        >
          <Marca className="h-7" />
          <span className="sr-only">{t.titulo}, {t.nav.inicio}</span>
          <span aria-hidden="true" className="mono-etiqueta hidden text-atenuado xl:inline">
            #29
          </span>
        </a>

        <nav aria-label={t.nav.etiqueta} className="min-w-0 flex-1">
          <ol className="flex items-center gap-0.5 md:gap-1">
            {SECTORES.map((id) => {
              const s = t.nav.sectores[id];
              const activo = carrera.actual === id;
              const paso = carrera.pasos[id];
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activo ? "location" : undefined}
                    className={cn(
                      "group relative flex items-center gap-1.5 px-1.5 py-2 md:px-2.5",
                      "after:absolute after:inset-x-1.5 after:-bottom-[9px] after:h-[2px] after:origin-left after:scale-x-0 after:bg-moradovivo after:transition-transform after:duration-300",
                      activo && "after:scale-x-100",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-etiqueta tnum",
                        paso !== undefined ? "text-morado" : "text-tenue",
                      )}
                    >
                      {s.codigo}
                    </span>
                    <span className="sr-only lg:not-sr-only lg:text-[0.9375rem] lg:font-medium lg:text-tinta">
                      {s.nombre}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <Telemetria t={t} />
        <Cronometro t={t} />

        <a
          href={t.hud.hrefIdioma}
          lang={t.hud.idiomaCodigo.toLowerCase()}
          hrefLang={t.hud.idiomaCodigo.toLowerCase()}
          onClick={(e) => {
            // El hash viaja con el idioma: se sigue en el mismo sector.
            e.currentTarget.href = t.hud.hrefIdioma + location.hash;
          }}
          className="grid size-9 shrink-0 place-items-center border border-linea font-mono text-etiqueta hover:border-tinta"
        >
          <span aria-hidden="true">{t.hud.idiomaCodigo}</span>
          <span className="sr-only">{t.hud.idioma}</span>
        </a>
        <BotonTema t={t} />
        <button
          type="button"
          onClick={() => abrirRadio()}
          className="barrido hidden h-9 shrink-0 items-center gap-2 border border-tinta bg-tinta px-3 font-mono text-etiqueta uppercase tracking-[0.1em] text-papel [--barrido:var(--c-morado)] hover:border-morado hover:text-sobremorado md:inline-flex"
        >
          <IconoRadio aria-hidden="true" className="size-4" />
          {t.hud.radio}
          <kbd aria-hidden="true" className="hidden font-mono opacity-70 lg:inline">⌘K</kbd>
          <span className="sr-only">· {t.hud.abrirRadio}</span>
        </button>
      </div>
    </header>
  );
}

function BotonTema({ t }: Props) {
  // El tema real lo pone el script de <head> antes de hidratar; los dos
  // íconos se dibujan siempre y el CSS muestra el que corresponde, así el
  // servidor y el cliente renderizan lo mismo.
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        alternarTema({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="grid size-9 shrink-0 place-items-center border border-linea hover:border-tinta"
    >
      <Moon aria-hidden="true" className="size-4 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      <span className="sr-only dark:hidden">{t.hud.temaOscuro}</span>
      <span className="sr-only hidden dark:inline">{t.hud.temaClaro}</span>
    </button>
  );
}

/** Tiempo de la vuelta en curso. Escribe en el DOM sin re-renderizar. */
function Cronometro({ t }: Props) {
  const carrera = useCarrera();
  const salida = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = salida.current;
    if (!el) return;
    if (carrera.final !== null) {
      el.textContent = formatearTiempo(carrera.final);
      return;
    }
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pintar = () => {
      el.textContent = formatearTiempo(performance.now() - leer().inicio, quieto ? 0 : 1);
    };
    pintar();
    if (quieto) {
      const id = setInterval(pintar, 1000);
      return () => clearInterval(id);
    }
    // Diez veces por segundo basta: más rápido no se alcanza a leer.
    const id = setInterval(pintar, 100);
    return () => clearInterval(id);
  }, [carrera.final, carrera.inicio]);

  const morado = carrera.final !== null && esMejor("vuelta", carrera.final);

  return (
    <div aria-hidden="true" className="hidden shrink-0 items-baseline gap-2 xl:flex">
      <span className="mono-etiqueta text-tenue">{t.hud.vuelta}</span>
      <span
        ref={salida}
        className={cn(
          "min-w-[5.5ch] text-right font-mono text-[0.9375rem] font-medium tnum",
          morado ? "text-morado" : "text-tinta",
        )}
      >
        0.0
      </span>
    </div>
  );
}

const CIRCUITO =
  "M14 50 L66 50 C76 50 78 42 86 42 L104 42 C116 42 118 28 108 22 L92 13 C84 9 76 12 72 18 L64 30 C60 36 52 36 48 30 L40 16 C36 9 28 8 20 12 C10 17 6 30 8 40 C9 46 11 50 14 50 Z";

/**
 * Velocímetro del scroll y mapa del circuito. La velocidad sale de cuánto
 * se desplazó la página por milisegundo; la marcha, de la velocidad, y las
 * luces de cambio se llenan dentro de cada marcha, como en un volante.
 * El punto del mapa es el recorrido de la página.
 */
function Telemetria({ t }: Props) {
  const velocidad = useRef<HTMLSpanElement>(null);
  const marcha = useRef<HTMLSpanElement>(null);
  const luces = useRef<HTMLSpanElement>(null);
  const trazo = useRef<SVGPathElement>(null);
  const recorrido = useRef<SVGPathElement>(null);
  const punto = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let ultimaY = scrollY;
    let ultimoT = performance.now();
    let kmh = 0;
    let objetivo = 0;
    let cuadro = 0;
    const largo = trazo.current?.getTotalLength() ?? 1;
    if (recorrido.current) recorrido.current.style.strokeDasharray = String(largo);

    const pintar = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      if (recorrido.current) recorrido.current.style.strokeDashoffset = String(largo * (1 - p));
      const q = trazo.current?.getPointAtLength(largo * p);
      if (q && punto.current) {
        punto.current.setAttribute("cx", q.x.toFixed(1));
        punto.current.setAttribute("cy", q.y.toFixed(1));
      }
      kmh += (objetivo - kmh) * 0.18;
      objetivo *= 0.9;
      const v = Math.round(kmh);
      const m = v < 3 ? 0 : Math.min(8, Math.ceil(v / 42));
      if (velocidad.current) velocidad.current.textContent = String(v).padStart(3, "0");
      if (marcha.current) marcha.current.textContent = m ? String(m) : "N";
      if (luces.current) {
        const dentro = m ? (v - (m - 1) * 42) / 42 : 0;
        const encendidas = Math.round(dentro * 10);
        [...luces.current.children].forEach((luz, i) =>
          luz.toggleAttribute("data-on", i < encendidas),
        );
      }
      cuadro = kmh > 0.5 || objetivo > 0.5 ? requestAnimationFrame(pintar) : 0;
      if (!cuadro && velocidad.current) {
        velocidad.current.textContent = "000";
        if (marcha.current) marcha.current.textContent = "N";
      }
    };

    const alDesplazar = () => {
      const ahora = performance.now();
      const dt = Math.max(8, ahora - ultimoT);
      const px = Math.abs(scrollY - ultimaY);
      ultimaY = scrollY;
      ultimoT = ahora;
      // 5 px/ms, un scroll muy rápido, son unos 340 km/h.
      objetivo = Math.min(340, Math.max(objetivo, (px / dt) * 68));
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };

    pintar();
    addEventListener("scroll", alDesplazar, { passive: true });
    addEventListener("resize", pintar);
    return () => {
      cancelAnimationFrame(cuadro);
      removeEventListener("scroll", alDesplazar);
      removeEventListener("resize", pintar);
    };
  }, []);

  return (
    <div aria-hidden="true" className="hidden shrink-0 items-center gap-4 min-[1440px]:flex">
      <div className="flex items-baseline gap-1.5">
        <span ref={velocidad} className="font-mono text-[1.0625rem] font-medium tnum">
          000
        </span>
        <span className="mono-etiqueta text-tenue">{t.hud.velocidad}</span>
      </div>
      <div className="flex flex-col items-start gap-1">
        <span ref={luces} className="flex gap-[3px]">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-[5px] w-[7px] bg-linea transition-colors duration-75",
                i < 4
                  ? "data-[on]:bg-senal"
                  : i < 8
                    ? "data-[on]:bg-ambar"
                    : "data-[on]:bg-moradovivo",
              )}
            />
          ))}
        </span>
        <span className="mono-etiqueta text-tenue">
          {t.hud.marcha} <span ref={marcha} className="text-tinta">N</span>
        </span>
      </div>
      <svg viewBox="0 0 124 60" className="h-9 w-[74px]" fill="none">
        <path ref={trazo} d={CIRCUITO} stroke="var(--c-linea-fuerte)" strokeWidth="2.5" />
        <path
          ref={recorrido}
          d={CIRCUITO}
          stroke="var(--c-tinta)"
          strokeWidth="2.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <circle ref={punto} r="4.5" cx="14" cy="50" fill="var(--c-morado-vivo)" />
      </svg>
    </div>
  );
}
