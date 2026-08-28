import type { Metadata, Viewport } from "next";
import type { Idioma } from "@/types";
import { perfil, seo, SITIO_URL } from "@/data/perfil";

export const viewportBase: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0E12" },
  ],
  colorScheme: "light dark",
};

/**
 * Metadata completa por idioma: canonical, hreflang cruzado, Open Graph
 * con imagen dedicada (para LinkedIn y WhatsApp) y Twitter card.
 */
export function construirMetadata(idioma: Idioma): Metadata {
  const { titulo, descripcion } = seo[idioma];
  const ruta = idioma === "es" ? "/" : "/en";
  const imagen = `${SITIO_URL}/og-${idioma}.png`;

  return {
    metadataBase: new URL(SITIO_URL),
    title: titulo,
    description: descripcion,
    keywords: seo.palabrasClave[idioma],
    authors: [{ name: perfil.nombre, url: SITIO_URL }],
    creator: perfil.nombre,
    applicationName: titulo,
    alternates: {
      canonical: ruta,
      languages: {
        es: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: perfil.nombre,
      title: titulo,
      description: descripcion,
      url: ruta,
      locale: idioma === "es" ? "es_CL" : "en_US",
      alternateLocale: idioma === "es" ? "en_US" : "es_CL",
      images: [
        {
          url: imagen,
          width: 1200,
          height: 630,
          alt: titulo,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagen],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}
