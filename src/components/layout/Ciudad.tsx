"use client";

import { useEffect, useRef, useState } from "react";

type Textos = { trafico: string; descripcion: string };

/**
 * «Empezó como un footer y terminó siendo una ciudad.»
 *
 * Una cuadra de Santiago dibujada a línea en un canvas 2D: la cordillera
 * detrás, una fila de edificios lejanos, la fila principal (con una torre
 * alta y una torre de antena), la avenida con árboles, faroles, autos que
 * pasan y, al centro, Benjamín junto a su auto violeta.
 *
 * - Los edificios se levantan uno a uno la primera vez que la banda entra
 *   en pantalla. Al terminar, la escena fija se guarda en un canvas aparte
 *   y cada cuadro solo dibuja esa imagen, las ventanas encendidas y los autos.
 * - El cursor (o el dedo) enciende las ventanas por donde pasa; se apagan
 *   solas en un par de segundos. Es el «rastro» de la página.
 * - El bucle corre solo mientras la banda está en pantalla. Con movimiento
 *   reducido no hay subida ni autos en marcha: la cuadra llega armada y el
 *   bucle solo corre mientras quede alguna ventana encendida.
 * - Los colores salen de los tokens de CSS y se releen al cambiar el tema.
 */

type Ventana = { x: number; y: number; w: number; h: number; luz: number; base: number };
type Edificio = {
  x: number;
  w: number;
  h: number;
  tipo: "caja" | "franjas" | "torre" | "antena" | "escalonado";
  ventanas: Ventana[];
  inicio: number;
};
type Auto = { x: number; carril: 0 | 1 | 2; v: number; w: number; violeta: boolean };
type Peaton = { x: number; v: number; fase: number; alto: number };
type Escena = {
  W: number;
  H: number;
  suelo: number;
  cerros: [number, number][];
  lejanos: { x: number; w: number; h: number }[];
  edificios: Edificio[];
  arboles: { x: number; r: number }[];
  faroles: number[];
  autos: Auto[];
  peatones: Peaton[];
  benja: number;
  fin: number;
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

function generar(semilla: number, W: number, H: number): Escena {
  const r = azar(semilla);
  const k = Math.min(1.25, Math.max(0.62, H / 420));
  const suelo = H - 132 * k;

  const cerros: [number, number][] = [[-20, suelo * 0.55]];
  const pasos = Math.max(6, Math.round(W / 150));
  for (let i = 0; i <= pasos; i++) {
    const x = (i / pasos) * (W + 40) - 20 + (r() - 0.5) * 30;
    const pico = i % 2 === 1;
    cerros.push([x, pico ? suelo * (0.12 + r() * 0.16) : suelo * (0.32 + r() * 0.14)]);
  }

  const lejanos: Escena["lejanos"] = [];
  for (let x = -10; x < W + 10; ) {
    const w = (34 + r() * 60) * k;
    lejanos.push({ x, w, h: suelo * (0.28 + r() * 0.22) });
    x += w + r() * 10 * k;
  }

  const edificios: Edificio[] = [];
  const centro = W / 2;
  const posTorre = W * (W < 640 ? 0.78 : 0.66);
  const posAntena = W * 0.24;
  let torre = false;
  let antena = false;
  let x = -8 * k;
  while (x < W + 8) {
    let tipo: Edificio["tipo"] = r() < 0.3 ? "franjas" : r() < 0.25 ? "escalonado" : "caja";
    let w = (40 + r() * 64) * k;
    let h = suelo * (0.2 + r() * 0.36);
    if (!torre && x + w > posTorre) {
      tipo = "torre";
      w = 54 * k;
      h = suelo * 0.9;
      torre = true;
    } else if (!antena && x + w > posAntena) {
      tipo = "antena";
      w = 40 * k;
      h = suelo * 0.56;
      antena = true;
    }
    // Hueco al centro para Benjamín y su auto.
    if (Math.abs(x + w / 2 - centro) < 70 * k && tipo !== "torre") {
      h = suelo * (0.16 + r() * 0.08);
    }
    const ventanas: Ventana[] = [];
    if (tipo !== "franjas") {
      const vw = 6 * k;
      const vh = 9 * k;
      const paso = 14 * k;
      const margen = tipo === "torre" ? 11 * k : 8 * k;
      const cols = Math.max(1, Math.floor((w - margen * 2 + (paso - vw)) / paso));
      const filas = Math.floor((h - 22 * k) / (18 * k));
      const ox = x + (w - (cols * paso - (paso - vw))) / 2;
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          ventanas.push({
            x: ox + c * paso,
            y: suelo - h + 14 * k + f * 18 * k,
            w: vw,
            h: vh,
            luz: 0,
            base: r() < 0.1 ? 0.45 : 0,
          });
        }
      }
    }
    edificios.push({ x, w, h, tipo, ventanas, inicio: 0 });
    x += w + (r() < 0.35 ? 0 : (4 + r() * 12) * k);
  }
  edificios.forEach((e, i) => (e.inicio = 250 + i * 75));

  const arboles: Escena["arboles"] = [];
  for (let ax = 30 * k; ax < W; ax += (90 + r() * 120) * k) {
    if (Math.abs(ax - centro) > 90 * k) arboles.push({ x: ax, r: (9 + r() * 6) * k });
  }
  const faroles: number[] = [];
  for (let fx = 70 * k; fx < W; fx += 210 * k) if (Math.abs(fx - centro) > 70 * k) faroles.push(fx);

  // Tráfico: tres carriles llenos, cada uno a su velocidad para que
  // ningún auto alcance al de adelante.
  const autos: Auto[] = [];
  const velocidades = [26, 38, 31];
  for (const carril of [0, 1, 2] as const) {
    let ax = r() * 40 * k;
    while (ax < W + 60 * k) {
      const w = (44 + r() * 16) * k;
      autos.push({ x: ax, carril, v: velocidades[carril] * k, w, violeta: false });
      ax += w + (18 + r() * 70) * k;
    }
  }

  const peatones: Peaton[] = [];
  for (let px = r() * 60 * k; px < W; px += (50 + r() * 90) * k) {
    if (Math.abs(px - centro) < 60 * k) continue;
    peatones.push({ x: px, v: (r() < 0.5 ? -1 : 1) * (9 + r() * 9) * k, fase: r() * 6.28, alto: (22 + r() * 6) * k });
  }

  return {
    W,
    H,
    suelo,
    cerros,
    lejanos,
    edificios,
    arboles,
    faroles,
    autos,
    peatones,
    benja: centro,
    fin: 250 + edificios.length * 75 + 800,
  };
}

