"use client";

import { useEffect } from "react";

/** Alfabeto del descifrado: el de las etiquetas mono, en versales. */
const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Scroll suave (Lenis) y todas las animaciones ligadas al scroll o al
 * puntero (GSAP + ScrollTrigger + ScrambleText), en un solo sitio.
 *
 * Decisiones que conviene no deshacer:
 *
 * - Las librerías se importan en diferido, dentro del efecto. No entran
 *   en el JavaScript inicial, así que no compiten con la foto del hero (el
 *   LCP) ni alargan la hidratación. Lo único que se anima al cargar —las
 *   letras del nombre— es CSS por ese mismo motivo.
 *
 * - Todo vive dentro de `gsap.matchMedia` con `prefers-reduced-motion:
 *   no-preference`. Si el sistema pide menos movimiento no se crea ni Lenis
 *   ni una sola animación, y si la preferencia cambia con la página abierta,
 *   GSAP lo revierte todo solo.
 *
 * - Nada anima la opacidad. Los estados iniciales son desplazamientos y
 *   giros; el texto siempre tiene su color final (ver globals.css,
 *   MOVIMIENTO). La excepción aparente es la cita, que mezcla color, y sus
 *   dos extremos cumplen AA.
 *
 * - GSAP no toca la estructura del DOM. Las palabras y letras se parten en
 *   el servidor; aquí solo se escriben transformaciones en línea, que React
 *   no gestiona y por tanto no pisa al volver a renderizar. La excepción es
 *   el descifrado de las etiquetas mono: reescribe el texto de un span sin
 *   hijos, siempre termina en el texto original, y al revertir se repone.
 */
