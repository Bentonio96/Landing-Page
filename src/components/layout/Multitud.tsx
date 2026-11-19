"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * «The footer is the main character now»: la multitud del pie.
 *
 * Gente dibujada a línea, en blanco y negro, generada aquí mismo con una
 * semilla (no es la ilustración del reel: cada persona sale de combinar
 * peinados, ropa, caras y accesorios). Benjamín va al centro, ilustrado en
 * tinta a partir de su foto: copete, lentes de sol y polerón negro.
 *
 * - Al entrar en pantalla, las filas suben desde abajo, de atrás hacia
 *   adelante.
 * - Cada pocos segundos una persona se va y llega otra: la multitud cambia,
 *   como en el reel. Un clic sobre alguien también la cambia.
 * - Al pasar el cursor, la persona da un saltito.
 * - Con movimiento reducido llega armada y quieta; el clic sigue funcionando.
 */

type Persona = {
  semilla: number;
  pelo: "corto" | "rizos" | "largo" | "moño" | "cola" | "calvo" | "jockey" | "gorro" | "pañuelo" | "punta" | "lado";
  canas: boolean;
  ropa: "polera" | "poleron" | "camisa" | "rayas" | "chaqueta" | "sweater";
  tonoRopa: "blanco" | "negro" | "gris";
  ojos: "puntos" | "felices";
  boca: "sonrisa" | "abierta" | "recta" | "o";
  cejas: number;
  lentes: "no" | "redondos" | "cuadrados";
  barba: "no" | "barba" | "bigote";
  aros: boolean;
  extra: "no" | "audifonos" | "telefono" | "cafe" | "mochila";
  giro: number;
  mirada: number;
  ancho: number;
};

function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function elegir<T>(r: () => number, opciones: readonly T[]): T {
  return opciones[Math.floor(r() * opciones.length)];
}

function crearPersona(semilla: number): Persona {
  const r = azar(semilla);
  const pelo = elegir(r, ["corto", "rizos", "largo", "moño", "cola", "calvo", "jockey", "gorro", "pañuelo", "punta", "lado", "largo", "corto", "rizos"] as const);
  return {
    semilla,
    pelo,
    canas: r() < 0.16,
    ropa: elegir(r, ["polera", "poleron", "camisa", "rayas", "chaqueta", "sweater", "polera"] as const),
    tonoRopa: r() < 0.62 ? "blanco" : r() < 0.6 ? "negro" : "gris",
    ojos: r() < 0.72 ? "puntos" : "felices",
    boca: elegir(r, ["sonrisa", "sonrisa", "abierta", "abierta", "recta", "o"] as const),
    cejas: (r() - 0.5) * 6,
    lentes: r() < 0.62 ? "no" : r() < 0.6 ? "redondos" : "cuadrados",
    barba: pelo === "largo" || pelo === "moño" || pelo === "cola" || pelo === "pañuelo" ? "no" : r() < 0.68 ? "no" : r() < 0.5 ? "barba" : "bigote",
    aros: r() < 0.25,
    extra: elegir(r, ["no", "no", "no", "audifonos", "telefono", "cafe", "mochila"] as const),
    giro: (r() - 0.5) * 12,
    mirada: (r() - 0.5) * 4,
    ancho: 0.9 + r() * 0.22,
  };
}

const TINTA = "#111111";
const PAPEL = "#FFFFFF";
const GRIS = "#BDBDBD";

