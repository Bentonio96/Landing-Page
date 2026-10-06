/**
 * Captura los sitios en vivo de cada proyecto para las miniaturas de las
 * tarjetas. Volver a correrlo las mantiene al día.
 *
 * Uso:  node scripts/capturar-proyectos.mjs
 *
 * Si solo cambió un proyecto, SOLO limita la captura a esos slugs y deja
 * las demás miniaturas como están:
 *   SOLO=centinela node scripts/capturar-proyectos.mjs
 *
 * Si agregas un proyecto con demo, súmalo al array SITIOS y apunta su
 * `imagen` en src/data/proyectos.ts. Un proyecto sin imagen renderiza la
 * tarjeta sin miniatura, sin romper nada.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

/**
 * Ruta a un Chrome instalado. Se puede sobrescribir:
 *   CHROME="/ruta/a/chrome" node scripts/capturar-proyectos.mjs
 */
const CHROME =
  process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const DESTINO = process.argv[2] ?? "public/proyectos";
const MODULO_BLUR = "src/lib/blur-proyectos.ts";
const SOLO = (process.env.SOLO ?? "").split(",").map((s) => s.trim()).filter(Boolean);

const SITIOS = [
  {
    slug: "epicentro",
    url: "https://epicentro-sigma.vercel.app",
    tema: "dark",
    espera: 4500,
  },
  {
    slug: "turnera",
    url: "https://turnera-iota.vercel.app",
    tema: "dark",
    espera: 2500,
  },
  {
    slug: "centinela",
    url: "https://centinela-rho.vercel.app",
    // Tiene un solo tema, claro: este valor no cambia lo que se captura.
    tema: "light",
    espera: 3000,
  },
];

const pendientes = SOLO.length
  ? SITIOS.filter((s) => SOLO.includes(s.slug))
  : SITIOS;
const desconocidos = SOLO.filter((slug) => !SITIOS.some((s) => s.slug === slug));
if (desconocidos.length) {
  console.error(`  SOLO: no hay proyecto con slug ${desconocidos.join(", ")}`);
  process.exit(1);
}

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

await mkdir(DESTINO, { recursive: true });

// Se parte de los placeholders que ya hay, en el orden de SITIOS: con SOLO,
// los proyectos que no se vuelven a capturar conservan el suyo.
const previos = Object.fromEntries(
  [...(await readFile(MODULO_BLUR, "utf8").catch(() => "")).matchAll(
    /"([^"]+)":\s*"(data:[^"]+)"/g,
  )].map(([, slug, dato]) => [slug, dato]),
);
const blurs = Object.fromEntries(
  SITIOS.filter((s) => previos[s.slug]).map((s) => [s.slug, previos[s.slug]]),
);

for (const s of pendientes) {
  const p = await navegador.newPage();
  // 16:10, el mismo recorte que usan las tarjetas
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: s.tema },
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await p.goto(s.url, { waitUntil: "networkidle0", timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, s.espera));

  const png = await p.screenshot({ type: "png" });
  const buf = await sharp(png)
    .resize(1600, 1000, { fit: "cover", position: "top" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(DESTINO, `${s.slug}.jpg`), buf);

  // Placeholder difuminado, para que la tarjeta no parpadee al cargar
  const blur = await sharp(buf).resize(16).jpeg({ quality: 55 }).toBuffer();
  blurs[s.slug] = `data:image/jpeg;base64,${blur.toString("base64")}`;

  console.log(
    `  ${s.slug.padEnd(10)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB`,
  );
  await p.close();
}

await navegador.close();

// Los placeholders van a un módulo TS, no a archivos sueltos en /public.
const lineas = Object.entries(blurs)
  .map(([slug, dato]) => `  "${slug}":\n    "${dato}",`)
  .join("\n");

await writeFile(
  MODULO_BLUR,
  [
    "/** Generado por scripts/capturar-proyectos.mjs — no editar a mano. */",
    "export const BLUR_PROYECTOS: Record<string, string> = {",
    lineas,
    "};",
    "",
  ].join("\n"),
);
console.log("  src/lib/blur-proyectos.ts actualizado");
