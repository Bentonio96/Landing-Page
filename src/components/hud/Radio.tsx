"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Radio as IconoRadio, X } from "lucide-react";
import type { Diccionario } from "@/i18n/diccionario";
import { responder, type Accion, type Conocimiento } from "@/lib/apex";
import { formatearTiempo, leer, useCarrera, type Sector } from "@/lib/carrera";
import {
  abrirRadio,
  alternarAtajos,
  alternarTema,
  irA,
  sinMovimiento,
} from "@/lib/cliente";
import { cn } from "@/lib/utils";

type Props = {
  t: Diccionario;
  conocimiento: Conocimiento;
  /** Ruta de la página en el otro idioma. */
  otroIdioma: string;
};

type Mensaje = {
  id: number;
  autor: "tu" | "apex";
  texto: string;
  acciones?: Accion[];
};

let siguienteId = 0;

/**
 * La radio con ÁPEX. Tres piezas:
 *
 * 1. Un <dialog> modal nativo (foco atrapado, Esc y backdrop gratis) con el
 *    historial, sugerencias y un campo para escribir. Las respuestas se
 *    tipean como en una terminal, pero el lector de pantalla recibe cada
 *    mensaje entero, una vez, por la región `log`.
 * 2. Un aviso de radio que aparece al entrar a cada sector, como el
 *    ingeniero cuando el piloto cruza un intermedio. Es un eco de lo que ya
 *    dice la página, así que no se anuncia (aria-hidden) ni roba el foco.
 * 3. En el teléfono, un botón flotante con el cronómetro, porque ahí la
 *    barra de arriba no tiene espacio para la radio.
 */
