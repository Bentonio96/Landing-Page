import type { MetadataRoute } from "next";

/**
 * La v5 es una propuesta paralela: su canónica apunta al sitio oficial
 * (ver lib/metadata.ts), así que no publica sitemap propio. El sitemap vive
 * en benjamin-pena.vercel.app.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