type Colores = { tinta: string; papel: string; suave: string; luz: string; tenue: string };

function leerColores(el: Element): Colores {
  const s = getComputedStyle(el);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    tinta: v("--c-texto"),
    papel: v("--c-fondo"),
    suave: v("--c-borde-fuerte"),
    luz: v("--c-texto"),
    tenue: v("--c-tenue"),
  };
}

const facil = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function dibujarAuto(ctx: CanvasRenderingContext2D, a: { x: number; w: number }, y: number, haciaIzq: boolean, c: Colores, k: number, violeta: boolean) {
  const w = a.w;
  const h = 11 * k;
  ctx.save();
  ctx.translate(a.x, y);
  if (haciaIzq) ctx.scale(-1, 1);
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = c.tinta;
  ctx.fillStyle = violeta ? c.luz : c.papel;
  // carrocería
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h - 5 * k, w, h, 4 * k);
  ctx.fill();
  ctx.stroke();
  // cabina
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, -h - 5 * k);
  ctx.lineTo(-w * 0.16, -h - 13 * k);
  ctx.lineTo(w * 0.18, -h - 13 * k);
  ctx.lineTo(w * 0.34, -h - 5 * k);
  ctx.closePath();
  ctx.fillStyle = c.papel;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.01, -h - 13 * k);
  ctx.lineTo(w * 0.01, -h - 5 * k);
  ctx.stroke();
  // ruedas
  for (const rx of [-w * 0.3, w * 0.3]) {
    ctx.beginPath();
    ctx.arc(rx, -5 * k, 5 * k, 0, Math.PI * 2);
    ctx.fillStyle = c.papel;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, -5 * k, 1.6 * k, 0, Math.PI * 2);
    ctx.fillStyle = c.tinta;
    ctx.fill();
  }
  // foco
  ctx.beginPath();
  ctx.moveTo(w / 2 - 1, -h);
  ctx.lineTo(w / 2 - 5 * k, -h);
  ctx.stroke();
  ctx.restore();
}

