"use client";

import { useEffect } from "react";
import { irA, registrarDesplazador } from "@/lib/cliente";

/**
 * Scroll suave (Lenis) y las animaciones atadas al scroll (GSAP +
 * ScrollTrigger), en un solo lugar.
 *
 * - Las librerías se importan en diferido, dentro del efecto: no entran al
 *   JavaScript inicial ni compiten con la foto del hero.
 * - Todo vive en `gsap.matchMedia` con `prefers-reduced-motion:
 *   no-preference`. Sin movimiento no se crea Lenis ni una animación, y si
 *   la preferencia cambia con la página abierta, GSAP lo revierte todo.
 * - Nada anima la opacidad del texto: desplazamientos, recortes y escalas.
 * - Lenis y GSAP comparten un solo requestAnimationFrame.
 */
export function Movimiento() {
  useEffect(() => {
    let cancelado = false;
    let revertir = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelado) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ lerp: 0.11, autoRaf: false });
        lenis.on("scroll", ScrollTrigger.update);
        const alTick = (tiempo: number) => lenis.raf(tiempo * 1000);
        gsap.ticker.add(alTick);
        gsap.ticker.lagSmoothing(0);
        registrarDesplazador({ scrollTo: (destino) => lenis.scrollTo(destino, { offset: 0 }) });

        // Anclas internas con el mismo scroll suave, y el foco al sector.
        const alClic = (evento: MouseEvent) => {
          const enlace = (evento.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!enlace || enlace.hash === "#contenido" || !enlace.hash) return;
          if (!document.getElementById(enlace.hash.slice(1))) return;
          evento.preventDefault();
          irA(enlace.hash.slice(1));
        };
        document.addEventListener("click", alClic);

        // --- La línea de cronometraje de cada sector se dibuja ----------
        gsap.utils.toArray<HTMLElement>("[data-trazo]").forEach((linea) => {
          gsap.from(linea, {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: linea, start: "top 92%", once: true },
          });
        });

        // --- Titulares: las palabras suben desde su propia ranura --------
        gsap.utils.toArray<HTMLElement>("[data-titular]").forEach((titular) => {
          gsap.from(titular.querySelectorAll(".palabra"), {
            yPercent: 105,
            skewX: -8,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: titular, start: "top 88%", once: true },
          });
        });

        // --- El número fantasma del sector se desliza con el scroll ------
        gsap.utils.toArray<SVGElement>("[data-fantasma]").forEach((numero) => {
          gsap.fromTo(
            numero,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: { trigger: numero.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-revelar]").forEach((bloque) => {
          gsap.from(bloque, {
            y: 48,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: bloque, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-escalonar]").forEach((grupo) => {
          gsap.from(grupo.children, {
            y: 36,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: grupo, start: "top 88%", once: true },
          });
        });

        // --- Garage: la cortina baja cerrada y sube al llegar ------------
        gsap.utils.toArray<HTMLElement>("[data-garage]").forEach((box) => {
          const cortina = box.querySelector("[data-cortina]");
          if (!cortina) return;
          gsap.fromTo(
            cortina,
            { yPercent: 0 },
            {
              yPercent: -101,
              ease: "power2.inOut",
              scrollTrigger: { trigger: box, start: "top 82%", end: "top 30%", scrub: 0.6 },
            },
          );
          const imagen = box.querySelector("img");
          if (!imagen) return;
          gsap.fromTo(
            imagen,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // --- Torre de tiempos: las filas entran como una actualización ---
        const torre = document.querySelector("[data-torre]");
        if (torre) {
          gsap.from(torre.children, {
            xPercent: 6,
            clipPath: "inset(0 0 0 100%)",
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: torre, start: "top 85%", once: true },
          });
        }

        // --- La bandera a cuadros flamea al llegar al box ---------------
        const bandera = document.querySelector("[data-bandera]");
        if (bandera) {
          gsap.fromTo(
            bandera,
            { backgroundPositionX: "0px" },
            {
              backgroundPositionX: "280px",
              ease: "none",
              scrollTrigger: { trigger: bandera, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        // --- Parrilla: dos planos a distinta distancia al salir ----------
        const hero = document.querySelector("#parrilla");
        if (hero && matchMedia("(min-width: 1024px)").matches) {
          gsap.to("[data-parallax-foto]", {
            y: 90,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-parallax-texto]", {
            y: -60,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          registrarDesplazador(null);
          document.removeEventListener("click", alClic);
          gsap.ticker.remove(alTick);
          lenis.destroy();
        };
      });

      revertir = () => mm.revert();
    })();

    return () => {
      cancelado = true;
      revertir();
    };
  }, []);

  return null;
}
