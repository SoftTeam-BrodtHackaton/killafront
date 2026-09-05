import type { ReactNode } from "react";

/**
 * Un bloque de la hoja: el margen anotado a la izquierda y el registro a la
 * derecha. Sustituye a la banda de sección con su rótulo en mayúsculas encima
 * del título.
 *
 * La anotación va donde va en un cuaderno de laboratorio —al margen, en
 * minúscula, pegada a la línea del título— en vez de gritar sobre el contenido.
 */
export default function Registro({
  anotacion,
  children,
  id,
}: {
  anotacion: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="registro">
      <p className="margen">{anotacion}</p>
      <div>{children}</div>
    </section>
  );
}
