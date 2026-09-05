import type { NodoMapa } from "@killalab/dominio";

/**
 * El mapa mental de un planeta.
 *
 * El trazado es ortogonal —solo tramos rectos y esquinas de noventa grados— porque
 * el sitio entero está dibujado sobre papel milimetrado y una curva libre no
 * pertenece a esa retícula. Los conectores corren por el canal central, como en un
 * esquema de laboratorio.
 *
 * El diagrama es decorativo para la accesibilidad (`aria-hidden`): debajo va la
 * misma información como lista de definición, que es lo que lee un lector de
 * pantalla y lo que se imprime. El dibujo no es la única vía al contenido.
 */

const FILA = 92;
const ANCHO = 1000;
const CANAL = ANCHO / 2;
const CAJA = 380;

export default function MapaMental({ nodos }: { nodos: NodoMapa[] }) {
  if (nodos.length === 0) return null;

  const posicion = new Map(
    nodos.map((n, i) => [
      n.id,
      { fila: i, lado: i % 2 === 0 ? ("izq" as const) : ("der" as const), y: i * FILA + FILA / 2 },
    ]),
  );

  const aristas = nodos.flatMap((n) =>
    n.aristas
      .filter((destino) => posicion.has(destino) && destino !== n.id)
      // Cada par se dibuja una sola vez, aunque el JSON declare la relación en ambos sentidos.
      .filter((destino) => posicion.get(n.id)!.fila < posicion.get(destino)!.fila)
      .map((destino) => ({ de: posicion.get(n.id)!, a: posicion.get(destino)!, clave: `${n.id}-${destino}` })),
  );

  const alto = nodos.length * FILA;

  return (
    <div className="mt-e5">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${ANCHO} ${alto}`}
          width={ANCHO}
          className="h-auto w-full min-w-[640px]"
          aria-hidden="true"
          focusable="false"
        >
          {/* El canal central: el eje del que cuelga todo */}
          <line
            x1={CANAL}
            y1={0}
            x2={CANAL}
            y2={alto}
            stroke="var(--borde)"
            strokeWidth="1"
          />

          {aristas.map(({ de, a, clave }) => {
            const xDe = de.lado === "izq" ? CANAL - 24 : CANAL + 24;
            const xA = a.lado === "izq" ? CANAL - 24 : CANAL + 24;
            return (
              <polyline
                key={clave}
                points={`${xDe},${de.y} ${CANAL},${de.y} ${CANAL},${a.y} ${xA},${a.y}`}
                fill="none"
                stroke="var(--killa-turquesa)"
                strokeWidth="1.5"
              />
            );
          })}

          {nodos.map((n) => {
            const p = posicion.get(n.id)!;
            const x = p.lado === "izq" ? CANAL - 24 - CAJA : CANAL + 24;
            return (
              <g key={n.id}>
                <line
                  x1={p.lado === "izq" ? CANAL - 24 : CANAL}
                  y1={p.y}
                  x2={p.lado === "izq" ? CANAL : CANAL + 24}
                  y2={p.y}
                  stroke="var(--killa-turquesa)"
                  strokeWidth="1.5"
                />
                <rect
                  x={x}
                  y={p.y - 26}
                  width={CAJA}
                  height={52}
                  rx="2"
                  fill="var(--bg)"
                  stroke="var(--killa-indigo)"
                  strokeWidth="1.5"
                />
                <text
                  x={x + 16}
                  y={p.y + 6}
                  fill="var(--texto)"
                  fontFamily="var(--fuente-display)"
                  fontSize="19"
                  fontWeight="600"
                >
                  {n.titulo}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <dl className="mt-e5">
        {nodos.map((n) => (
          <div key={n.id} className="grid gap-x-e3 gap-y-1 border-t border-borde py-e3 sm:grid-cols-12">
            <dt className="t-subtitulo text-indigo sm:col-span-4">{n.titulo}</dt>
            <dd className="t-cuerpo text-tinta sm:col-span-8">
              {n.explicacion}
              {n.aristas.length > 0 ? (
                <span className="t-anotacion mt-e1 block">
                  Conecta con{" "}
                  {n.aristas
                    .map((a) => nodos.find((x) => x.id === a)?.titulo ?? a)
                    .join(", ")}
                  .
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
