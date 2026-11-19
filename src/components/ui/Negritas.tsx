import { Fragment } from "react";

/** Pinta en negrita los fragmentos entre **dobles asteriscos**. */
export function Negritas({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("**").map((parte, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-texto">
            {parte}
          </strong>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
