/**
 * Convierte el retrato recortado (public/retrato.webp) en la ilustración de
 * tinta del pie: zonas oscuras y bordes en negro, el resto blanco.
 * Uso: MEDIANA=7 node scripts/ilustrar-retrato.mjs public/retrato.webp /tmp/b.png 58 24
 * (después se reduce a paleta de 4 colores para que pese ~5 KB).
 */
import sharp from "sharp";
const [src, out, oscuroU = "62", bordeU = "34"] = process.argv.slice(2);
const UMBRAL_OSCURO = Number(oscuroU), UMBRAL_BORDE = Number(bordeU);
const img = sharp(src).ensureAlpha();
const { width: W, height: H } = await img.metadata();
const rgba = await img.raw().toBuffer();
const gris = new Float32Array(W * H), alfa = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) {
  gris[i] = 0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2];
  alfa[i] = rgba[i * 4 + 3];
}
// desenfoque 5x5 para que los bordes sean trazos y no ruido
const suave = new Float32Array(W * H);
const r = 2;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let s = 0, n = 0;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const xx = Math.min(W - 1, Math.max(0, x + dx)), yy = Math.min(H - 1, Math.max(0, y + dy));
    s += gris[yy * W + xx]; n++;
  }
  suave[y * W + x] = s / n;
}
// normalizar contraste dentro de la silueta
let min = 255, max = 0;
for (let i = 0; i < W * H; i++) if (alfa[i] > 128) { min = Math.min(min, suave[i]); max = Math.max(max, suave[i]); }
const g = (i) => ((suave[i] - min) / (max - min)) * 255;
const sal = Buffer.alloc(W * H * 4);
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const i = y * W + x;
  const gx = -g(i - W - 1) - 2 * g(i - 1) - g(i + W - 1) + g(i - W + 1) + 2 * g(i + 1) + g(i + W + 1);
  const gy = -g(i - W - 1) - 2 * g(i - W) - g(i - W + 1) + g(i + W - 1) + 2 * g(i + W) + g(i + W + 1);
  const borde = Math.hypot(gx, gy) / 4;
  // contorno de la silueta
  let filo = false;
  if (alfa[i] > 128) for (const d of [-3, 3, -3 * W, 3 * W]) if (alfa[i + d] !== undefined && alfa[i + d] < 128) filo = true;
  const tinta = filo || g(i) < UMBRAL_OSCURO || borde > UMBRAL_BORDE;
  const o = i * 4;
  const v = tinta ? 17 : 255;
  sal[o] = sal[o + 1] = sal[o + 2] = v;
  sal[o + 3] = alfa[i] > 128 ? 255 : 0;
}
// El polerón va negro entero: bajo el cuello, las manchas claras que no son
// el logo (una franja angosta) se rellenan, como en una ilustración a tinta.
const desdeY = Math.round(H * 0.55);
for (let y = desdeY; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (alfa[i] <= 128) continue;
  const enLogo = y > H * 0.72 && y < H * 0.82 && x > W * 0.6 && x < W * 0.8;
  const enCara = y < H * 0.62 && x > W * 0.38 && x < W * 0.62;
  if (!enLogo && !enCara && g(i) < 150) sal[i * 4] = sal[i * 4 + 1] = sal[i * 4 + 2] = 17;
}
await sharp(sal, { raw: { width: W, height: H, channels: 4 } }).median(Number(process.env.MEDIANA ?? 3)).png().toFile(out);
console.log(out);