/** Una persona en coordenadas locales: (0, 0) es el centro de la base del torso. */
function DibujoPersona({ p }: { p: Persona }) {
  const relleno = p.tonoRopa === "negro" ? TINTA : p.tonoRopa === "gris" ? "#D9D9D9" : PAPEL;
  const linea = p.tonoRopa === "negro" ? PAPEL : TINTA;
  const colorPelo = p.canas ? GRIS : TINTA;
  const w = 44 * p.ancho;
  const torso = `M ${-w - 2} 2 L ${-w} -58 Q ${-w + 2} -78 -20 -82 L 20 -82 Q ${w - 2} -78 ${w} -58 L ${w + 2} 2 Z`;

  const cabezaY = -122;
  const ropa: ReactNode[] = [];
  if (p.ropa === "polera" || p.ropa === "sweater") {
    ropa.push(<path key="cu" d="M -12 -82 Q 0 -70 12 -82" fill="none" stroke={linea} />);
    if (p.ropa === "sweater") {
      ropa.push(<path key="pu" d={`M ${-w + 6} -6 L ${w - 6} -6`} stroke={linea} />);
      ropa.push(<path key="cu2" d="M -14 -82 Q 0 -66 14 -82" fill="none" stroke={linea} />);
    }
  }
  if (p.ropa === "poleron") {
    ropa.push(<path key="ca" d="M -26 -80 Q 0 -58 26 -80" fill="none" stroke={linea} />);
    ropa.push(<path key="co" d="M -6 -70 L -7 -46 M 6 -70 L 7 -46" stroke={linea} />);
    ropa.push(<path key="bo" d={`M ${-w * 0.55} -18 L ${w * 0.55} -18`} stroke={linea} />);
  }
  if (p.ropa === "camisa") {
    ropa.push(<path key="cl" d="M -13 -82 L -17 -68 L -3 -73 L 0 -82 L 3 -73 L 17 -68 L 13 -82" fill={relleno} stroke={linea} />);
    ropa.push(<path key="bt" d="M 0 -73 L 0 2" stroke={linea} />);
  }
  if (p.ropa === "rayas") {
    for (let y = -64; y < 0; y += 11) ropa.push(<path key={`r${y}`} d={`M ${-w + 3} ${y} L ${w - 3} ${y}`} stroke={linea} />);
    ropa.push(<path key="cu" d="M -12 -82 Q 0 -72 12 -82" fill="none" stroke={linea} />);
  }
  if (p.ropa === "chaqueta") {
    ropa.push(<path key="in" d="M -12 -82 L -8 2 L 8 2 L 12 -82 Z" fill={p.tonoRopa === "negro" ? PAPEL : "#EDEDED"} stroke={TINTA} />);
    ropa.push(<path key="so" d="M -12 -82 L -20 -56 L -10 -50 M 12 -82 L 20 -56 L 10 -50" fill="none" stroke={linea} />);
  }
  // pliegues de los brazos
  ropa.push(<path key="br" d={`M ${-w + 10} -48 L ${-w + 11} 2 M ${w - 10} -48 L ${w - 11} 2`} stroke={linea} />);

  const extra: ReactNode[] = [];
  if (p.extra === "audifonos") {
    extra.push(<path key="ar" d="M -20 -84 Q 0 -66 20 -84" fill="none" stroke={TINTA} strokeWidth={4} />);
    extra.push(<ellipse key="i" cx={-21} cy={-82} rx={6} ry={8} fill={TINTA} />);
    extra.push(<ellipse key="d" cx={21} cy={-82} rx={6} ry={8} fill={TINTA} />);
  }
  if (p.extra === "telefono") {
    extra.push(<rect key="t" x={-8} y={-40} width={14} height={22} rx={2} fill={TINTA} stroke={TINTA} />);
    extra.push(<path key="m" d="M -14 -22 Q -16 -34 -8 -36 L 8 -36 Q 14 -30 10 -20 Z" fill={PAPEL} stroke={TINTA} />);
  }
  if (p.extra === "cafe") {
    extra.push(<path key="v" d="M 8 -38 L 26 -38 L 24 -12 L 10 -12 Z" fill={PAPEL} stroke={TINTA} />);
    extra.push(<path key="ta" d="M 6 -42 L 28 -42 L 27 -38 L 7 -38 Z" fill={TINTA} />);
    extra.push(<path key="mn" d="M 6 -30 Q 2 -24 10 -18" fill="none" stroke={TINTA} />);
  }
  if (p.extra === "mochila") {
    extra.push(<path key="ti" d={`M ${-w + 10} -76 L ${-w + 16} 2 M ${w - 10} -76 L ${w - 16} 2`} stroke={TINTA} strokeWidth={5} />);
  }

  // Pelo de atrás (cae sobre los hombros) y de adelante.
  const atras: ReactNode[] = [];
  const adelante: ReactNode[] = [];
  const tope = "M -24 -124 Q -27 -158 0 -159 Q 27 -158 24 -124 Q 18 -142 0 -143 Q -16 -142 -24 -124 Z";
  switch (p.pelo) {
    case "corto":
      adelante.push(<path key="p" d={tope} fill={colorPelo} stroke={TINTA} />);
      break;
    case "lado":
      adelante.push(<path key="p" d="M -25 -118 Q -30 -160 4 -160 Q 28 -156 25 -122 Q 22 -136 12 -140 Q -6 -150 -18 -132 Q -22 -126 -25 -118 Z" fill={colorPelo} stroke={TINTA} />);
      break;
    case "punta":
      adelante.push(<path key="p" d="M -24 -124 L -26 -146 L -16 -142 L -14 -162 L -4 -150 L 2 -166 L 8 -150 L 18 -162 L 18 -144 L 27 -148 L 24 -124 Q 12 -140 0 -140 Q -12 -140 -24 -124 Z" fill={colorPelo} stroke={TINTA} />);
      break;
    case "rizos": {
      const bolas: ReactNode[] = [];
      for (let i = 0; i < 11; i++) {
        const a = Math.PI * (0.95 + (i / 10) * 1.1);
        bolas.push(<circle key={i} cx={Math.cos(a) * 25} cy={cabezaY - 6 + Math.sin(a) * 30} r={9} fill={colorPelo} stroke={TINTA} />);
      }
      adelante.push(<g key="r">{bolas}</g>);
      break;
    }
    case "largo":
      atras.push(<path key="a" d="M -27 -130 Q -34 -96 -38 -74 L -14 -76 Q -18 -100 -20 -120 Z M 27 -130 Q 34 -96 38 -74 L 14 -76 Q 18 -100 20 -120 Z" fill={colorPelo} stroke={TINTA} />);
      adelante.push(<path key="p" d="M -26 -112 Q -30 -160 0 -160 Q 30 -160 26 -112 Q 22 -138 4 -146 Q -14 -136 -26 -112 Z" fill={colorPelo} stroke={TINTA} />);
      break;
    case "moño":
      adelante.push(<circle key="m" cx={0} cy={-164} r={11} fill={colorPelo} stroke={TINTA} />);
      adelante.push(<path key="p" d={tope} fill={colorPelo} stroke={TINTA} />);
      break;
    case "cola":
      atras.push(<path key="c" d="M 20 -146 Q 44 -140 38 -100 Q 30 -118 22 -128 Z" fill={colorPelo} stroke={TINTA} />);
      adelante.push(<path key="p" d={tope} fill={colorPelo} stroke={TINTA} />);
      break;
    case "calvo":
      adelante.push(<path key="p" d="M -24 -118 Q -26 -134 -20 -140 M 24 -118 Q 26 -134 20 -140" fill="none" stroke={colorPelo === GRIS ? "#8F8F8F" : TINTA} strokeWidth={3} />);
      break;
    case "jockey":
      adelante.push(<path key="g" d="M -25 -128 Q -24 -162 0 -162 Q 24 -162 25 -128 Z" fill={p.tonoRopa === "negro" ? PAPEL : TINTA} stroke={TINTA} />);
      adelante.push(<path key="v" d="M -26 -128 L 34 -128 Q 36 -122 26 -122 L -26 -124 Z" fill={TINTA} stroke={TINTA} />);
      break;
    case "gorro":
      adelante.push(<path key="g" d="M -26 -124 Q -26 -166 0 -166 Q 26 -166 26 -124 Z" fill="#D9D9D9" stroke={TINTA} />);
      adelante.push(<path key="b" d="M -27 -130 L 27 -130 L 27 -122 L -27 -122 Z" fill={PAPEL} stroke={TINTA} />);
      for (let x = -18; x <= 18; x += 9) adelante.push(<path key={x} d={`M ${x} -134 L ${x} -160`} stroke={TINTA} strokeWidth={1} />);
      break;
    case "pañuelo":
      atras.push(<path key="a" d="M -32 -122 Q -36 -170 0 -170 Q 36 -170 32 -122 L 38 -78 L -38 -78 Z" fill={p.tonoRopa === "negro" ? PAPEL : TINTA} stroke={TINTA} />);
      break;
  }

  const ojos =
    p.ojos === "puntos" ? (
      <g fill={TINTA}>
        <circle cx={-9 + p.mirada} cy={-125} r={2.3} />
        <circle cx={9 + p.mirada} cy={-125} r={2.3} />
      </g>
    ) : (
      <path d={`M -13 -124 Q -9 -129 -5 -124 M 5 -124 Q 9 -129 13 -124`} fill="none" stroke={TINTA} />
    );
  const boca = {
    sonrisa: <path d="M -8 -107 Q 0 -100 8 -107" fill="none" stroke={TINTA} />,
    abierta: <path d="M -9 -108 Q 0 -94 9 -108 Z" fill={TINTA} stroke={TINTA} />,
    recta: <path d="M -5 -105 L 5 -105" stroke={TINTA} />,
    o: <ellipse cx={0} cy={-105} rx={3} ry={4} fill={PAPEL} stroke={TINTA} />,
  }[p.boca];

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {atras}
      {/* cuello */}
      <path d="M -9 -98 L -9 -80 L 9 -80 L 9 -98" fill={PAPEL} stroke={TINTA} />
      <path d={torso} fill={relleno} stroke={TINTA} />
      {ropa}
      {extra}
      <g transform={`rotate(${p.giro} 0 -96)`}>
        {p.pelo === "pañuelo" ? null : (
          <>
            <ellipse cx={-23} cy={-121} rx={4.5} ry={7} fill={PAPEL} stroke={TINTA} />
            <ellipse cx={23} cy={-121} rx={4.5} ry={7} fill={PAPEL} stroke={TINTA} />
          </>
        )}
        {p.aros ? <circle cx={-23} cy={-111} r={2.5} fill="none" stroke={TINTA} /> : null}
        <ellipse cx={0} cy={cabezaY} rx={p.pelo === "pañuelo" ? 20 : 23} ry={p.pelo === "pañuelo" ? 25 : 28} fill={PAPEL} stroke={TINTA} />
        {p.barba === "barba" ? (
          <path d="M -22 -122 Q -20 -96 0 -94 Q 20 -96 22 -122 Q 16 -104 0 -103 Q -16 -104 -22 -122 Z" fill={colorPelo} stroke={TINTA} />
        ) : null}
        {p.barba === "bigote" ? <path d="M -9 -111 Q 0 -116 9 -111 Q 0 -108 -9 -111 Z" fill={colorPelo} stroke={TINTA} /> : null}
        {adelante}
        <path d={`M -14 ${-134 + p.cejas * 0.3} L -5 ${-135 - p.cejas * 0.3} M 5 ${-135 - p.cejas * 0.3} L 14 ${-134 + p.cejas * 0.3}`} stroke={TINTA} strokeWidth={2} />
        {ojos}
        <path d="M 1 -121 Q 4 -114 -1 -112" fill="none" stroke={TINTA} />
        {boca}
        {p.lentes === "redondos" ? (
          <path d="M -15.5 -125 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 M 2.5 -125 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 M -2.5 -126 L 2.5 -126" fill="none" stroke={TINTA} />
        ) : null}
        {p.lentes === "cuadrados" ? (
          <path d="M -17 -131 L -3 -131 L -3 -120 L -17 -120 Z M 3 -131 L 17 -131 L 17 -120 L 3 -120 Z M -3 -127 L 3 -127" fill="none" stroke={TINTA} />
        ) : null}
      </g>
    </g>
  );
}

