/**
 * Captura las imágenes que ilustran el README.
 *
 * Uso:  node scripts/capturar-readme.mjs [url] [destino]
 *       (por defecto http://localhost:3001 y docs/capturas)
 *
 * Correrlo después de cualquier cambio visible: paleta, tipografía, copy,
 * un proyecto nuevo. Hasta ahora las capturas se tomaban a mano y quedaban
 * desfasadas del sitio real sin que nadie se diera cuenta.
 *
 * Tres decisiones que no son obvias:
 *
 * 1 · Se captura el VIEWPORT, no el elemento. La capa de auras es
 *     `position: fixed`, así que solo cubre el alto de la ventana: en una
 *     captura de elemento más alto que el viewport, el fondo se corta a
 *     media imagen y aparece un borde recto que no existe en el sitio.
 *     Por eso la ventana se redimensiona al alto de cada sección antes de
 *     disparar.
 *
 * 2 · En las secciones se oculta el encabezado fijo. Al desplazarse hasta
 *     una sección, el header queda flotando en mitad de la imagen, que es
 *     justo donde nadie lo ve al navegar. En las capturas del hero sí se
 *     deja, porque ahí es donde de verdad está.
 *
 * 3 · Salen en JPEG y no en PNG. El fondo lleva una capa de grano, y el
 *     ruido es el peor caso para PNG: las mismas diez imágenes pesaban
 *     19 MB en PNG. En JPEG de calidad 88 bajan a menos de 2 MB sin
 *     diferencia visible a la escala a la que GitHub las muestra.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3001";
const DESTINO = process.argv[3] ?? "docs/capturas";

/** GitHub muestra el README a unos 800 px: 1600 es el 2× que necesita. */
const ANCHO_MAXIMO = 1600;
/** Tope de seguridad: una sección más alta que esto se recorta. */
const ALTO_MAXIMO = 4200;

const TOMAS = [
  { nombre: "hero-claro", ruta: "/es", sel: "#inicio", tema: "light", ancho: 1440 },
  { nombre: "hero-oscuro", ruta: "/es", sel: "#inicio", tema: "dark", ancho: 1440 },
  { nombre: "sobre-mi", ruta: "/es", sel: "#sobre-mi", tema: "light", ancho: 1440 },
  { nombre: "stack", ruta: "/es", sel: "#stack", tema: "light", ancho: 1440 },
  { nombre: "proyectos", ruta: "/es", sel: "#proyectos", tema: "light", ancho: 1440 },
  { nombre: "experiencia", ruta: "/es", sel: "#experiencia", tema: "light", ancho: 1440 },
  { nombre: "contacto", ruta: "/es", sel: "#contacto", tema: "light", ancho: 1440 },
  { nombre: "ingles", ruta: "/en", sel: "#inicio", tema: "light", ancho: 1440 },
  { nombre: "movil-claro", ruta: "/es", sel: "#inicio", tema: "light", ancho: 390 },
  { nombre: "movil-oscuro", ruta: "/es", sel: "#inicio", tema: "dark", ancho: 390 },
];

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
  // Redimensionar la ventana a 4000 px de alto y repintar el fondo entero
  // pasa de los 30 s por defecto en las secciones largas.
  protocolTimeout: 180000,
});

await mkdir(DESTINO, { recursive: true });
let total = 0;

for (const t of TOMAS) {
  const esHero = t.sel === "#inicio";
  const p = await navegador.newPage();
  await p.setViewport({ width: t.ancho, height: 900, deviceScaleFactor: 2 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: t.tema },
    // Sin esto la captura puede caer a mitad de una transición de entrada.
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await p.goto(BASE + t.ruta, { waitUntil: "networkidle2", timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);

  await p.evaluate((oculta) => {
    document
      .querySelectorAll(".revelar")
      .forEach((n) => n.setAttribute("data-visible", ""));
    if (oculta) {
      for (const sel of ["header", ".progreso-lectura"]) {
        const el = document.querySelector(sel);
        if (el) el.style.display = "none";
      }
    }
  }, !esHero);

  // La ventana se ajusta al alto real de la sección para que la capa fija
  // de auras cubra todo lo que se va a capturar.
  const alto = await p.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? Math.ceil(el.getBoundingClientRect().height) : 900;
  }, t.sel);
  const altoFinal = Math.min(alto, ALTO_MAXIMO);
  await p.setViewport({
    width: t.ancho,
    height: altoFinal,
    deviceScaleFactor: 2,
  });

  await p.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY,
        behavior: "instant",
      });
    }
  }, t.sel);
  // Las imágenes en diferido necesitan un momento tras entrar en pantalla.
  // La espera compite contra un tope: una imagen que ya cargó no vuelve a
  // disparar `onload`, así que sin el tope esto se queda colgado.
  await new Promise((r) => setTimeout(r, 1200));
  await p.evaluate(
    () =>
      new Promise((listo) => {
        const tope = setTimeout(listo, 5000);
        const pendientes = [...document.images].filter((i) => !i.complete);
        if (pendientes.length === 0) return listo();
        let faltan = pendientes.length;
        for (const img of pendientes) {
          img.onload = img.onerror = () => {
            if (--faltan === 0) {
              clearTimeout(tope);
              listo();
            }
          };
        }
      }),
  );
  await new Promise((r) => setTimeout(r, 400));

  const png = await p.screenshot({ type: "png" });
  const buf = await sharp(png)
    .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await writeFile(path.join(DESTINO, `${t.nombre}.jpg`), buf);

  total += buf.length;
  console.log(
    `  ${t.nombre.padEnd(13)} ${String(t.ancho).padStart(4)}×${String(altoFinal).padEnd(5)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB`,
  );
  await p.close();
}

await navegador.close();
console.log(`  ${"total".padEnd(13)} ${(total / 1024 / 1024).toFixed(2)} MB`);
