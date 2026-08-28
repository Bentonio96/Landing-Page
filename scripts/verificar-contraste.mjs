/**
 * Mide el contraste contra los PÍXELES REALMENTE RENDERIZADOS.
 *
 * Uso:  node scripts/verificar-contraste.mjs [url]
 *       (por defecto http://localhost:3001)
 *
 * Complementa a axe, no lo reemplaza. axe calcula el fondo de un texto
 * recorriendo sus ancestros, así que NO ve las auras del fondo: viven en una
 * capa fija con z-index negativo que no es ancestro de nada. Se podría subir
 * su intensidad, pasar la auditoría y aun así dejar texto ilegible.
 *
 * Este script captura la pantalla, muestrea el color real justo encima de
 * cada texto y calcula el contraste con esa muestra. Sale con código 1 si
 * algo queda por debajo de 4.5:1.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:3001";

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
});

let fallo = false;

for (const tema of ["light", "dark"]) {
  const p = await navegador.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: tema },
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await p.goto(BASE, { waitUntil: "networkidle0" });
  await p.evaluate(() =>
    document
      .querySelectorAll(".revelar")
      .forEach((n) => n.setAttribute("data-visible", "")),
  );
  await new Promise((r) => setTimeout(r, 600));

  console.log(`\n===== ${tema.toUpperCase()} =====`);
  let peor = 99;
  let peorDato = null;
  let muestras = 0;

  const alto = await p.evaluate(() => document.body.scrollHeight);

  // Se recorre la página entera: las auras son más intensas en las esquinas
  // y cerca del pie, que no se ven en el primer pantallazo.
  for (let y = 0; y < alto; y += 700) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 250));

    const objetivos = await p.evaluate(() => {
      const selectores = [
        ".etiqueta",
        ".text-tenue",
        "p.text-guia",
        "#stack li",
        "#contacto dd",
        "h2",
        "h3",
        "p",
      ];
      const vistos = [];
      for (const sel of selectores) {
        for (const el of Array.from(document.querySelectorAll(sel)).slice(0, 6)) {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          if (r.top < 4 || r.bottom > window.innerHeight - 4) continue;
          vistos.push({
            sel,
            color: getComputedStyle(el).color,
            texto: el.textContent.trim().slice(0, 20),
            // se muestrea justo encima del texto: fondo puro, sin glifos
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + 2),
          });
        }
      }
      return vistos;
    });

    if (objetivos.length === 0) continue;

    const png = await p.screenshot({ type: "png" });
    const { data, info } = await sharp(png)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixel = (x, y) => {
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };

    for (const o of objetivos) {
      if (o.x < 0 || o.x >= info.width || o.y < 0 || o.y >= info.height) continue;
      const fondo = pixel(o.x, o.y);
      const r = ratio(rgb(o.color), fondo);
      muestras++;
      if (r < peor) {
        peor = r;
        peorDato = { ...o, fondo };
      }
      if (r < 4.5) {
        fallo = true;
        console.log(
          `  !! ${r.toFixed(2)}:1  ${o.sel.padEnd(12)} fondo rgb(${fondo.join(",")})  "${o.texto}"`,
        );
      }
    }
  }

  console.log(`  ${muestras} muestras a lo largo de toda la página`);
  if (peorDato) {
    console.log(
      `  peor caso: ${peor.toFixed(2)}:1  ${peorDato.sel}  fondo rgb(${peorDato.fondo.join(",")})  "${peorDato.texto}"`,
    );
  }
  console.log(`  → ${peor >= 4.5 ? "cumple AA" : "POR DEBAJO DE AA"}`);
  await p.close();
}

await navegador.close();
process.exitCode = fallo ? 1 : 0;
