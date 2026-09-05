/**
 * Una regla con sus marcas y, si hay lectura, un cursor sobre ella.
 *
 * Es el recurso visual que se repite en todo el sitio: la clase de la llamarada,
 * el avance de una misión, las distancias. Medir es de lo que trata el producto,
 * así que la escala es el elemento de composición y no la tarjeta.
 *
 * Marcas y etiquetas comparten el mismo reparto porcentual y las etiquetas van
 * centradas sobre su marca: una escala cuyos rótulos no caen encima de su marca
 * no es una escala, es un adorno con números.
 *
 * `posicion` va de 0 a 1. Si es null se dibuja la regla sin cursor: se ve que hay
 * una escala y que esta lectura no se pudo situar en ella, que también es
 * información.
 */
export default function Escala({
  marcas,
  posicion,
  etiquetaCursor,
  anima = false,
}: {
  marcas: string[];
  posicion: number | null;
  etiquetaCursor?: string;
  anima?: boolean;
}) {
  const reparto = (i: number) => (marcas.length <= 1 ? 0 : (i / (marcas.length - 1)) * 100);

  return (
    <div className="px-2">
      <div
        className="escala"
        role="img"
        aria-label={etiquetaCursor ?? `escala de ${marcas[0]} a ${marcas[marcas.length - 1]}`}
      >
        {marcas.map((m, i) => (
          <span
            key={m}
            className="escala__marca"
            style={{ left: `${reparto(i)}%` }}
            aria-hidden="true"
          />
        ))}

        {posicion !== null ? (
          <span
            className={`escala__cursor ${anima ? "escala__cursor--anima" : ""}`}
            style={{ left: `${Math.min(Math.max(posicion, 0), 1) * 100}%` }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="relative mt-1 h-4" aria-hidden="true">
        {marcas.map((m, i) => (
          <span
            key={m}
            className="t-cifra-min absolute -translate-x-1/2 text-tinta-sec"
            style={{ left: `${reparto(i)}%` }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
