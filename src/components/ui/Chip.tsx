import { cn } from "@/lib/utils";

type Props = {
  children: string;
  /** Resalta la tecnología con el color de acento. */
  principal?: boolean;
  /**
   * Texto solo para lectores de pantalla que explica el resalte. Sin esto,
   * "principal" se transmitiría únicamente por color, que es justo lo que
   * prohíbe el criterio WCAG 1.4.1.
   */
  etiquetaPrincipal?: string;
  className?: string;
};

/** Etiqueta discreta para nombres de tecnologías. */
export function Chip({
  children,
  principal = false,
  etiquetaPrincipal,
  className,
}: Props) {
  return (
    <li
      className={cn(
        "rounded-chip border px-2.5 py-1 font-mono text-etiqueta tracking-wide",
        principal
          ? "border-acento/40 bg-acentotenue text-acento"
          : "border-borde bg-elevado text-atenuado",
        className,
      )}
    >
      {children}
      {principal && etiquetaPrincipal ? (
        <span className="sr-only"> — {etiquetaPrincipal}</span>
      ) : null}
    </li>
  );
}