/** Línea base de cada carril (las ruedas tocan esta altura). */
function carriles(vereda: number, H: number, k: number): number[] {
  return [vereda + 38 * k, vereda + 76 * k, H - 6 * k];
}

function dibujarPeaton(ctx: CanvasRenderingContext2D, p: Peaton, y: number, c: Colores, t: number) {
  const a = p.alto;
  const paso = Math.sin(t * 6 + p.fase) * a * 0.18;
  ctx.strokeStyle = c.tinta;
  ctx.fillStyle = c.papel;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(p.x - paso, y);
  ctx.lineTo(p.x, y - a * 0.42);
  ctx.lineTo(p.x + paso, y);
  ctx.moveTo(p.x, y - a * 0.42);
  ctx.lineTo(p.x, y - a * 0.82);
  ctx.moveTo(p.x, y - a * 0.74);
  ctx.lineTo(p.x + paso * 0.8, y - a * 0.5);
  ctx.moveTo(p.x, y - a * 0.74);
  ctx.lineTo(p.x - paso * 0.8, y - a * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(p.x, y - a * 0.82 - a * 0.13, a * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function dibujarFijo(ctx: CanvasRenderingContext2D, e: Escena, c: Colores, t: number) {
  const { W, H, suelo } = e;
  const k = Math.min(1.25, Math.max(0.62, H / 420));
  ctx.clearRect(0, 0, W, H);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Cordillera: solo trazo, para que el nombre de fondo se vea a través.
  const cer = facil(t / 900);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W * cer, H);
  ctx.clip();
  ctx.strokeStyle = c.suave;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  e.cerros.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  // nieve: una línea quebrada bajo cada pico
  for (let i = 1; i < e.cerros.length - 1; i++) {
    const [x, y] = e.cerros[i];
    const [xa, ya] = e.cerros[i - 1];
    const [xb, yb] = e.cerros[i + 1];
    if (y > ya || y > yb) continue;
    const d = 0.28;
    ctx.beginPath();
    ctx.moveTo(x + (xa - x) * d, y + (ya - y) * d);
    ctx.lineTo(x - (x - xa) * 0.12, y + (ya - y) * 0.2);
    ctx.lineTo(x, y + (ya - y) * 0.13);
    ctx.lineTo(x + (xb - x) * 0.12, y + (yb - y) * 0.22);
    ctx.lineTo(x + (xb - x) * d, y + (yb - y) * d);
    ctx.stroke();
  }
  ctx.restore();

  // Fila lejana
  ctx.strokeStyle = c.suave;
  ctx.fillStyle = c.papel;
  ctx.lineWidth = 1.2;
  e.lejanos.forEach((b, i) => {
    const p = facil((t - 120 - i * 30) / 700);
    if (p <= 0) return;
    const h = b.h * p;
    ctx.beginPath();
    ctx.rect(b.x, suelo - h, b.w, h);
    ctx.fill();
    ctx.stroke();
  });

  // Fila principal
  ctx.lineWidth = 1.5;
  for (const b of e.edificios) {
    const p = facil((t - b.inicio) / 750);
    if (p <= 0) continue;
    const h = b.h * p;
    const top = suelo - h;
    ctx.strokeStyle = c.tinta;
    ctx.fillStyle = c.papel;
    ctx.beginPath();
    if (b.tipo === "torre") {
      const a = b.w * 0.16;
      ctx.moveTo(b.x, suelo);
      ctx.lineTo(b.x + a, top);
      ctx.lineTo(b.x + b.w - a, top);
      ctx.lineTo(b.x + b.w, suelo);
    } else if (b.tipo === "escalonado") {
      const s = b.w * 0.18;
      ctx.moveTo(b.x, suelo);
      ctx.lineTo(b.x, top + 16 * k);
      ctx.lineTo(b.x + s, top + 16 * k);
      ctx.lineTo(b.x + s, top);
      ctx.lineTo(b.x + b.w - s, top);
      ctx.lineTo(b.x + b.w - s, top + 16 * k);
      ctx.lineTo(b.x + b.w, top + 16 * k);
      ctx.lineTo(b.x + b.w, suelo);
    } else {
      ctx.rect(b.x, top, b.w, h);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(b.x - 2, top, b.w + 4, h);
    ctx.clip();
    const corrimiento = b.h - h;
    if (b.tipo === "franjas") {
      for (let y = suelo - b.h + 14 * k; y < suelo - 10 * k; y += 13 * k) {
        ctx.beginPath();
        ctx.moveTo(b.x + 6 * k, y + corrimiento);
        ctx.lineTo(b.x + b.w - 6 * k, y + corrimiento);
        ctx.stroke();
      }
    }
    ctx.lineWidth = 1.1;
    for (const v of b.ventanas) {
      ctx.strokeRect(v.x, v.y + corrimiento, v.w, v.h);
    }
    ctx.lineWidth = 1.5;
    ctx.restore();

    if (p >= 1 && b.tipo === "torre") {
      // corona de la torre
      ctx.beginPath();
      const a = b.w * 0.16;
      ctx.moveTo(b.x + a + 3 * k, top);
      ctx.lineTo(b.x + a + 8 * k, top - 22 * k);
      ctx.moveTo(b.x + b.w - a - 3 * k, top);
      ctx.lineTo(b.x + b.w - a - 8 * k, top - 22 * k);
      ctx.moveTo(b.x + b.w / 2, top);
      ctx.lineTo(b.x + b.w / 2, top - 30 * k);
      ctx.stroke();
    }
    if (p >= 1 && b.tipo === "antena") {
      const cx = b.x + b.w / 2;
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx, top - 46 * k);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, top - 24 * k, 12 * k, 4 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Calle
  const vereda = suelo + 12 * k;
  ctx.fillStyle = c.papel;
  ctx.fillRect(0, suelo, W, H - suelo);
  ctx.strokeStyle = c.tinta;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, suelo);
  ctx.lineTo(W, suelo);
  ctx.moveTo(0, vereda);
  ctx.lineTo(W, vereda);
  ctx.stroke();
  ctx.setLineDash([14 * k, 12 * k]);
  ctx.strokeStyle = c.suave;
  ctx.beginPath();
  for (const y of carriles(vereda, H, k).slice(0, 2)) {
    ctx.moveTo(0, y + 3 * k);
    ctx.lineTo(W, y + 3 * k);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Árboles y faroles sobre la vereda
  ctx.strokeStyle = c.tinta;
  ctx.fillStyle = c.papel;
  ctx.lineWidth = 1.4;
  const verde = facil((t - 400) / 900);
  for (const a of e.arboles) {
    if (verde <= 0) break;
    ctx.beginPath();
    ctx.moveTo(a.x, suelo + 6 * k);
    ctx.lineTo(a.x, suelo - a.r * 1.4 * verde);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(a.x, suelo - a.r * 1.4 * verde - a.r * 0.8, a.r * verde, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  for (const f of e.faroles) {
    const h = 62 * k * verde;
    if (h <= 0) continue;
    ctx.beginPath();
    ctx.moveTo(f, suelo + 6 * k);
    ctx.lineTo(f, suelo - h);
    ctx.lineTo(f + 12 * k, suelo - h);
    ctx.stroke();
  }

  // Benjamín y su auto, estacionado en la vereda.
  if (verde > 0) {
    const bx = e.benja;
    const fy = suelo + 10 * k;
    const alto = 46 * k * verde;
    ctx.strokeStyle = c.tinta;
    ctx.fillStyle = c.tinta;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(bx - 20 * k, fy);
    ctx.lineTo(bx - 17 * k, fy - alto * 0.45);
    ctx.lineTo(bx - 14 * k, fy);
    ctx.moveTo(bx - 17 * k, fy - alto * 0.45);
    ctx.lineTo(bx - 17 * k, fy - alto * 0.9);
    ctx.moveTo(bx - 17 * k, fy - alto * 0.8);
    ctx.lineTo(bx - 23 * k, fy - alto * 0.55);
    ctx.moveTo(bx - 17 * k, fy - alto * 0.8);
    ctx.lineTo(bx - 10 * k, fy - alto * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bx - 17 * k, fy - alto - 3 * k, 5 * k * verde, 0, Math.PI * 2);
    ctx.fillStyle = c.papel;
    ctx.fill();
    ctx.stroke();
    // lentes de sol, como en la foto
    ctx.beginPath();
    ctx.moveTo(bx - 21 * k, fy - alto - 3.5 * k);
    ctx.lineTo(bx - 13 * k, fy - alto - 3.5 * k);
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.lineWidth = 1.5;
  }
}

export function Ciudad({ textos }: { textos: Textos }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  // Doble clic en la ciudad levanta otra cuadra.
  const [semilla, setSemilla] = useState(2911);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducido =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.hasAttribute("data-reducido");
    let colores = leerColores(canvas);
    let escena: Escena | null = null;
    let cache: HTMLCanvasElement | null = null;
    let dpr = 1;
    let visible = false;
    let arrancado = reducido;
    let t0 = 0;
    let previo = 0;
    let raf = 0;
    let armada = false;

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      escena = generar(semilla, W, H);
      cache = null;
      armada = false;
      if (arrancado && t0 === 0) t0 = performance.now() - (reducido ? 1e6 : 0);
    }

    function hornear() {
      if (!escena) return;
      cache = document.createElement("canvas");
      cache.width = canvas!.width;
      cache.height = canvas!.height;
      const c2 = cache.getContext("2d")!;
      c2.scale(dpr, dpr);
      dibujarFijo(c2, escena, colores, 1e6);
    }

    function cuadro(ahora: number) {
      raf = 0;
      if (!escena) return;
      const dt = previo ? Math.min(0.05, (ahora - previo) / 1000) : 0;
      previo = ahora;
      const t = arrancado ? ahora - t0 : 0;
      const k = Math.min(1.25, Math.max(0.62, escena.H / 420));

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (t >= escena.fin) {
        if (!cache) hornear();
        ctx!.clearRect(0, 0, escena.W, escena.H);
        ctx!.drawImage(cache!, 0, 0, escena.W, escena.H);
        armada = true;
      } else {
        dibujarFijo(ctx!, escena, colores, t);
      }

      // Ventanas encendidas: las del cursor (luz) y unas pocas de base.
      let quedaLuz = false;
      const oscuro = true; // ventanas de base, como textura de la cuadra
      ctx!.fillStyle = colores.luz;
      for (const b of escena.edificios) {
        const p = facil((t - b.inicio) / 750);
        if (p < 1) continue;
        for (const v of b.ventanas) {
          if (v.luz > 0) {
            v.luz = Math.max(0, v.luz - dt * 0.4);
            if (v.luz > 0) quedaLuz = true;
          }
          const a = Math.max(v.luz, oscuro ? v.base : 0);
          if (a <= 0) continue;
          ctx!.globalAlpha = a;
          ctx!.fillRect(v.x + 1, v.y + 1, v.w - 2, v.h - 2);
        }
      }
      ctx!.globalAlpha = 1;

      // Autos de la avenida
      const vereda = escena.suelo + 12 * k;
      const lineas = carriles(vereda, escena.H, k);
      const verde = facil((t - 400) / 900);
      if (verde > 0) {
        const largo = escena.W + 120 * k;
        for (const p of escena.peatones) {
          if (!reducido) {
            p.x += p.v * dt;
            if (p.x > escena.W + 20) p.x = -20;
            if (p.x < -20) p.x = escena.W + 20;
          }
          dibujarPeaton(ctx!, p, vereda - 2 * k, colores, reducido ? 0 : ahora / 1000);
        }
        for (const a of escena.autos) {
          const sentido = a.carril === 2 ? -1 : 1;
          if (!reducido) {
            a.x += sentido * a.v * dt;
            if (a.x > escena.W + 60 * k) a.x -= largo;
            if (a.x < -60 * k) a.x += largo;
          }
          dibujarAuto(ctx!, a, lineas[a.carril], sentido < 0, colores, k, false);
        }
        // Benjamín y su auto, estacionado junto a la vereda.
        dibujarAuto(ctx!, { x: escena.benja + 34 * k, w: 58 * k }, vereda + 2 * k, false, colores, k, true);
      }

      const sigue = visible && (!armada || !reducido || quedaLuz);
      if (sigue) raf = requestAnimationFrame(cuadro);
      else previo = 0;
    }

    function pedir() {
      if (!raf) raf = requestAnimationFrame(cuadro);
    }

    function encender(e: PointerEvent) {
      if (!escena || !armada) return;
      const caja = canvas!.getBoundingClientRect();
      const px = e.clientX - caja.left;
      const py = e.clientY - caja.top;
      const k = Math.min(1.25, Math.max(0.62, escena.H / 420));
      const radio = 38 * k;
      for (const b of escena.edificios) {
        if (px < b.x - radio || px > b.x + b.w + radio) continue;
        for (const v of b.ventanas) {
          const d = Math.hypot(v.x + v.w / 2 - px, v.y + v.h / 2 - py);
          if (d < radio) v.luz = Math.max(v.luz, 1 - d / (radio * 1.4));
        }
      }
      pedir();
    }

    medir();
    pedir();

    const vigia = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        if (visible && !arrancado) {
          arrancado = true;
          t0 = performance.now();
        }
        if (visible) pedir();
      },
      { threshold: 0.15 },
    );
    vigia.observe(canvas);

    let ancho = canvas.clientWidth;
    const tamano = new ResizeObserver(() => {
      if (Math.abs(canvas.clientWidth - ancho) < 2) return;
      ancho = canvas.clientWidth;
      const yaArmada = armada;
      medir();
      if (yaArmada) t0 = performance.now() - 1e6;
      pedir();
    });
    tamano.observe(canvas);

    const tema = new MutationObserver(() => {
      colores = leerColores(canvas!);
      cache = null;
      pedir();
    });
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });

    canvas.addEventListener("pointermove", encender);
    canvas.addEventListener("pointerdown", encender);

    return () => {
      cancelAnimationFrame(raf);
      vigia.disconnect();
      tamano.disconnect();
      tema.disconnect();
      canvas.removeEventListener("pointermove", encender);
      canvas.removeEventListener("pointerdown", encender);
    };
  }, [semilla]);

  return (
    <div className="banda-ciudad relative overflow-hidden">
      <p aria-hidden="true" className="marca-agua pointer-events-none absolute left-1/2 top-[4%] -translate-x-1/2 select-none">
        BENJAMÍN.
      </p>
      <canvas
        ref={lienzo}
        role="img"
        aria-label={textos.descripcion}
        onDoubleClick={() => setSemilla((x) => x + 1)}
        className="relative block h-[clamp(19rem,40vw,34rem)] w-full touch-pan-y"
      />
      <div className="bg-black">
        <p className="lienzo py-3 text-[0.6875rem] text-[#B8B8B8]">{textos.trafico}</p>
      </div>
    </div>
  );
}