export function Movimiento() {
  useEffect(() => {
    let cancelado = false;
    let revertir = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/ScrambleTextPlugin"),
          import("lenis"),
        ]);
      if (cancelado) return;

      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // --- Lenis, sincronizado con el reloj de GSAP -------------------
        // Un único requestAnimationFrame para los dos: si cada uno llevara
        // el suyo, ScrollTrigger leería posiciones con un frame de retraso
        // y los efectos atados al scroll temblarían.
        const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
        lenis.on("scroll", ScrollTrigger.update);
        const alTick = (tiempo: number) => lenis.raf(tiempo * 1000);
        gsap.ticker.add(alTick);
        gsap.ticker.lagSmoothing(0);

        // Anclas internas con el mismo scroll suave. El enlace para saltar
        // al contenido se deja nativo: debe mover el foco del teclado, y un
        // scroll programático no lo mueve.
        const alClic = (evento: MouseEvent) => {
          const enlace = (evento.target as Element).closest<HTMLAnchorElement>(
            'a[href^="#"]',
          );
          if (!enlace || enlace.hash === "#contenido") return;
          const destino = document.querySelector<HTMLElement>(enlace.hash);
          if (!destino) return;
          evento.preventDefault();
          // Sin offset propio: Lenis ya descuenta el scroll-padding-top del
          // html y el scroll-margin de la sección, igual que el salto nativo.
          lenis.scrollTo(destino);
          history.replaceState(null, "", enlace.hash);
        };
        document.addEventListener("click", alClic);

        // --- Bloques que entran con el scroll ----------------------------
        gsap.utils.toArray<HTMLElement>("[data-revelar]").forEach((bloque) => {
          gsap.from(bloque, {
            y: 56,
            duration: 1.2,
            ease: "expo.out",
            delay: Number(bloque.dataset.retardo ?? 0),
            scrollTrigger: { trigger: bloque, start: "top 90%", once: true },
          });
        });

        // --- Hijos que entran uno detrás de otro ------------------------
        // data-escalonar="x" los trae desde la izquierda; vacío, desde abajo.
        gsap.utils.toArray<HTMLElement>("[data-escalonar]").forEach((grupo) => {
          const horizontal = grupo.dataset.escalonar === "x";
          gsap.from(grupo.children, {
            ...(horizontal ? { x: -40 } : { y: 40 }),
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: grupo, start: "top 88%", once: true },
          });
        });

        // --- Reglas capilares que se dibujan ----------------------------
        // Mueven --trazo, que es el ancho del fondo de 1 px que hace de
        // línea (ver .trazo-superior en globals.css).
        gsap.utils.toArray<HTMLElement>("[data-trazo]").forEach((linea) => {
          gsap.fromTo(
            linea,
            { "--trazo": 0 },
            {
              "--trazo": 1,
              duration: 1.6,
              ease: "expo.inOut",
              scrollTrigger: { trigger: linea, start: "top 92%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-regla]").forEach((regla) => {
          gsap.from(regla, {
            scaleX: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.2,
            scrollTrigger: { trigger: regla, start: "top 90%", once: true },
          });
        });

        // --- Titulares de sección: palabras que giran en 3D -------------
        gsap.utils.toArray<HTMLElement>("[data-titular-3d]").forEach((titular) => {
          gsap.from(titular.querySelectorAll(".palabra"), {
            yPercent: 60,
            rotateX: -88,
            z: -80,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: titular, start: "top 88%", once: true },
          });
        });

        // --- Hero: profundidad al salir ----------------------------------
        // La foto baja más lenta que la página y el texto sube más rápido:
        // dos planos a distinta distancia.
        const hero = document.querySelector("#inicio");
        if (hero) {
          gsap.to("[data-parallax-foto]", {
            yPercent: 14,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-parallax-texto]", {
            y: -120,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        // --- Cita: las palabras se encienden al ritmo de la lectura ------
        const cita = document.querySelector("[data-cita-scroll]");
        if (cita) {
          gsap.fromTo(
            cita.querySelectorAll(".palabra-cita"),
            { "--p": 0 },
            {
              "--p": 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: cita, start: "top 82%", end: "bottom 50%", scrub: 0.4 },
            },
          );

          // El subrayado se traza detrás de las palabras, cuando la frase
          // ya está casi encendida: primero se lee, después se subraya.
          const subrayado = cita.querySelector("[data-subrayado]");
          if (subrayado) {
            gsap.fromTo(
              subrayado,
              { "--trazo": 0 },
              {
                "--trazo": 1,
                ease: "none",
                scrollTrigger: { trigger: cita, start: "top 60%", end: "bottom 40%", scrub: 0.5 },
              },
            );
          }
        }

        // --- Proyectos: capturas con relieve -----------------------------
        const quitarPunteros: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>("[data-escena-3d]").forEach((escena) => {
          const invertida = escena.hasAttribute("data-invertida");
          const capaScroll = escena.querySelector<HTMLElement>("[data-capa-scroll]");
          const capaPuntero = escena.querySelector<HTMLElement>("[data-capa-puntero]");
          if (!capaScroll || !capaPuntero) return;

          // Llega tumbada hacia atrás y girada hacia el texto, y se endereza
          // mientras sube hasta el centro de la pantalla.
          gsap.fromTo(
            capaScroll,
            { rotateX: 28, rotateY: invertida ? -14 : 14, scale: 0.86, y: 60 },
            {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: escena, start: "top bottom", end: "center 55%", scrub: 0.6 },
            },
          );

          // Inclinación hacia el cursor, solo con puntero fino: en táctil no
          // hay "encima" y el gesto sería un scroll.
          if (!window.matchMedia("(pointer: fine)").matches) return;
          // quickTo necesita el nombre canónico (rotationX), no el alias
          // rotateX: con el alias crea el tween pero cada actualización busca
          // una propiedad que no existe y la capa nunca se mueve.
          const girarX = gsap.quickTo(capaPuntero, "rotationX", { duration: 0.6, ease: "power3.out" });
          const girarY = gsap.quickTo(capaPuntero, "rotationY", { duration: 0.6, ease: "power3.out" });
          const alMover = (e: PointerEvent) => {
            const caja = escena.getBoundingClientRect();
            const nx = (e.clientX - caja.left) / caja.width - 0.5;
            const ny = (e.clientY - caja.top) / caja.height - 0.5;
            girarY(nx * 14);
            girarX(-ny * 10);
            capaPuntero.style.setProperty("--gx", `${(nx + 0.5) * 100}%`);
            capaPuntero.style.setProperty("--gy", `${(ny + 0.5) * 100}%`);
          };
          const alSalir = () => {
            girarX(0);
            girarY(0);
          };
          escena.addEventListener("pointermove", alMover);
          escena.addEventListener("pointerleave", alSalir);
          quitarPunteros.push(() => {
            escena.removeEventListener("pointermove", alMover);
            escena.removeEventListener("pointerleave", alSalir);
          });
        });

        // --- Cinta: el scroll la empuja ----------------------------------
        // Avanza sola, a paso de lectura. Con el scroll acelera en proporción
        // a la velocidad, se inclina como si la arrastrara el viento y toma
        // su sentido: al subir, retrocede. Cuando el scroll se detiene vuelve
        // de a poco a su paso, en el último sentido que tuvo.
        const cinta = document.querySelector<HTMLElement>("[data-cinta]");
        if (cinta) {
          const avance = gsap.to(cinta, {
            xPercent: -50,
            duration: 36,
            ease: "none",
            repeat: -1,
            paused: true,
            // Al retroceder hasta el principio salta cien vueltas adelante.
            // La cinta es periódica y el salto no se ve; sin él, el tween se
            // quedaría clavado en el cero.
            onReverseComplete: () => {
              avance.totalTime(avance.rawTime() + avance.duration() * 100);
            },
          });
          const inclinar = gsap.quickTo(cinta, "skewX", { duration: 0.5, ease: "power3.out" });
          let sentido = 1;
          const volverAlPaso = gsap
            .delayedCall(0.15, () => {
              gsap.to(avance, { timeScale: sentido, duration: 1.2, ease: "power2.out", overwrite: true });
              inclinar(0);
            })
            .pause();

          ScrollTrigger.create({
            trigger: cinta,
            start: "top bottom",
            end: "bottom top",
            // Fuera de pantalla se detiene: no gasta fotogramas en nada.
            onToggle: (self) => (self.isActive ? avance.play() : avance.pause()),
            onUpdate: (self) => {
              const velocidad = self.getVelocity();
              sentido = self.direction;
              const empuje = 1 + Math.min(Math.abs(velocidad) / 250, 6);
              gsap.to(avance, { timeScale: sentido * empuje, duration: 0.25, overwrite: true });
              inclinar(gsap.utils.clamp(-10, 10, -velocidad / 180));
              volverAlPaso.restart(true);
            },
          });
        }

        // --- Píldoras del stack: caen con rebote -------------------------
        // Cada una llega un poco girada y se asienta pasándose de largo
        // (back.out), como fichas que caen sobre la mesa.
        gsap.utils.toArray<HTMLElement>("[data-rebote]").forEach((grupo) => {
          gsap.from(grupo.children, {
            y: 18,
            scale: 0.6,
            rotation: () => gsap.utils.random(-10, 10),
            duration: 0.9,
            ease: "back.out(2.2)",
            stagger: 0.03,
            scrollTrigger: { trigger: grupo, start: "top 92%", once: true },
          });
        });

        // --- Etiquetas que se descifran ----------------------------------
        // Las mono pasan por ruido antes de asentarse, como una lectura de
        // terminal: las de sección al entrar en pantalla, las de botones y
        // filas al apuntarlas. El texto original se lee del DOM una sola vez
        // y se repone al revertir, por si algo se corta a medio descifrar.
        // En mono cada carácter mide lo mismo: el ruido no mueve nada.
        const textos = new Map<HTMLElement, string>();
        gsap.utils.toArray<HTMLElement>("[data-descifrar]").forEach((el) => {
          textos.set(el, el.textContent ?? "");
        });
        const descifrar = (el: HTMLElement, duracion: number) =>
          gsap.to(el, {
            duration: duracion,
            ease: "none",
            overwrite: true,
            scrambleText: {
              text: textos.get(el) ?? "",
              chars: el.dataset.caracteres ?? CARACTERES,
              speed: 0.7,
              revealDelay: duracion / 4,
            },
          });

        gsap.utils.toArray<HTMLElement>('[data-descifrar="entrar"]').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => descifrar(el, 1.1),
          });
        });

        // Todo lo que sigue reacciona a "estar encima", y en táctil no lo hay:
        // un toque dispararía el efecto justo cuando la página cambia.
        const punteroFino = window.matchMedia("(pointer: fine)").matches;

        if (punteroFino) {
          gsap.utils.toArray<HTMLElement>('[data-descifrar="apuntar"]').forEach((el) => {
            // Se dispara desde el enlace o botón entero, no solo desde el texto.
            const disparador = el.closest<HTMLElement>("a, button") ?? el;
            const alEntrar = () => descifrar(el, 0.6);
            disparador.addEventListener("pointerenter", alEntrar);
            quitarPunteros.push(() => disparador.removeEventListener("pointerenter", alEntrar));
          });

          // --- Nombre: las letras saltan al apuntarlas -------------------
          // Una ola: la letra apuntada salta estirándose, cae con un rebote
          // elástico y arrastra a sus vecinas de línea con menos fuerza y un
          // poco de retraso. overwrite: true corta el salto anterior de la
          // misma letra, que si no pelearía con el nuevo.
          const saltar = (letra: HTMLElement, fuerza: number, retardo: number) => {
            gsap
              .timeline({ delay: retardo })
              .to(letra, {
                yPercent: -18 * fuerza,
                scaleY: 1 + 0.12 * fuerza,
                scaleX: 1 - 0.08 * fuerza,
                rotation: gsap.utils.random(-7, 7) * fuerza,
                duration: 0.22,
                ease: "power2.out",
                overwrite: true,
              })
              .to(letra, {
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                rotation: 0,
                duration: 1.1,
                ease: "elastic.out(1, 0.3)",
              });
          };

          document.querySelectorAll("#hero-titulo .linea-titular").forEach((linea) => {
            const letras = gsap.utils.toArray<HTMLElement>(linea.querySelectorAll(".letra-salto"));
            letras.forEach((letra, i) => {
              const alEntrar = () => {
                for (let d = -2; d <= 2; d++) {
                  const vecina = letras[i + d];
                  if (vecina) saltar(vecina, 1 - Math.abs(d) * 0.35, Math.abs(d) * 0.05);
                }
              };
              letra.addEventListener("pointerenter", alEntrar);
              quitarPunteros.push(() => letra.removeEventListener("pointerenter", alEntrar));
            });
          });

          // --- Botones con imán ------------------------------------------
          // Se dejan atraer hacia el cursor y al soltarlos vuelven con un
          // rebote. La fuerza va en el atributo (data-iman="0.3"); vacío,
          // 0.22: en los CTA del hero, que van a 12 px, uno apenas roza al
          // otro. El centro se calcula descontando el desplazamiento que ya
          // tiene el botón: medido con el botón movido, el imán se
          // perseguiría a sí mismo y se quedaría corto.
          gsap.utils.toArray<HTMLElement>("[data-iman]").forEach((boton) => {
            const fuerza = Number(boton.dataset.iman || 0.22);
            const alMover = (e: PointerEvent) => {
              const caja = boton.getBoundingClientRect();
              const cx = caja.left + caja.width / 2 - Number(gsap.getProperty(boton, "x"));
              const cy = caja.top + caja.height / 2 - Number(gsap.getProperty(boton, "y"));
              gsap.to(boton, {
                x: (e.clientX - cx) * fuerza,
                y: (e.clientY - cy) * fuerza,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            };
            const alSalir = () => {
              gsap.to(boton, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
            };
            boton.addEventListener("pointermove", alMover);
            boton.addEventListener("pointerleave", alSalir);
            quitarPunteros.push(() => {
              boton.removeEventListener("pointermove", alMover);
              boton.removeEventListener("pointerleave", alSalir);
            });
          });
        }

        // Las fuentes cambian la altura de los titulares: se recalculan los
        // puntos de disparo cuando terminan de cargar.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          document.removeEventListener("click", alClic);
          quitarPunteros.forEach((quitar) => quitar());
          textos.forEach((texto, el) => {
            el.textContent = texto;
          });
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
