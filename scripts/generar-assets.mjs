/**
 * Genera los assets estáticos del sitio a partir de la foto original:
 *   • public/benjamin-pena.jpg  — foto limpia, sin metadatos EXIF
 *   • src/lib/blur.ts           — placeholder base64 para next/image
 *   • public/icon.svg           — marca "cordillera"
 *   • public/favicon.ico        — ICO real (16 + 32 px)
 *   • public/apple-icon.png     — 180×180
 *   • public/og-es.png / og-en.png — 1200×630 para LinkedIn y WhatsApp
 *
 * Uso:  node scripts/generar-assets.mjs
 */
import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const PUBLICO = path.join(RAIZ, "public");
const ORIGEN = path.join(PUBLICO, "benjamin-pena.jpg");

const TINTA = "#0C0E12";
const ACENTO = "#F0784E";
const HUESO = "#EDEDEB";
const ATENUADO = "#9BA1AB";

const marcaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="${TINTA}"/>
  <path d="M7 48 L24 19 L34 37 L41 26 L57 48 Z" fill="${ACENTO}"/>
</svg>`;

/** Empaqueta PNGs en un .ico válido (los .ico modernos admiten PNG dentro). */
function construirIco(imagenes) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(imagenes.length, 4);

  let desplazamiento = 6 + imagenes.length * 16;
  const entradas = [];

  for (const { tamano, datos } of imagenes) {
    const entrada = Buffer.alloc(16);
    entrada.writeUInt8(tamano >= 256 ? 0 : tamano, 0);
    entrada.writeUInt8(tamano >= 256 ? 0 : tamano, 1);
    entrada.writeUInt8(0, 2);
    entrada.writeUInt8(0, 3);
    entrada.writeUInt16LE(1, 4);
    entrada.writeUInt16LE(32, 6);
    entrada.writeUInt32LE(datos.length, 8);
    entrada.writeUInt32LE(desplazamiento, 12);
    entradas.push(entrada);
    desplazamiento += datos.length;
  }

  return Buffer.concat([
    cabecera,
    ...entradas,
    ...imagenes.map((i) => i.datos),
  ]);
}

function escapar(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ogSvg({ rol, sitio }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fundido" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${TINTA}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${TINTA}" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="${TINTA}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Sin fondo opaco: la base ya es tinta y debajo va la foto. -->
  <rect x="640" y="0" width="300" height="630" fill="url(#fundido)"/>

  <rect x="80" y="92" width="54" height="3" fill="${ACENTO}"/>

  <text x="80" y="168" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" letter-spacing="7" fill="${ACENTO}">${escapar(
          rol.toUpperCase(),
        )}</text>

  <text x="76" y="300" font-family="Georgia, 'Times New Roman', serif"
        font-size="104" fill="${HUESO}">Benjamín</text>
  <text x="76" y="404" font-family="Georgia, 'Times New Roman', serif"
        font-size="104" fill="${HUESO}">Peña Díaz</text>

  <rect x="80" y="470" width="380" height="1" fill="#333944"/>

  <text x="80" y="522" font-family="Georgia, 'Times New Roman', serif"
        font-size="26" letter-spacing="2" fill="${ATENUADO}">${escapar(
          sitio,
        )}</text>
</svg>`;
}

async function main() {
  await mkdir(PUBLICO, { recursive: true });

  // 1 · Foto limpia (sin EXIF) y en sRGB.
  // Se lee a buffer antes de escribir: sharp mantendría el archivo abierto
  // y en Windows no se puede sobrescribir el mismo origen.
  const original = await readFile(ORIGEN);
  const limpia = await sharp(original)
    .rotate()
    .toColorspace("srgb")
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await writeFile(ORIGEN, limpia);
  const meta = await sharp(limpia).metadata();
  console.log(
    `foto        ${meta.width}×${meta.height}  ${(limpia.length / 1024).toFixed(1)} KB`,
  );

  // 2 · Placeholder difuminado para next/image.
  const blur = await sharp(limpia).resize(16).jpeg({ quality: 55 }).toBuffer();
  await writeFile(
    path.join(RAIZ, "src", "lib", "blur.ts"),
    `/** Generado por scripts/generar-assets.mjs — no editar a mano. */\n` +
      `export const BLUR_PERFIL =\n  "data:image/jpeg;base64,${blur.toString(
        "base64",
      )}";\n`,
  );
  console.log(`blur        ${blur.length} bytes`);

  // 3 · Iconos.
  await writeFile(path.join(PUBLICO, "icon.svg"), marcaSvg);
  const marca = Buffer.from(marcaSvg);
  const png = (tamano) =>
    sharp(marca, { density: 384 }).resize(tamano, tamano).png().toBuffer();

  await writeFile(path.join(PUBLICO, "apple-icon.png"), await png(180));
  await writeFile(
    path.join(PUBLICO, "favicon.ico"),
    construirIco([
      { tamano: 16, datos: await png(16) },
      { tamano: 32, datos: await png(32) },
      { tamano: 48, datos: await png(48) },
    ]),
  );
  console.log("iconos      icon.svg · favicon.ico · apple-icon.png");

  // 4 · Open Graph por idioma.
  const retrato = await sharp(limpia)
    .resize(520, 630, { fit: "cover", position: "attention" })
    .toBuffer();

  const textos = {
    es: { rol: "Desarrollador Frontend", sitio: "Santiago de Chile" },
    en: { rol: "Frontend Developer", sitio: "Santiago, Chile" },
  };

  for (const [idioma, valores] of Object.entries(textos)) {
    const salida = path.join(PUBLICO, `og-${idioma}.png`);
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: TINTA,
      },
    })
      .composite([
        { input: retrato, left: 680, top: 0 },
        { input: Buffer.from(ogSvg(valores)), left: 0, top: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toFile(salida);
    console.log(`og-${idioma}.png   listo`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
