/**
 * Revisión de la v3 contra un servidor corriendo (npm run build && npm start):
 *   - axe-core en ES/EN, claro/oscuro y con movimiento reducido;
 *   - recortes: scroll horizontal de la página y textos que desbordan su
 *     caja, en 375, 768 y 1440 px.
 *
 * Uso:  node scripts/revisar.mjs [http://localhost:3034]
 */
import { readFile } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3034";
const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const AXE = await readFile(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let problemas = 0;

async function abrir(ruta, { ancho = 1440, alto = 900, tema = "light", reducido = false } = {}) {
  const p = await navegador.newPage();
  await p.setViewport({ width: ancho, height: alto, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: tema },
    { name: "prefers-reduced-motion", value: reducido ? "reduce" : "no-preference" },
  ]);
  await p.goto(BASE + ruta, { waitUntil: "networkidle0" });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

// --- axe -----------------------------------------------------------------
for (const ruta of ["/", "/en"]) {
  for (const tema of ["light", "dark"]) {
    for (const reducido of [false, true]) {
      const p = await abrir(ruta, { tema, reducido });
      // Se recorre la página para que todo lo que entra con el scroll entre.
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 1500));
      });
      await p.evaluate(AXE);
      const r = await p.evaluate(() =>
        window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }),
      );
      const v = r.violations;
      problemas += v.length;
      console.log(`axe ${ruta.padEnd(3)} ${tema.padEnd(5)} ${reducido ? "reducido" : "movimiento"}: ${v.length}`);
      for (const x of v) console.log(`   ${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      await p.close();
    }
  }
}

// --- la radio abierta, con conversación y el historial desplazable --------
for (const [ancho, alto] of [[1440, 900], [375, 812]]) {
  for (const tema of ["light", "dark"]) {
    const p = await abrir("/", { ancho, alto, tema });
    await p.keyboard.press("/");
    await new Promise((r) => setTimeout(r, 300));
    for (const q of ["kerr", "tesis", "¿sabes react?", "contacto"]) {
      await p.type("#radio-entrada", q);
      await p.keyboard.press("Enter");
      await new Promise((r) => setTimeout(r, 900));
    }
    const scroll = await p.evaluate(() => {
      const log = document.querySelector("[role=log]");
      const desborda = log.scrollHeight > log.clientHeight;
      const alFondo = log.scrollHeight - log.scrollTop - log.clientHeight < 2;
      return { desborda, alFondo, pagina: window.scrollY };
    });
    await p.evaluate(AXE);
    const r = await p.evaluate(() =>
      window.axe.run(document.querySelector("dialog"), { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] }),
    );
    const malScroll = !scroll.desborda || !scroll.alFondo || scroll.pagina !== 0;
    problemas += r.violations.length + (malScroll ? 1 : 0);
    console.log(`radio ${ancho} ${tema.padEnd(5)}: axe ${r.violations.length} · historial ${scroll.desborda ? "desplazable" : "SIN scroll"}, ${scroll.alFondo ? "al fondo" : "NO al fondo"}, página ${scroll.pagina === 0 ? "quieta" : "SE MOVIÓ"}`);
    for (const x of r.violations) console.log(`   ${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    await p.close();
  }
}

// --- recortes ------------------------------------------------------------
for (const ancho of [375, 768, 1440]) {
  for (const ruta of ["/", "/en"]) {
    const p = await abrir(ruta, { ancho, alto: 812, reducido: true });
    const r = await p.evaluate(() => {
      const fuera = [];
      const anchoDoc = document.documentElement.scrollWidth;
      // Se mide cada nodo de texto con un Range: un texto puede desbordar
      // aunque la caja de su elemento quepa.
      const caminante = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let nodo;
      while ((nodo = caminante.nextNode())) {
        const el = nodo.parentElement;
        if (!nodo.textContent.trim() || !el) continue;
        if (el.closest("[aria-hidden='true'], .sr-only, dialog:not([open]), .tablero-texto, script, style")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const rango = document.createRange();
        rango.selectNodeContents(nodo);
        const b = rango.getBoundingClientRect();
        if (!b.width) continue;
        const texto = nodo.textContent.trim().slice(0, 40);
        if (b.right > innerWidth + 1 || b.left < -1) fuera.push(`«${texto}» sale de la pantalla`);
        // Recortado por un ancestro con overflow oculto.
        let a = el;
        while (a && a !== document.body) {
          const ca = getComputedStyle(a);
          const enX = ["hidden", "clip"].includes(ca.overflowX);
          const enY = ["hidden", "clip"].includes(ca.overflowY);
          if (enX || enY) {
            const r = a.getBoundingClientRect();
            if ((enX && (b.right > r.right + 1 || b.left < r.left - 1)) || (enY && b.bottom > r.bottom + 2)) {
              fuera.push(`«${texto}» recortado por ${a.tagName.toLowerCase()}`);
            }
            break;
          }
          a = a.parentElement;
        }
      }
      return { anchoDoc, fuera };
    });
    const horizontal = r.anchoDoc > ancho;
    problemas += r.fuera.length + (horizontal ? 1 : 0);
    console.log(`recortes ${ancho} ${ruta}: ${horizontal ? `scroll horizontal (${r.anchoDoc}px) · ` : ""}${r.fuera.length}`);
    for (const f of r.fuera.slice(0, 8)) console.log(`   ${f}`);
    await p.close();
  }
}

await navegador.close();
console.log(problemas ? `\n${problemas} problemas` : "\nTodo en orden");
process.exit(problemas ? 1 : 0);
