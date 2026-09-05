"use client";
import { useState } from "react";
import type { Flashcards as Mazo } from "@killalab/dominio";
import { UMBRAL_APROBACION, comentarioDe, corregirRespuesta } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";
import Anillo from "@/componentes/panel/Anillo";

/**
 * Tarjetas de respuesta escrita.
 *
 * El estudiante escribe con sus palabras y el sistema le dice cuánto se acercó,
 * qué ideas tocó y cuáles le faltaron. Solo después de responder se enseña la
 * respuesta modelo: mostrarla antes convierte el ejercicio en leer y asentir.
 *
 * La corrección es instantánea y **no llama a ningún modelo**: las ideas clave se
 * generaron antes, en el taller, y compararlas es una función pura. Por eso esto
 * funciona en un aula sin internet.
 *
 * Fallar no bloquea. Se puede reintentar, o pasar y volver luego: la tarjeta que
 * no salió vuelve a la cola en vez de quedarse trabando el mazo.
 */
export default function Flashcards({ mazo }: { mazo: Mazo }) {
  const [indice, setIndice] = useState(0);
  const [escrito, setEscrito] = useState("");
  const [correccion, setCorreccion] = useState<ReturnType<typeof corregirRespuesta> | null>(null);
  const [aprobadas, setAprobadas] = useState<string[]>([]);
  const [pendientes, setPendientes] = useState(() => mazo.tarjetas.map((t) => t.id));

  const tarjeta = mazo.tarjetas.find((t) => t.id === pendientes[indice % Math.max(pendientes.length, 1)]);
  const total = mazo.tarjetas.length;
  const porcentaje = total === 0 ? 0 : Math.round((aprobadas.length / total) * 100);
  const terminado = pendientes.length === 0;

  function comprobar() {
    if (!tarjeta) return;
    const c = corregirRespuesta(tarjeta, escrito);
    setCorreccion(c);
    if (c.aprobada && !aprobadas.includes(tarjeta.id)) {
      setAprobadas((a) => [...a, tarjeta.id]);
    }
  }

  function siguiente(quitar: boolean) {
    if (!tarjeta) return;
    setCorreccion(null);
    setEscrito("");
    if (quitar) {
      setPendientes((p) => p.filter((id) => id !== tarjeta.id));
      setIndice(0);
    } else {
      setIndice((i) => i + 1);
    }
  }

  if (terminado) {
    return (
      <div className="border-t-2 border-ok pt-e3">
        <h3 className="t-subtitulo text-tinta">Mazo terminado</h3>
        <p className="t-cuerpo medida mt-e1 text-tinta-sec">
          Respondiste las {total} tarjetas con tus propias palabras. Eso es bastante más difícil
          que reconocer la opción correcta entre cuatro.
        </p>
        <Boton
          variante="secundario"
          className="mt-e3"
          onClick={() => {
            setPendientes(mazo.tarjetas.map((t) => t.id));
            setAprobadas([]);
            setIndice(0);
          }}
        >
          Repasar otra vez
        </Boton>
      </div>
    );
  }

  if (!tarjeta) return null;

  return (
    <div>
      <div className="flex items-center gap-e3 border-t-2 border-indigo pt-e3">
        <Anillo porcentaje={porcentaje} tamano={48} completado={porcentaje === 100} />
        <div>
          <p className="t-cifra-min text-tinta-sec">
            {aprobadas.length} de {total} sabidas, {pendientes.length} en la cola
          </p>
          <p className="t-anotacion">
            Se da por sabida a partir del {UMBRAL_APROBACION} % de las ideas clave.
          </p>
        </div>
      </div>

      <div className="mt-e4 max-w-[56ch]">
        <p className="t-anotacion">Responde con tus palabras</p>
        <h3 className="t-titulo mt-1 text-tinta">{tarjeta.pregunta}</h3>

        <label htmlFor="respuesta" className="sr-only">
          Tu respuesta a: {tarjeta.pregunta}
        </label>
        <textarea
          id="respuesta"
          rows={4}
          value={escrito}
          onChange={(e) => {
            setEscrito(e.target.value);
            setCorreccion(null);
          }}
          placeholder="Explícalo como se lo explicarías a alguien de tu clase"
          className="t-cuerpo mt-e3 w-full rounded-m border border-borde bg-transparent p-e2 text-tinta placeholder:text-tinta-sec focus:border-indigo focus:outline-none"
        />

        {correccion === null ? (
          <Boton variante="primario" className="mt-e2" onClick={comprobar} disabled={escrito.trim() === ""}>
            Comprobar mi respuesta
          </Boton>
        ) : (
          <div className="mt-e3" aria-live="polite">
            <div className="flex items-center gap-e3">
              <Anillo
                porcentaje={correccion.porcentaje}
                tamano={56}
                completado={correccion.aprobada}
              />
              <p className={`t-cuerpo ${correccion.aprobada ? "text-ok" : "text-warn"}`}>
                <span aria-hidden="true">{correccion.aprobada ? "✓ " : "○ "}</span>
                {comentarioDe(correccion)}
              </p>
            </div>

            <dl className="mt-e3 grid gap-e2 sm:grid-cols-2">
              <div>
                <dt className="t-anotacion">Mencionaste</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {correccion.clavesTocadas.length === 0 ? (
                    <span className="t-apoyo text-tinta-sec">nada de lo esencial</span>
                  ) : (
                    correccion.clavesTocadas.map((c) => (
                      <span key={c} className="t-cifra-min rounded-s border border-ok px-1.5 py-0.5 text-ok">
                        {c}
                      </span>
                    ))
                  )}
                </dd>
              </div>
              <div>
                <dt className="t-anotacion">Te faltó</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {correccion.clavesFaltantes.length === 0 ? (
                    <span className="t-apoyo text-tinta-sec">nada</span>
                  ) : (
                    correccion.clavesFaltantes.map((c) => (
                      <span key={c} className="t-cifra-min rounded-s border border-borde px-1.5 py-0.5 text-tinta-sec">
                        {c}
                      </span>
                    ))
                  )}
                </dd>
              </div>
            </dl>

            {/* El reverso de la tarjeta: solo después de responder. */}
            <div className="mt-e3 border-l-2 border-turquesa pl-e3">
              <p className="t-anotacion">La respuesta modelo</p>
              <p className="t-cuerpo mt-1 text-tinta">{tarjeta.respuesta}</p>
            </div>

            <div className="mt-e3 flex flex-wrap gap-e3">
              <Boton variante="primario" onClick={() => siguiente(correccion.aprobada)}>
                {correccion.aprobada ? "Siguiente tarjeta" : "Seguir y volver a esta luego"}
              </Boton>
              {!correccion.aprobada ? (
                <Boton variante="sobrio" onClick={() => setCorreccion(null)}>
                  Reescribir mi respuesta
                </Boton>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