/** Proporción del retrato ilustrado (public/benjamin-ilustrado.png, 887 × 862). */
const RETRATO = { w: 887, h: 862 };

type Lugar = { id: number; x: number; y: number; s: number; fila: number };

function armar(W: number, H: number, semilla: number) {
  const k = H / 480;
  const centro = W / 2;
  // Benjamín: el retrato ilustrado, apoyado abajo al centro.
  const benjaAlto = Math.min(H * 0.78, (W * 0.62 * RETRATO.h) / RETRATO.w);
  const benjaAncho = (benjaAlto * RETRATO.w) / RETRATO.h;
  const lugares: Lugar[] = [];
  const filas = [
    { y: H - 150 * k, s: 0.95 * k, paso: 74 * k, fila: 0 },
    { y: H - 70 * k, s: 1.08 * k, paso: 86 * k, fila: 1 },
    { y: H + 6 * k, s: 1.25 * k, paso: 100 * k, fila: 2 },
  ];
  const r = azar(semilla);
  let id = 0;
  for (const f of filas) {
    let x = -f.paso * (0.2 + r() * 0.5);
    while (x < W + f.paso) {
      const hueco = f.fila === 2 ? benjaAncho * 0.42 : f.fila === 1 ? benjaAncho * 0.22 : 0;
      if (Math.abs(x - centro) > hueco) {
        const s = f.s * (r() < 0.12 && f.fila === 2 ? 0.78 : 0.94 + r() * 0.12);
        lugares.push({ id: id++, x: x + (r() - 0.5) * f.paso * 0.3, y: f.y, s, fila: f.fila });
      }
      x += f.paso * (0.85 + r() * 0.3);
    }
  }
  return { lugares, k, benja: { x: centro - benjaAncho / 2, y: H - benjaAlto, w: benjaAncho, h: benjaAlto } };
}

