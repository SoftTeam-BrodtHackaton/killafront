import type { Ficha, Secuencia } from "@killalab/dominio";

/**
 * La lección entera en una página: lo que cabe en una hoja antes de un examen.
 *
 * No la escribió un modelo: sale de un `map()` sobre el mismo JSON del tema. Por
 * eso no hay nada que revisar aquí y no lleva sello de origen.
 */
export default function FichaRepaso({ ficha, secuencia }: { ficha: Ficha; secuencia: Secuencia | null }) {
  return (
    <article className="max-w-[62ch]">
      <p className="t-anotacion">se lee en {ficha.duracionMin} min</p>
      <p className="t-cuerpo mt-e2 border-l-2 border-turquesa pl-e3 text-tinta">{ficha.idea}</p>

      <h3 className="t-subtitulo mt-e5 text-tinta">Lo que hay que entender</h3>
      <dl className="mt-e2">
        {ficha.puntos.map((p) => (
          <div key={p.titulo} className="border-t border-borde py-e2">
            <dt className="t-subtitulo text-indigo">{p.titulo}</dt>
            <dd className="t-cuerpo mt-0.5 text-tinta">{p.explicacion}</dd>
          </div>
        ))}
      </dl>

      {secuencia && secuencia.pasos.length > 1 ? (
        <>
          <h3 className="t-subtitulo mt-e5 text-tinta">En qué orden</h3>
          <p className="t-apoyo mt-1 text-tinta-sec">
            Cada idea se apoya en la anterior. Si algo no cuadra, suele ser porque falta la de
            arriba.
          </p>
          <ol className="mt-e3">
            {secuencia.pasos.map((p) => (
              <li key={p.id} className="flex gap-e2 border-t border-borde py-e2">
                <span className="t-cifra shrink-0 text-turquesa-texto">
                  {String(p.posicion).padStart(2, "0")}
                </span>
                <span className="t-apoyo text-tinta">{p.titulo}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <h3 className="t-subtitulo mt-e5 text-tinta">Compruébate</h3>
      <dl className="mt-e2">
        {ficha.comprueba.map((c) => (
          <div key={c.pregunta} className="border-t border-borde py-e2">
            <dt className="t-cuerpo text-tinta">{c.pregunta}</dt>
            <dd className="t-cifra mt-1 text-turquesa-texto">{c.respuesta}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
