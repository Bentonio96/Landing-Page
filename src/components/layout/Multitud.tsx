"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * «The footer is the main character now»: la multitud del pie.
 *
 * Gente dibujada a línea, en blanco y negro, generada aquí mismo con una
 * semilla (no es la ilustración del reel: cada persona sale de combinar
 * peinados, ropa, caras y accesorios). Benjamín va al centro, de frente y
 * aislado, dibujado con el mismo trazo a partir de su foto; la gente pasa
 * caminando por delante de él.
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
  const torso = `M ${-w - 3} 60 L ${-w} -58 Q ${-w + 2} -78 -20 -82 L 20 -82 Q ${w - 2} -78 ${w} -58 L ${w + 3} 60 Z`;

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
    ropa.push(<path key="bt" d="M 0 -73 L 0 60" stroke={linea} />);
  }
  if (p.ropa === "rayas") {
    for (let y = -64; y < 60; y += 11) ropa.push(<path key={`r${y}`} d={`M ${-w + 3} ${y} L ${w - 3} ${y}`} stroke={linea} />);
    ropa.push(<path key="cu" d="M -12 -82 Q 0 -72 12 -82" fill="none" stroke={linea} />);
  }
  if (p.ropa === "chaqueta") {
    ropa.push(<path key="in" d="M -12 -82 L -8 60 L 8 60 L 12 -82 Z" fill={p.tonoRopa === "negro" ? PAPEL : "#EDEDED"} stroke={TINTA} />);
    ropa.push(<path key="so" d="M -12 -82 L -20 -56 L -10 -50 M 12 -82 L 20 -56 L 10 -50" fill="none" stroke={linea} />);
  }
  // pliegues de los brazos
  ropa.push(<path key="br" d={`M ${-w + 10} -48 L ${-w + 11} 60 M ${w - 10} -48 L ${w - 11} 60`} stroke={linea} />);

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
    extra.push(<path key="ti" d={`M ${-w + 10} -76 L ${-w + 16} 60 M ${w - 10} -76 L ${w - 16} 60`} stroke={TINTA} strokeWidth={5} />);
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

/**
 * Benjamín de frente, con el mismo trazo que la multitud y sacado de su foto
 * en el cerro: pelo corto oscuro y texturizado con un flequillo desordenado,
 * lentes de sol rectangulares, polerón con capucha, cordones y la etiqueta
 * blanca en el pecho. (0, 0) es el punto entre sus pies; mide ~400 de alto.
 */
