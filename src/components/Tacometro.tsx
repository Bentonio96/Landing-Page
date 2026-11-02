type Props = {
  valor: number;
  maximo: number;
  etiqueta: string;
};

/**
 * Un tacómetro que marca un dato real (los proyectos publicados) en vez
 * de revoluciones. El número va escrito al lado, así que el dibujo es
 * decorativo y la cifra se lee como texto normal.
 */
export function Tacometro({ valor, maximo, etiqueta }: Props) {
  // Arco de 240°, de -210° a 30°, como un tacómetro de verdad.
  const desde = -210;
  const barrido = 240;
  const angulo = desde + (barrido * Math.min(valor, maximo)) / maximo;
  const punto = (grados: number, r: number) => {
    const rad = (grados * Math.PI) / 180;
    return [60 + r * Math.cos(rad), 60 + r * Math.sin(rad)] as const;
  };
  const marcas = Array.from({ length: maximo + 1 }, (_, i) => desde + (barrido * i) / maximo);
  const [ax, ay] = punto(angulo, 40);

  return (
    <div className="flex items-center gap-5">
      <svg aria-hidden="true" viewBox="0 0 120 104" className="w-32 shrink-0">
        {marcas.map((g, i) => {
          const [x1, y1] = punto(g, 50);
          const [x2, y2] = punto(g, i % 5 === 0 ? 40 : 45);
          return (
            <line
              key={g}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={g <= angulo ? "var(--c-acento-asfalto)" : "var(--c-linea)"}
              strokeWidth={i % 5 === 0 ? 2.5 : 1.5}
            />
          );
        })}
        <line x1="60" y1="60" x2={ax} y2={ay} stroke="var(--c-sobre-asfalto)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4.5" fill="var(--c-senal)" />
      </svg>
      <p>
        <span className="voz-carrera block text-t2">{valor}</span>
        <span className="micro text-atenuadoasfalto">{etiqueta}</span>
      </p>
    </div>
  );
}
