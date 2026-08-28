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
};

export default nextConfig;