function DibujoBenjamin() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round" stroke={TINTA} strokeWidth={1.6}>
      {/* piernas y zapatillas */}
      <path d="M -27 -150 L -27 -14 L -5 -14 L -2 -150 Z M 2 -150 L 5 -14 L 27 -14 L 27 -150 Z" fill={TINTA} />
      <path d="M -6 -100 L -4 -14 M 6 -100 L 4 -14" stroke={PAPEL} strokeWidth={1} />
      <path d="M -31 -14 L -4 -14 L -3 0 L -36 0 Q -38 -9 -31 -14 Z M 4 -14 L 31 -14 Q 38 -9 36 0 L 3 0 Z" fill={PAPEL} />
      {/* brazos (mangas) y manos */}
      <path d="M -46 -282 Q -62 -240 -60 -170 L -44 -168 Q -44 -226 -38 -256 Z M 46 -282 Q 62 -240 60 -170 L 44 -168 Q 44 -226 38 -256 Z" fill={TINTA} />
      <path d="M -60 -172 L -44 -170 M 60 -172 L 44 -170" stroke={PAPEL} strokeWidth={1} />
      <path d="M -60 -170 Q -62 -152 -52 -150 Q -43 -152 -44 -168 Z M 60 -170 Q 62 -152 52 -150 Q 43 -152 44 -168 Z" fill={PAPEL} />
      {/* polerón */}
      <path d="M -46 -280 Q -46 -298 -24 -303 L 24 -303 Q 46 -298 46 -280 L 47 -146 Q 0 -140 -47 -146 Z" fill={TINTA} />
      <path d="M -45 -160 Q 0 -154 45 -160" fill="none" stroke={PAPEL} strokeWidth={1} />
      <path d="M -40 -232 L -38 -160 M 40 -232 L 38 -160" fill="none" stroke={PAPEL} strokeWidth={0.8} opacity={0.6} />
      {/* etiqueta blanca del pecho */}
      <rect x={13} y={-252} width={24} height={6} fill={PAPEL} stroke="none" />
      {/* cuello */}
      <path d="M -8 -318 L -8 -298 L 8 -298 L 8 -318" fill={PAPEL} />
      {/* capucha alrededor del cuello */}
      <path d="M -28 -304 Q -34 -290 -18 -282 Q 0 -274 18 -282 Q 34 -290 28 -304 Q 14 -296 0 -296 Q -14 -296 -28 -304 Z" fill={TINTA} />
      <path d="M -22 -296 Q 0 -286 22 -296" fill="none" stroke={PAPEL} strokeWidth={1} />
      {/* cordones con sus puntas */}
      <path d="M -7 -288 Q -9 -260 -11 -232 M 7 -288 Q 9 -256 12 -224" fill="none" stroke={PAPEL} strokeWidth={1.6} />
      <path d="M -11 -232 L -11 -226 M 12 -224 L 12 -218" stroke={PAPEL} strokeWidth={3} />
      {/* orejas y cara */}
      <ellipse cx={-22} cy={-342} rx={4.5} ry={7} fill={PAPEL} />
      <ellipse cx={22} cy={-342} rx={4.5} ry={7} fill={PAPEL} />
      <path d="M -22 -350 Q -23 -322 -12 -315 Q 0 -310 12 -315 Q 23 -322 22 -350 Q 22 -372 0 -373 Q -22 -372 -22 -350 Z" fill={PAPEL} />
      {/* pelo corto texturizado: volumen arriba, flequillo desordenado, lados cortos */}
      <path
        d="M -23 -346 Q -26 -362 -20 -371 Q -19 -380 -10 -381 Q -6 -388 1 -385 Q 6 -390 12 -385 Q 20 -387 22 -379 Q 28 -373 26 -362 Q 27 -352 23 -346 Q 22 -356 18 -359 Q 16 -353 13 -357 Q 11 -362 8 -357 Q 5 -363 1 -359 Q -3 -363 -7 -360 Q -11 -363 -14 -361 Q -20 -357 -23 -346 Z"
        fill={TINTA}
      />
      <path d="M -14 -373 q 4 -4 8 -2 M -2 -378 q 4 -3 8 -1 M 9 -374 q 4 -2 7 1 M -18 -365 q 3 -3 6 -2 M 15 -366 q 3 -2 5 1" fill="none" stroke={PAPEL} strokeWidth={1} />
      {/* lentes de sol rectangulares */}
      <path d="M -21 -350 L -2 -350 L -3 -339 Q -10 -334 -18 -337 Q -21 -342 -21 -350 Z M 2 -350 L 21 -350 Q 21 -342 18 -337 Q 10 -334 3 -339 Z" fill={TINTA} />
      <path d="M -2 -348 L 2 -348 M -21 -349 L -23 -347 M 21 -349 L 23 -347" />
      <path d="M -16 -347 L -12 -341 M 7 -347 L 11 -341" stroke={PAPEL} strokeWidth={1} />
      {/* nariz, boca seria y mentón */}
      <path d="M 0 -336 Q 2 -329 -2 -327" fill="none" />
      <path d="M -6 -321 Q 0 -319 6 -321" fill="none" />
    </g>
  );
}

/** Alto y ancho de Benjamín en sus coordenadas locales. */
const BENJA = { alto: 392, ancho: 124 };

type Lugar = { id: number; x: number; y: number; s: number; fila: number };

/**
 * La composición del reel: una fila de atrás que corta a la altura de la
 * cintura (el «suelo» blanco la tapa), Benjamín de cuerpo entero en un claro
 * al centro y una fila de adelante con cabezas grandes que el borde corta en
 * los hombros. La gente va en grupos chicos con aire entre ellos, no en muro.
 */
