import { FUENTES, type CodigoFuente } from "@killalab/api";

/** `fuente` es prop requerida a propósito: la promesa del producto es que ninguna
 *  cifra aparece sin decir de dónde viene. El tipo lo hace imposible de olvidar. */
export default function EtiquetaFuente({ fuente }: { fuente: CodigoFuente }) {
  const f = FUENTES[fuente];
  return (
    <a
      href={f.url}
      target="_blank"
      rel="noreferrer noopener"
      className="font-dato text-[13px] text-turquesa underline decoration-dotted underline-offset-4"
    >
      fuente: {f.nombre}
    </a>
  );
}
