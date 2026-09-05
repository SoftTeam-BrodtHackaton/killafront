import { FUENTES, type CodigoFuente } from "@killalab/dominio";

/**
 * `fuente` es prop requerida a propósito. La promesa del producto es que ninguna
 * cifra aparece sin decir de dónde viene, y el tipo lo hace imposible de olvidar.
 *
 * El contenido propio no tiene enlace externo: se declara igual, sin fingir que
 * hay una fuente que consultar.
 */
export default function EtiquetaFuente({ fuente }: { fuente: CodigoFuente }) {
  const f = FUENTES[fuente];

  if (!f.url) {
    return <span className="t-cifra-min text-tinta-sec">fuente: {f.nombre}</span>;
  }

  return (
    <a
      href={f.url}
      target="_blank"
      rel="noreferrer noopener"
      className="t-cifra-min text-turquesa-texto underline decoration-dotted underline-offset-4 hover:decoration-solid"
    >
      fuente: {f.nombre}
    </a>
  );
}
