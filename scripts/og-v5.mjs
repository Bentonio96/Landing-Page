/**
 * Tarjetas sociales de la v5 (1200×630): el titular «< Software Engineer />»
 * del hero, la foto en blanco y negro y la disponibilidad, en los dos idiomas.
 *
 * Uso:  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scripts/og-v5.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const RAIZ = process.cwd();
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const foto = (await readFile(path.join(RAIZ, "public/retrato.webp"))).toString("base64");

const textos = {
  es: { disponible: "Disponible para proyectos freelance", etiqueta: "full stack y datos" },
  en: { disponible: "Available for freelance projects", etiqueta: "full stack & data" },
};

const codigo = [
  'export const perfil = {',
  '  nombre: "Benjamín Peña Díaz",',
  '  rol: "Software Engineer",',
  '  ubicacion: "Ñuñoa, Santiago, Chile",',
  '  disponible: "freelance",',
  '} as const;',
  '',
  'deploy({ slug: "kerr", stack: ["React 19", "WebGL2", "GSAP"] });',
  'deploy({ slug: "epicentro", stack: ["Next.js 15", "MapLibre"] });',
  'git commit -m "feat: build the whole city"',
].join("\n");

function html({ disponible, etiqueta }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#151515;color:#F2F2F2;font-family:Archivo,sans-serif;position:relative;overflow:hidden}
  pre{position:absolute;inset:28px 40px;font:13px/1.75 "JetBrains Mono",monospace;color:rgba(242,242,242,.07)}
  .t{position:absolute;left:64px;top:118px;font-weight:700;font-variation-settings:"wdth" 92;font-size:124px;line-height:.92;letter-spacing:-.03em;text-transform:uppercase}
  .c{color:#F2F2F2;font-weight:300;font-size:.62em;vertical-align:.18em;letter-spacing:0}
  .l2{padding-left:.9em}
  img{position:absolute;right:64px;bottom:0;width:250px;height:290px;object-fit:contain;object-position:bottom;background:#E9E9E9;border-radius:8px 8px 0 0;filter:grayscale(1)}
  .pie{position:absolute;left:64px;bottom:64px;display:grid;gap:14px}
  .n{font-weight:600;font-size:34px;letter-spacing:-.02em}
  .d{display:flex;align-items:center;gap:10px;font-size:20px;color:#B8B8B8}
  .d i{width:10px;height:10px;border-radius:50%;background:#3ecf6e}
  .e{font:500 18px "JetBrains Mono",monospace;color:#F2F2F2}.e b{color:#8F8F8F;font-weight:400}
</style></head><body>
<pre>${codigo}</pre>
<div class="t"><div><span class="c">&lt;</span> SOFTWARE</div><div class="l2">ENGINEER <span class="c">/&gt;</span></div></div>
<img src="data:image/webp;base64,${foto}">
<div class="pie"><p class="n">Benjamín Peña Díaz</p><p class="d"><i></i>${disponible}</p><p class="e"><b>{{ </b>/${etiqueta}<b> }}</b></p></div>
</body></html>`;
}

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: true });
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
for (const [idioma, valores] of Object.entries(textos)) {
  await pagina.setContent(html(valores), { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: path.join(RAIZ, `public/og-${idioma}.png`) });
  console.log(`og-${idioma}.png listo`);
}
await navegador.close();
