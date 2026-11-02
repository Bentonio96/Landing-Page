/**
 * Captura las imágenes del README de la v3.
 *
 * Uso:  node scripts/capturar-readme.mjs [url] [destino]
 *       (por defecto http://localhost:3034 y docs/capturas)
 *
 * Se captura con movimiento permitido (el tablero de LED tiene que terminar
 * de encenderse: se espera) salvo en las secciones, donde se pide movimiento
 * reducido para que la cortina del garage y los titulares ya estén en su
 * sitio. Salen en JPEG: la grilla de puntos del papel infla los PNG.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3034";
const DESTINO = process.argv[3] ?? "docs/capturas";
const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});
await mkdir(DESTINO, { recursive: true });

async function pagina({ ruta = "/", ancho = 1440, alto = 900, tema = "light", reducido = false } = {}) {
  const p = await navegador.newPage();
  await p.setViewport({ width: ancho, height: alto, deviceScaleFactor: 2 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: tema },
    { name: "prefers-reduced-motion", value: reducido ? "reduce" : "no-preference" },
  ]);
  await p.goto(BASE + ruta, { waitUntil: "networkidle0" });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

async function guardar(p, nombre) {
  const jpg = await p.screenshot({ type: "jpeg", quality: 86 });
  await writeFile(path.join(DESTINO, `${nombre}.jpg`), jpg);
  console.log(`  ${nombre}.jpg  ${(jpg.length / 1024).toFixed(0)} KB`);
  await p.close();
}

async function irA(p, id, ms = 600) {
  await p.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id);
  await esperar(ms);
}

// Hero, claro y oscuro, con el tablero ya encendido y la radio tipeada.
for (const tema of ["light", "dark"]) {
  const p = await pagina({ tema });
  await esperar(4200);
  await guardar(p, `hero-${tema === "light" ? "claro" : "oscuro"}`);
}

// La radio con una pregunta respondida.
{
  const p = await pagina({ reducido: true });
  await p.keyboard.press("/");
  await esperar(300);
  await p.type("#radio-entrada", "¿Sabes React?");
  await p.keyboard.press("Enter");
  await esperar(500);
  await p.type("#radio-entrada", "Kerr");
  await p.keyboard.press("Enter");
  await esperar(500);
  await guardar(p, "radio");
}

// Secciones, con movimiento reducido.
for (const [id, nombre] of [["piloto", "piloto"], ["garage", "garage"], ["tiempos", "tiempos"]]) {
  const p = await pagina({ reducido: true });
  await irA(p, id);
  await guardar(p, nombre);
}

// Sistemas con una pieza elegida.
{
  const p = await pagina({ reducido: true });
  await irA(p, "sistemas");
  await p.evaluate(() => {
    [...document.querySelectorAll("#sistemas button")].find((b) => b.textContent?.startsWith("React"))?.click();
    window.scrollBy(0, 260);
  });
  await esperar(400);
  await guardar(p, "sistemas");
}

// El box con la vuelta terminada: se pasa por cada sector.
{
  const p = await pagina({ reducido: true });
  for (const id of ["piloto", "garage", "sistemas", "tiempos", "box"]) await irA(p, id, 900);
  await p.evaluate(() => window.scrollBy(0, 330));
  await esperar(600);
  await guardar(p, "box");
}

// Teléfono e inglés.
{
  const p = await pagina({ ancho: 390, alto: 844 });
  await esperar(4200);
  await guardar(p, "movil");
}
{
  const p = await pagina({ ruta: "/en", tema: "dark" });
  await esperar(4200);
  await guardar(p, "ingles");
}

await navegador.close();
