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

/* Se miden los dos anchos: la foto del hero y sus velos cambian de sitio
   entre escritorio y móvil, y caen bajo textos distintos. */
const VISTAS = [
  { nombre: "escritorio", width: 1440, height: 900 },
  { nombre: "móvil", width: 390, height: 844 },
];

for (const vista of VISTAS)
for (const tema of ["light", "dark"]) {
  const p = await navegador.newPage();
  await p.setViewport({ ...vista, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: tema },
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  // networkidle2 y un margen amplio: contra un sitio remoto la red puede no
  // quedarse nunca del todo quieta.
  await p.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await p.evaluate(() =>
    document
      .querySelectorAll(".revelar")
      .forEach((n) => n.setAttribute("data-visible", "")),
  );
  await new Promise((r) => setTimeout(r, 600));

  console.log(`\n===== ${tema.toUpperCase()} · ${vista.nombre} =====`);
  let peor = 99;
  let peorDato = null;
  let muestras = 0;

  const alto = await p.evaluate(() => document.body.scrollHeight);

  // Se recorre la página entera: las auras son más intensas en las esquinas
  // y cerca del pie, que no se ven en el primer pantallazo.
  for (let y = 0; y < alto; y += 700) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 250));

    // Todo elemento con texto propio visible en pantalla. Se guarda su
    // color y una rejilla de puntos que cubre la caja entera: sobre la foto
    // del hero o un velo en degradado, el fondo cambia dentro de una misma
    // línea, y un solo punto no lo representa.
    const objetivos = await p.evaluate(() => {
      const vistos = [];
      for (const el of document.body.querySelectorAll("*")) {
        const nodos = Array.from(el.childNodes).filter(
          (n) => n.nodeType === 3 && n.textContent.trim(),
        );
        if (nodos.length === 0) continue;
        // Lo decorativo oculto a lectores de pantalla no es texto que leer.
        if (el.closest("[aria-hidden='true']")) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
        const tam = parseFloat(cs.fontSize);
        const negrita = Number(cs.fontWeight) >= 700;
        // WCAG: texto grande (≥24px, o ≥18.66px en negrita) pide 3:1.
        const minimo = tam >= 24 || (negrita && tam >= 18.66) ? 3 : 4.5;
        // Las cajas de LÍNEA del texto, no la del elemento: un span en
        // display:block mide todo el ancho del contenedor, y medir ahí
        // muestrea fondo que ninguna letra toca.
        const puntos = [];
        for (const nodo of nodos) {
          const rango = document.createRange();
          rango.selectNodeContents(nodo);
          for (const r of rango.getClientRects()) {
            if (r.width < 4 || r.height < 6) continue;
            if (r.top < 4 || r.bottom > window.innerHeight - 4) continue;
            for (const fy of [0.3, 0.5, 0.7])
              for (let k = 0; k <= 6; k++)
                puntos.push([
                  Math.round(r.left + 1 + ((r.width - 2) * k) / 6),
                  Math.round(r.top + r.height * fy),
                ]);
          }
        }
        if (puntos.length === 0) continue;
        vistos.push({
          sel: el.tagName.toLowerCase() + (el.closest("#inicio") ? "#inicio" : ""),
          color: cs.color,
          texto: el.textContent.trim().slice(0, 22),
          minimo,
          puntos,
        });
      }
      return vistos;
    });

    if (objetivos.length === 0) continue;

    // Captura con el texto oculto: así se mide el fondo que queda DEBAJO de
    // los glifos, no el borde suavizado de las propias letras. Se ocultan
    // también los puntos decorativos de acento, que no son fondo de nada.
    await p.addStyleTag({
      content:
        "*{color:transparent!important;text-decoration-color:transparent!important;-webkit-text-stroke-color:transparent!important;text-shadow:none!important}" +
        "span[aria-hidden='true'].rounded-full{visibility:hidden!important}",
    });
    await new Promise((r) => setTimeout(r, 120));
    const png = await p.screenshot({ type: "png" });
    await p.evaluate(() =>
      document.head.lastElementChild?.tagName === "STYLE" &&
      document.head.lastElementChild.remove(),
    );
    const { data, info } = await sharp(png)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixel = (x, y) => {
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };

    for (const o of objetivos) {
      let peorLocal = 99;
      let fondoLocal = null;
      for (const [x, y] of o.puntos) {
        if (x < 0 || x >= info.width || y < 0 || y >= info.height) continue;
        const fondo = pixel(x, y);
        const r = ratio(rgb(o.color), fondo);
        muestras++;
        if (r < peorLocal) {
          peorLocal = r;
          fondoLocal = fondo;
        }
      }
      if (!fondoLocal) continue;
      // Se compara el margen sobre el mínimo que le toca a cada texto.
      if (peorLocal / o.minimo < peor / (peorDato?.minimo ?? 4.5)) {
        peor = peorLocal;
        peorDato = { ...o, fondo: fondoLocal };
      }
      if (peorLocal < o.minimo) {
        fallo = true;
        console.log(
          `  !! ${peorLocal.toFixed(2)}:1 (mín ${o.minimo})  ${o.sel.padEnd(10)} fondo rgb(${fondoLocal.join(",")})  "${o.texto}"`,
        );
      }
    }
  }

  console.log(`  ${muestras} muestras a lo largo de toda la página`);
  if (peorDato) {
    console.log(
      `  peor caso: ${peor.toFixed(2)}:1 (mín ${peorDato.minimo})  ${peorDato.sel}  fondo rgb(${peorDato.fondo.join(",")})  "${peorDato.texto}"`,
    );
  }
  console.log(`  → ${peorDato && peor < peorDato.minimo ? "POR DEBAJO DE AA" : "cumple AA"}`);
  await p.close();
}

await navegador.close();
process.exitCode = fallo ? 1 : 0;
