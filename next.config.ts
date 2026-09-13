import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * La raíz sirve el español sin exponer /es en la URL. Es un rewrite y no
   * un redirect a propósito: el enlace del CV queda limpio y sin saltos.
   * La canónica del español apunta a "/" (ver lib/metadata.ts).
   */
  async rewrites() {
    return [{ source: "/", destination: "/es" }];
  },
  /**
   * El PDF vive en una URL sin tildes, pero se guarda como
   * "CV-Benjamín-Peña.pdf". Los botones del sitio ya lo piden con el
   * atributo `download`; esta cabecera cubre a quien abre el enlace directo
   * (desde un correo, por ejemplo) y luego lo guarda. `inline` para que se
   * siga viendo en el navegador. `filename` va sin tildes para clientes
   * viejos y `filename*` (RFC 5987) lleva el nombre real.
   */
  async headers() {
    return [
      {
        source: "/CV-Benjamin-Pena.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: `inline; filename="CV-Benjamin-Pena.pdf"; filename*=UTF-8''${encodeURIComponent("CV-Benjamín-Peña.pdf")}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
