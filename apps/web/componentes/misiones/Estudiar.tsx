"use client";
import { useState } from "react";
import type { Ficha, Flashcards as Mazo, Quiz as QuizDatos, Secuencia, Tema } from "@killalab/dominio";
import Mision from "./Mision";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";
import FichaRepaso from "./FichaRepaso";
import Podcast from "./Podcast";

/**
 * Todas las formas de estudiar una misma lección, en un selector.
 *
 * La idea que gobierna esta pantalla: **el contenido es uno y las formas de
 * entrarle son varias**. La misma lección se puede resolver como reto, escribir de
 * memoria, reconocer entre opciones, leer en una página o escuchar. No es
 * repetición: cada forma pide algo distinto, y quien no entiende leyendo a veces
 * entiende escuchando.
 *
 * Solo aparecen las formas que existen para ese tema. Una pestaña vacía sería peor
 * que no tenerla: promete algo y no lo cumple.
 */

type Modo = "reto" | "escribir" | "elegir" | "leer" | "escuchar";

export default function Estudiar({
  tema,
  ficha,
  quiz,
  flashcards,
  secuencia,
}: {
  tema: Tema;
  ficha: Ficha | null;
  quiz: QuizDatos | null;
  flashcards: Mazo | null;
  secuencia: Secuencia | null;
}) {
  const modos: Array<{ id: Modo; nombre: string; que: string; hay: boolean }> = [
    { id: "reto", nombre: "Resolver", que: "El reto paso a paso", hay: tema.pasos.length > 0 },
    { id: "escribir", nombre: "Escribir", que: "Responde de memoria y se corrige", hay: flashcards !== null },
    { id: "elegir", nombre: "Elegir", que: "Opción múltiple con el porqué", hay: quiz !== null },
    { id: "leer", nombre: "Leer", que: "Todo en una página", hay: ficha !== null },
    { id: "escuchar", nombre: "Escuchar", que: "Como un podcast", hay: ficha !== null },
  ];

  const disponibles = modos.filter((m) => m.hay);
  const [modo, setModo] = useState<Modo>(disponibles[0]?.id ?? "reto");

  return (
    <div className="mt-e5">
      {/* El selector. Es lo primero después del título: elegir cómo estudiar es
          la decisión que abre la pantalla, no un ajuste escondido. */}
      <div role="tablist" aria-label="Cómo estudiar esta lección" className="flex flex-wrap gap-e1 border-b-2 border-indigo pb-e2">
        {disponibles.map((m) => {
          const activo = m.id === modo;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => setModo(m.id)}
              className={`cursor-pointer rounded-m border px-e2 py-1.5 text-left transition-colors ${
                activo
                  ? "border-indigo border-2 bg-elevado"
                  : "border-borde hover:border-indigo"
              }`}
            >
              <span className={`t-apoyo block font-bold ${activo ? "text-indigo" : "text-tinta"}`}>
                {m.nombre}
              </span>
              <span className="t-anotacion block">{m.que}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-e4" role="tabpanel">
        {modo === "reto" ? <Mision tema={tema} /> : null}
        {modo === "escribir" && flashcards ? <Flashcards mazo={flashcards} /> : null}
        {modo === "elegir" && quiz ? <Quiz quiz={quiz} /> : null}
        {modo === "leer" && ficha ? <FichaRepaso ficha={ficha} secuencia={secuencia} /> : null}
        {modo === "escuchar" && ficha ? <Podcast ficha={ficha} tema={tema} /> : null}
      </div>
    </div>
  );
}
