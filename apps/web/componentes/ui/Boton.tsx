import Link from "next/link";
import type { ComponentProps } from "react";

/** El ámbar es color de acción: solo aparece donde el usuario puede hacer algo.
 *  Nunca como texto ámbar sobre blanco (no llega a AA): siempre relleno con tinta encima. */
const variantes = {
  primario: "bg-ambar text-[#14142B] hover:bg-ambar-suave",
  secundario: "border border-indigo text-indigo hover:bg-elevado",
  fantasma: "text-tinta-sec hover:text-tinta",
} as const;

type Variante = keyof typeof variantes;

export function Boton({ variante = "primario", className = "", ...props }: ComponentProps<"button"> & { variante?: Variante }) {
  return <button className={`rounded-m px-5 py-3 font-medium ${variantes[variante]} ${className}`} {...props} />;
}

export function BotonEnlace({ variante = "primario", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`inline-block rounded-m px-5 py-3 font-medium ${variantes[variante]} ${className}`} {...props} />;
}