export function Multitud({ trafico, descripcion }: { trafico: string; descripcion: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState<{ W: number; H: number } | null>(null);
  const [semillas, setSemillas] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [quieta, setQuieta] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    setQuieta(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.hasAttribute("data-reducido"),
    );
    const medir = () => {
      const W = Math.round(el.clientWidth);
      const H = Math.round(el.clientHeight);
      setTam((t) => (t && Math.abs(t.W - W) < 2 && t.H === H ? t : { W, H }));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const plano = tam ? armar(tam.W, tam.H, 2911) : null;
  const total = plano?.lugares.length ?? 0;

  // Una semilla por lugar; se conservan al cambiar de tamaño.
  useEffect(() => {
    if (!total) return;
    setSemillas((prev) => Array.from({ length: total }, (_, i) => prev[i] ?? 1000 + i * 7919));
  }, [total]);

  // La multitud cambia sola: cada 2,4 s alguien se va y llega otra persona.
  useEffect(() => {
    if (!visible || quieta || !total) return;
    const reloj = window.setInterval(() => {
      setSemillas((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const nuevas = prev.slice();
        nuevas[i] = Math.floor(Math.random() * 1e9);
        return nuevas;
      });
    }, 2400);
    return () => window.clearInterval(reloj);
  }, [visible, quieta, total]);

  function cambiar(i: number) {
    setSemillas((prev) => {
      const nuevas = prev.slice();
      nuevas[i] = Math.floor(Math.random() * 1e9);
      return nuevas;
    });
  }

  return (
    <div className="banda-ciudad relative overflow-hidden">
      <p aria-hidden="true" className="marca-agua pointer-events-none absolute left-1/2 top-[4%] -translate-x-1/2 select-none">
        BENJAMÍN.
      </p>
      <div
        ref={caja}
        role="img"
        aria-label={descripcion}
        className={`multitud relative h-[clamp(20rem,40vw,34rem)] w-full ${visible || quieta ? "multitud--llega" : ""}`}
      >
        {tam && plano ? (
          <svg aria-hidden="true" width={tam.W} height={tam.H} viewBox={`0 0 ${tam.W} ${tam.H}`} className="absolute inset-0 block">
            {[0, 1].map((fila) =>
              plano.lugares
                .filter((l) => l.fila === fila)
                .map((l) => (
                  <g key={l.id} transform={`translate(${l.x} ${l.y}) scale(${l.s})`}>
                    <g
                      className="persona"
                      style={{ ["--fila" as string]: fila, ["--retraso" as string]: `${(l.id % 9) * 0.05}s` }}
                      onClick={() => cambiar(l.id)}
                    >
                      <g key={semillas[l.id]} className="persona__entra">
                        {semillas[l.id] !== undefined ? <DibujoPersona p={crearPersona(semillas[l.id])} /> : null}
                      </g>
                    </g>
                  </g>
                )),
            )}
            {/* Benjamín, ilustrado a partir de su foto (scripts/ilustrar-retrato.mjs) */}
            <g className="persona persona--benja" style={{ ["--fila" as string]: 1.5, ["--retraso" as string]: "0.1s" }}>
              <image
                href="/benjamin-ilustrado.png"
                x={plano.benja.x}
                y={plano.benja.y}
                width={plano.benja.w}
                height={plano.benja.h}
              />
            </g>
            {plano.lugares
              .filter((l) => l.fila === 2)
              .map((l) => (
                <g key={l.id} transform={`translate(${l.x} ${l.y}) scale(${l.s})`}>
                  <g
                    className="persona"
                    style={{ ["--fila" as string]: 2, ["--retraso" as string]: `${(l.id % 9) * 0.05}s` }}
                    onClick={() => cambiar(l.id)}
                  >
                    <g key={semillas[l.id]} className="persona__entra">
                      {semillas[l.id] !== undefined ? <DibujoPersona p={crearPersona(semillas[l.id])} /> : null}
                    </g>
                  </g>
                </g>
              ))}
          </svg>
        ) : null}
      </div>
      <div className="bg-black">
        <p className="lienzo py-3 text-[0.6875rem] text-[#B8B8B8]">{trafico}</p>
      </div>
    </div>
  );
}
