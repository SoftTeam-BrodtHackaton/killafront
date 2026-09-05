"use client";
import { useState } from "react";
import type { Quiz as QuizDatos } from "@killalab/dominio";
import { semillaDeSesion, tomarVariadas } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";
import Anillo from "@/componentes/panel/Anillo";

/**
 * Quiz de opción múltiple.
 *
 * Se responde una pregunta a la vez y se corrige al instante, con el porqué. Un
 * quiz que solo dice "6 de 8" al final no enseña nada: lo que enseña es saber por
 * qué la que elegiste no era.
 *
 * Fallar no cierra la pregunta. Es repaso, no examen.
 *
 * Las preguntas salen de un banco grande y se eligen unas pocas cada vez,
 * repartidas entre conceptos distintos. Repasar dos veces el mismo tema no es
 * responder lo mismo dos veces: eso enseña a memorizar dónde estaba la respuesta,
 * no el contenido.
 */
const CUANTAS = 5;

export default function Quiz({ quiz }: { quiz: QuizDatos }) {
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState<string[]>([]);
  // El componente solo se monta cuando el estudiante elige esta pestaña, o sea
  // ya en el cliente: la semilla no puede desincronizar servidor y cliente.
  const [ronda, setRonda] = useState(() => tomarVariadas(quiz.preguntas, CUANTAS, semillaDeSesion()));

  const total = ronda.length;
  const pregunta = ronda[indice];
  const terminado = indice >= total;
  const porcentaje = total === 0 ? 0 : Math.round((aciertos.length / total) * 100);

  if (terminado || !pregunta) {
    return (
      <div className="border-t-2 border-ok pt-e3">
        <div className="flex items-center gap-e3">
          <Anillo porcentaje={porcentaje} tamano={64} completado={porcentaje === 100} />
          <div>
            <h3 className="t-subtitulo text-tinta">Quiz terminado</h3>
            <p className="t-cuerpo mt-1 text-tinta-sec">
              {aciertos.length} de {total} a la primera.
            </p>
          </div>
        </div>
        <Boton
          variante="secundario"
          className="mt-e3"
          onClick={() => {
            // Otras preguntas del banco, no las mismas otra vez.
            setRonda(tomarVariadas(quiz.preguntas, CUANTAS, Date.now()));
            setIndice(0);
            setElegida(null);
            setAciertos([]);
          }}
        >
          Otras preguntas del tema
        </Boton>
      </div>
    );
  }

  const acerto = elegida !== null && elegida === pregunta.correcta;

  function elegir(i: number) {
    if (elegida !== null) return;
    setElegida(i);
    if (i === pregunta!.correcta && !aciertos.includes(pregunta!.id)) {
      setAciertos((a) => [...a, pregunta!.id]);
    }
  }

  return (
    <div className="max-w-[56ch]">
      <div className="flex items-baseline justify-between gap-e2 border-t-2 border-indigo pt-e2">
        <p className="t-cifra-min text-tinta-sec">
          pregunta {indice + 1} de {total}, de un banco de {quiz.preguntas.length}
        </p>
        <p className="t-cifra-min text-tinta-sec">{aciertos.length} acertadas</p>
      </div>

      <h3 className="t-subtitulo mt-e3 text-tinta">{pregunta.enunciado}</h3>

      <ul className="mt-e3 flex flex-col gap-e1">
        {pregunta.opciones.map((o, i) => {
          const esLaBuena = i === pregunta.correcta;
          const elegidaYMala = elegida === i && !esLaBuena;
          const mostrar = elegida !== null;

          const borde = !mostrar
            ? "border-borde hover:border-indigo"
            : esLaBuena
              ? "border-ok border-2"
              : elegidaYMala
                ? "border-warn border-2"
                : "border-borde opacity-60";

          return (
            <li key={o}>
              <button
                type="button"
                onClick={() => elegir(i)}
                disabled={mostrar}
                className={`flex w-full items-center gap-e2 rounded-m border px-e2 py-2 text-left transition-colors ${borde} ${mostrar ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="t-cifra-min w-4 shrink-0 text-tinta-sec" aria-hidden="true">
                  {mostrar ? (esLaBuena ? "✓" : elegidaYMala ? "✕" : "·") : "·"}
                </span>
                <span className="t-apoyo text-tinta">{o}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {elegida !== null ? (
        <div className="mt-e3" aria-live="polite">
          <p className={`t-apoyo font-bold ${acerto ? "text-ok" : "text-warn"}`}>
            {acerto ? "Correcto" : "No era esa"}
          </p>
          <p className="t-cuerpo mt-1 border-l-2 border-turquesa pl-e2 text-tinta">{pregunta.porque}</p>

          <Boton
            variante="primario"
            className="mt-e3"
            onClick={() => {
              setIndice((i) => i + 1);
              setElegida(null);
            }}
          >
            {indice + 1 === total ? "Ver el resultado" : "Siguiente pregunta"}
          </Boton>
        </div>
      ) : null}
    </div>
  );
}
