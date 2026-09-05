import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * El ámbar es color de acción: aparece solo donde el usuario puede hacer algo, y
 * nunca como texto ámbar sobre blanco, que no llega a contraste AA. Siempre es
 * relleno con tinta encima.
 *
 * `primario` se usa una vez por pantalla. Si hay dos ámbares compitiendo, ninguno
 * es la acción principal.
 */
const variantes = {
  primario:
    "bg-ambar text-[#14142B] border border-ambar hover:bg-ambar-suave hover:border-ambar-suave",
  secundario:
    "bg-transparent text-indigo border border-indigo hover:bg-indigo hover:text-lienzo",
  // Sin marco: un enlace de texto con la regla debajo, como una anotación subrayada.
  sobrio:
    "border-b border-borde text-tinta hover:border-indigo px-0 py-1 rounded-none",
} as const;

type Variante = keyof typeof variantes;

/* Deshabilitado se comunica por opacidad y por cursor, no solo por color: un botón
   que no se puede pulsar tiene que verse así también en un proyector lavado. */
const base =
  "inline-flex items-center justify-center rounded-m px-e3 py-2.5 font-cuerpo text-[0.9375rem] font-bold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

export function Boton({ variante = "primario", className = "", ...props }: ComponentProps<"button"> & { variante?: Variante }) {
  return <button className={`${base} ${variantes[variante]} ${className}`} {...props} />;
}

export function BotonEnlace({ variante = "primario", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`${base} ${variantes[variante]} ${className}`} {...props} />;
}
