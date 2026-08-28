import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
};

/** Etiqueta discreta para nombres de tecnologías. */
export function Chip({ children, className }: Props) {
  return (
    <li
      className={cn(
        "rounded-chip border border-borde bg-elevado px-2.5 py-1",
        "font-mono text-etiqueta tracking-wide text-atenuado",
        className,
      )}
    >
      {children}
    </li>
  );
}