function armar(W: number, H: number, semilla: number) {
  const k = H / 480;
  const centro = W / 2;
  const suelo = Math.round(H * 0.7);
  const benjaEscala = (H * 0.72) / BENJA.alto;
  const claro = (BENJA.ancho / 2) * benjaEscala;
  const r = azar(semilla);
  const lugares: Lugar[] = [];
  let id = 0;
  const hilera = (fila: number, y: number, s: number, hueco: number, grupo: [number, number], aire: [number, number]) => {
    const ancho = 92 * s;
    let x = -ancho * (0.1 + r() * 0.4);
    while (x < W + ancho * 0.5) {
      const n = grupo[0] + Math.floor(r() * (grupo[1] - grupo[0] + 1));
      for (let j = 0; j < n && x < W + ancho * 0.5; j++) {
        if (Math.abs(x - centro) > hueco + ancho * 0.45) {
          lugares.push({ id: id++, x, y: y + (r() - 0.5) * 6 * k, s: s * (0.93 + r() * 0.14), fila });
        }
        x += ancho * (0.66 + r() * 0.14);
      }
      x += ancho * (aire[0] + r() * (aire[1] - aire[0]));
    }
  };
  // Atrás: busto más chico, cortado por el suelo.
  hilera(0, suelo, 1.12 * k, claro * 2.1, [2, 4], [0.35, 1.1]);
  // Adelante: cabezas grandes, cortadas por el borde de abajo.
  const sAdelante = 1.42 * k;
  const yAdelante = H * 0.68 + 160 * sAdelante;
  hilera(2, yAdelante, sAdelante, claro * 0.55, [1, 3], [0.25, 1.2]);
  // Gente que pasa caminando por delante de él, de un lado al otro.
  const caminantes = [0, 1, 2].map((i) => ({
    i,
    s: sAdelante * (0.95 + r() * 0.1),
    y: yAdelante + 8 * k,
    sentido: i % 2 === 0 ? 1 : -1,
    duracion: (W + 360 * k) / ((52 + r() * 26) * k),
    retraso: -r() * 18 - i * 6,
  }));
  return { lugares, k, centro, suelo, benjaEscala, caminantes };
}

export function Multitud({ trafico, descripcion }: { trafico: string; descripcion: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState<{ W: number; H: number } | null>(null);
  const [semillas, setSemillas] = useState<number[]>([]);
  const [paseantes, setPaseantes] = useState<number[]>([777, 31337, 4242]);
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

  const fila = (n: number) =>
    plano!.lugares
      .filter((l) => l.fila === n)
      .map((l) => (
        <g key={l.id} transform={`translate(${l.x} ${l.y}) scale(${l.s})`}>
          <g
            className="persona"
            style={{ ["--fila" as string]: n, ["--retraso" as string]: `${(l.id % 9) * 0.05}s` }}
            onClick={() => cambiar(l.id)}
          >
            <g key={semillas[l.id]} className="persona__entra">
              {semillas[l.id] !== undefined ? <DibujoPersona p={crearPersona(semillas[l.id])} /> : null}
            </g>
          </g>
        </g>
      ));

  return (
    <div className="banda-ciudad relative overflow-hidden">
      <p aria-hidden="true" className="marca-agua pointer-events-none absolute left-1/2 top-[4%] -translate-x-1/2 select-none">
        BENJAMÍN.
      </p>
      <div
        ref={caja}
        role="img"
        aria-label={descripcion}
        className={`multitud relative h-[clamp(15rem,34vw,30rem)] w-full ${visible || quieta ? "multitud--llega" : ""} ${visible && !quieta ? "multitud--camina" : ""}`}
      >
        {tam && plano ? (
          <svg aria-hidden="true" width={tam.W} height={tam.H} viewBox={`0 0 ${tam.W} ${tam.H}`} className="absolute inset-0 block">
            {fila(0)}
            <rect x={0} y={plano.suelo} width={tam.W} height={tam.H - plano.suelo} fill={PAPEL} />
            <g transform={`translate(${plano.centro} ${tam.H - 3 * plano.k}) scale(${plano.benjaEscala})`}>
              <g className="persona persona--benja" style={{ ["--fila" as string]: 1.5, ["--retraso" as string]: "0.1s" }}>
                <DibujoBenjamin />
              </g>
            </g>
            {fila(2)}
            {/* Los que pasan caminando por delante. Cada vuelta llega otra persona. */}
            {quieta
              ? null
              : plano.caminantes.map((c) => (
                  <g
                    key={c.i}
                    className="caminante"
                    style={{
                      ["--desde" as string]: `${c.sentido > 0 ? -180 * plano.k : tam.W + 180 * plano.k}px`,
                      ["--hasta" as string]: `${c.sentido > 0 ? tam.W + 180 * plano.k : -180 * plano.k}px`,
                      animationDuration: `${c.duracion}s`,
                      animationDelay: `${c.retraso}s`,
                    }}
                    onAnimationIteration={() =>
                      setPaseantes((prev) => prev.map((v, j) => (j === c.i ? Math.floor(Math.random() * 1e9) : v)))
                    }
                  >
                    <g transform={`translate(0 ${c.y}) scale(${c.s})`}>
                      <g className="caminante__paso">
                        <DibujoPersona p={{ ...crearPersona(paseantes[c.i]), giro: c.sentido * 8 }} />
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
