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
 *       node scripts/generar-assets.mjs --solo-og
 *       node scripts/generar-assets.mjs --marca
 *
 * Con --solo-og se regeneran solo las tarjetas sociales. Sirve cuando cambia
 * el texto del titular pero no la foto: el paso 1 vuelve a codificar el JPEG
 * de origen, y repetirlo sin necesidad solo le quita calidad.
 *
 * Con --marca se regeneran iconos y tarjetas sociales, también sin tocar la
 * foto. Es el caso de un cambio de paleta.
 */
import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const PUBLICO = path.join(RAIZ, "public");
const ORIGEN = path.join(PUBLICO, "benjamin-pena.jpg");

// Paleta del CV, la misma que los tokens de globals.css.
const TINTA = "#0E1117";
const ACENTO = "#6C5CFF"; // violeta vivo: relleno de la marca
const ACENTO_TEXTO = "#A79BFF"; // violeta claro: texto sobre tinta
const HUESO = "#F1F3F7";
const ATENUADO = "#AFB7C4";

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

/** `rol` llega como array: una entrada por línea, ya partida a mano. */
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

  ${rol
    .map(
      (linea, i) => `<text x="80" y="${158 + i * 40}"
        font-family="Consolas, 'Courier New', monospace"
        font-size="26" letter-spacing="5" fill="${ACENTO_TEXTO}">${escapar(
          linea.toUpperCase(),
        )}</text>`,
    )
    .join("\n  ")}

  <!-- Condensada de sistema (Impact) en versales: la Bebas Neue del sitio
       no está instalada donde corre librsvg, y es lo más parecido. -->
  <text x="76" y="336" font-family="Impact, 'Arial Narrow', sans-serif"
        font-size="124" fill="${HUESO}">BENJAMÍN</text>
  <text x="76" y="456" font-family="Impact, 'Arial Narrow', sans-serif"
        font-size="124" fill="${ACENTO_TEXTO}">PEÑA DÍAZ</text>

  <rect x="80" y="500" width="380" height="1" fill="#3A4353"/>

  <text x="80" y="548" font-family="Consolas, 'Courier New', monospace"
        font-size="24" letter-spacing="3" fill="${ATENUADO}">${escapar(
          sitio,
        )}</text>
</svg>`;
}

const soloOg = process.argv.includes("--solo-og");
const soloMarca = process.argv.includes("--marca");

async function limpiarFoto() {
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
  return limpia;
}

async function main() {
  await mkdir(PUBLICO, { recursive: true });

  const reusar = soloOg || soloMarca;
  const limpia = reusar ? await readFile(ORIGEN) : await limpiarFoto();
  if (reusar) console.log("foto        se reutiliza la ya procesada");

  if (!reusar) await placeholder(limpia);
  if (!soloOg) await iconos();
  await tarjetasSociales(limpia);
}

async function placeholder(limpia) {
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
}

async function iconos() {
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
}

async function tarjetasSociales(limpia) {
  // 4 · Open Graph por idioma.
  // En blanco y negro, como la foto del hero.
  const retrato = await sharp(limpia)
    .resize(520, 630, { fit: "cover", position: "attention" })
    .grayscale()
    .toBuffer();

  // El titular va partido en dos líneas: entero no cabe antes de la foto,
  // que empieza en x=680. La mono en versales con este tracking anda por los
  // 19 px por carácter, así que el corte es obligado, no estético.
  const textos = {
    es: {
      rol: ["Desarrollador Frontend", "& Data Analyst"],
      sitio: "Santiago de Chile",
    },
    en: {
      rol: ["Frontend Developer", "& Data Analyst"],
      sitio: "Santiago, Chile",
    },
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