export function Radio({ t, conocimiento, otroIdioma }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const historial = useRef<HTMLOListElement>(null);
  const destinoAlCerrar = useRef<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => [
    { id: siguienteId++, autor: "apex", texto: t.radio.bienvenida },
  ]);

  const ejecutar = useCallback(
    (accion: Accion, { automatica = false } = {}) => {
      switch (accion.tipo) {
        case "ir":
          // Detrás del diálogo: la página se mueve mientras se conversa, y
          // al cerrar el foco queda en ese sector.
          irA(accion.destino, { enfocar: false });
          destinoAlCerrar.current = accion.destino;
          if (!automatica) dialogo.current?.close();
          break;
        case "tema":
          alternarTema();
          break;
        case "idioma":
          setTimeout(() => location.assign(otroIdioma), sinMovimiento() ? 0 : 900);
          break;
        case "atajos": {
          const activos = alternarAtajos();
          setMensajes((m) => [
            ...m,
            { id: siguienteId++, autor: "apex", texto: activos ? t.radio.atajosOn : t.radio.atajosOff },
          ]);
          break;
        }
        case "copiar":
          navigator.clipboard
            .writeText(accion.valor)
            .then(() => `${t.box.correoCopiado}`)
            .catch(() => `${t.box.correoFallo} ${accion.valor}`)
            .then((texto) =>
              setMensajes((m) => [...m, { id: siguienteId++, autor: "apex", texto }]),
            );
          break;
        case "enlace":
          break;
      }
    },
    [otroIdioma, t],
  );

  const enviar = useCallback(
    (pregunta: string) => {
      const limpia = pregunta.trim();
      if (!limpia) return;
      const r = responder(limpia, conocimiento);
      setMensajes((m) => [
        ...m,
        { id: siguienteId++, autor: "tu", texto: limpia },
        { id: siguienteId++, autor: "apex", texto: r.texto, acciones: r.acciones },
      ]);
      if (r.auto) ejecutar(r.auto, { automatica: true });
    },
    [conocimiento, ejecutar],
  );

  // Abrir desde cualquier botón, atajo o pregunta sugerida.
  useEffect(() => {
    const alPedir = (e: Event) => {
      const pregunta = (e as CustomEvent<{ pregunta?: string }>).detail?.pregunta;
      const d = dialogo.current;
      if (!d) return;
      if (!d.open) d.showModal();
      if (pregunta) enviar(pregunta);
      entrada.current?.focus();
    };
    addEventListener("v3:radio", alPedir);
    return () => removeEventListener("v3:radio", alPedir);
  }, [enviar]);

  // El historial siempre muestra lo último.
  useEffect(() => {
    const ol = historial.current;
    if (ol) ol.scrollTop = ol.scrollHeight;
  }, [mensajes]);

  const alCerrar = () => {
    const destino = destinoAlCerrar.current;
    destinoAlCerrar.current = null;
    if (!destino) return;
    // Después de que el diálogo devuelve el foco al botón que lo abrió.
    requestAnimationFrame(() => irA(destino));
  };

  return (
    <>
      <dialog
        ref={dialogo}
        aria-labelledby="radio-titulo"
        onClose={alCerrar}
        onClick={(e) => {
          // Clic en el fondo (fuera de la caja) cierra.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className={cn(
          "radio m-auto w-[min(640px,calc(100%-24px))] max-h-[min(720px,calc(100dvh-24px))] p-0",
          "border border-tinta bg-panelalto text-tinta shadow-[8px_8px_0_var(--c-tinta)]",
        )}
      >
        <div className="flex max-h-[min(720px,calc(100dvh-26px))] flex-col">
          <header className="flex items-center gap-3 border-b border-linea px-4 py-3">
            <span className="text-senal">
              <span className="pulso" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="radio-titulo" className="titular text-xl leading-none">
                {t.radio.titulo}
              </h2>
              <p className="mono-etiqueta mt-1 text-tenue">{t.radio.canal}</p>
            </div>
            <Onda />
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              className="grid size-9 place-items-center border border-linea hover:border-tinta"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">{t.radio.cerrar}</span>
            </button>
          </header>

          <ol
            ref={historial}
            role="log"
            aria-live="polite"
            className="min-h-[220px] flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {mensajes.map((m, i) => (
              <li key={m.id} className={cn("flex flex-col gap-1.5", m.autor === "tu" && "items-end")}>
                <span className="mono-etiqueta text-tenue" aria-hidden="true">
                  {m.autor === "tu" ? t.radio.tu : t.radio.apex}
                </span>
                <span className="sr-only">
                  {m.autor === "tu" ? t.radio.tu : t.radio.apex}: {m.texto}
                </span>
                {m.autor === "tu" ? (
                  <p
                    aria-hidden="true"
                    className="max-w-[85%] bg-tinta px-3 py-2 text-[0.9375rem] text-papel"
                  >
                    {m.texto}
                  </p>
                ) : (
                  <Tipeo
                    texto={m.texto}
                    animar={i === mensajes.length - 1 && i > 0}
                    className="max-w-[92%] border-l-2 border-moradovivo pl-3 font-mono text-[0.875rem] leading-relaxed"
                  />
                )}
                {m.acciones && m.acciones.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-3.5">
                    {m.acciones.map((a, j) => (
                      <BotonAccion key={j} accion={a} t={t} ejecutar={ejecutar} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="border-t border-linea px-4 pt-3">
            <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {t.radio.sugerencias.map((s) => (
                <li key={s} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      enviar(s);
                      entrada.current?.focus();
                    }}
                    className="border border-linea px-2.5 py-1.5 font-mono text-etiqueta text-atenuado hover:border-tinta hover:text-tinta"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form
            className="flex items-center gap-2 px-4 pb-4 pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              const campo = entrada.current;
              if (!campo) return;
              enviar(campo.value);
              campo.value = "";
            }}
          >
            <label htmlFor="radio-entrada" className="sr-only">
              {t.radio.etiquetaEntrada}
            </label>
            <span aria-hidden="true" className="font-mono text-morado">›</span>
            <input
              ref={entrada}
              id="radio-entrada"
              type="text"
              autoComplete="off"
              enterKeyHint="send"
              placeholder={t.radio.placeholder}
              className="min-w-0 flex-1 border-b border-lineafuerte bg-transparent py-2 font-mono text-[0.9375rem] placeholder:text-tenue focus:border-morado focus:outline-none"
            />
            <button
              type="submit"
              className="barrido h-10 border border-tinta bg-tinta px-4 font-mono text-etiqueta uppercase tracking-[0.1em] text-papel [--barrido:var(--c-morado)] hover:border-morado hover:text-sobremorado"
            >
              {t.radio.enviar}
            </button>
          </form>
        </div>
      </dialog>

      <AvisoSector t={t} />
      <BotonFlotante t={t} />
    </>
  );
}

function BotonAccion({
  accion,
  t,
  ejecutar,
}: {
  accion: Accion;
  t: Diccionario;
  ejecutar: (a: Accion) => void;
}) {
  const clase =
    "inline-flex items-center gap-1.5 border border-tinta px-3 py-1.5 font-mono text-etiqueta uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel";
  if (accion.tipo === "enlace") {
    const externo = accion.href.startsWith("http");
    return (
      <a
        href={accion.href}
        className={clase}
        {...(accion.descarga ? { download: accion.descarga } : {})}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {accion.texto}
        {externo && (
          <>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{t.garage.enlaceExterno}</span>
          </>
        )}
      </a>
    );
  }
  return (
    <button type="button" className={clase} onClick={() => ejecutar(accion)}>
      {accion.texto}
    </button>
  );
}

/** Texto que se escribe solo. El lector de pantalla no lo oye: tiene su copia. */
function Tipeo({ texto, animar, className }: { texto: string; animar: boolean; className?: string }) {
  const [n, setN] = useState(animar ? 0 : texto.length);

  useEffect(() => {
    if (!animar || sinMovimiento()) {
      setN(texto.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((x) => {
        if (x >= texto.length) {
          clearInterval(id);
          return x;
        }
        return x + 2;
      });
    }, 14);
    return () => clearInterval(id);
  }, [texto, animar]);

  return (
    <p aria-hidden="true" className={cn(className, n < texto.length && "cursor-radio")}>
      {texto.slice(0, n)}
    </p>
  );
}

/** Ondas de la radio: tres barras que solo se mueven con movimiento permitido. */
function Onda() {
  return (
    <span aria-hidden="true" className="onda flex h-4 items-end gap-[3px]">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

/**
 * Aviso que aparece al entrar a cada sector. Solo una vez por sector y por
 * vuelta, y se va solo a los seis segundos.
 */
function AvisoSector({ t }: { t: Diccionario }) {
  const carrera = useCarrera();
  const vistos = useRef(new Set<Sector>());
  const [aviso, setAviso] = useState<{ sector: Sector; texto: string } | null>(null);

  useEffect(() => {
    const s = carrera.actual;
    if (!s || vistos.current.has(s)) return;
    vistos.current.add(s);
    const texto =
      s === "box" && carrera.final !== null
        ? `${t.radio.sectores.box} ${t.radio.vuelta}: ${formatearTiempo(carrera.final)}.`
        : t.radio.sectores[s];
    setAviso({ sector: s, texto });
    const id = setTimeout(() => setAviso(null), 6500);
    return () => clearTimeout(id);
  }, [carrera.actual, carrera.final, t]);

  // Una vuelta nueva vuelve a dar los avisos.
  useEffect(() => {
    vistos.current.clear();
  }, [carrera.inicio]);

  if (!aviso) return null;
  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => abrirRadio()}
      key={aviso.sector}
      className="aviso-radio fixed bottom-20 left-1/2 z-40 flex w-[min(560px,calc(100%-32px))] -translate-x-1/2 items-start gap-3 border border-tinta bg-panelalto px-4 py-3 text-left shadow-[5px_5px_0_var(--c-tinta)] md:bottom-6"
    >
      <span className="mono-etiqueta shrink-0 pt-0.5 text-morado">{t.radio.apex}</span>
      <Tipeo texto={aviso.texto} animar className="font-mono text-[0.8125rem] leading-snug" />
    </button>
  );
}

/** Radio flotante del teléfono, con el cronómetro de la vuelta. */
function BotonFlotante({ t }: { t: Diccionario }) {
  const carrera = useCarrera();
  const salida = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = salida.current;
    if (!el) return;
    if (carrera.final !== null) {
      el.textContent = formatearTiempo(carrera.final, 1);
      return;
    }
    const pintar = () => (el.textContent = formatearTiempo(performance.now() - leer().inicio, 0));
    pintar();
    const id = setInterval(pintar, 1000);
    return () => clearInterval(id);
  }, [carrera.final, carrera.inicio]);

  return (
    <button
      type="button"
      onClick={() => abrirRadio()}
      className="fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2.5 border border-tinta bg-tinta pl-3.5 pr-4 text-papel shadow-[4px_4px_0_var(--c-morado-vivo)] md:hidden"
    >
      <IconoRadio aria-hidden="true" className="size-4" />
      <span className="font-mono text-etiqueta uppercase tracking-[0.1em]">{t.hud.radio}</span>
      <span aria-hidden="true" ref={salida} className="min-w-[3.5ch] border-l border-[color-mix(in_srgb,var(--c-papel)_35%,transparent)] pl-2.5 font-mono text-etiqueta tnum">
        0
      </span>
      <span className="sr-only">· {t.hud.abrirRadio}</span>
    </button>
  );
}
