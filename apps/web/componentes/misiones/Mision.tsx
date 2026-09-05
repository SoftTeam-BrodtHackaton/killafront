"use client";
import { useState } from "react";
import type { Tema } from "@killalab/dominio";
import PasoMision from "./PasoMision";
import Escala from "@/componentes/medida/Escala";

/**
 * La misión completa, con su avance dibujado sobre la misma escala que usa la
 * lectura solar en la portada. El recurso se repite en todo el sitio a propósito:
 * medir es el lenguaje visual del producto, y aquí lo que se mide es cuánto llevas.
 *
 * El progreso vive en el estado del componente. Cuando el backend del equipo esté
 * en pie, `onResuelto` llama a `killalab.progreso.registrarPaso` y nada más de
 * esta pantalla cambia: por eso el progreso es un puerto y no una llamada suelta.
 */
export default function Mision({ tema }: { tema: Tema }) {
  const [resueltos, setResueltos] = useState<string[]>([]);

  const total = tema.pasos.length;
  const hechos = resueltos.length;
  const completa = hechos === total;

  function marcar(pasoId: string) {
    setResueltos((r) => (r.includes(pasoId) ? r : [...r, pasoId]));
  }

  return (
    <>
      <div className="mt-e4 max-w-md">
        <Escala
          marcas={tema.pasos.map((_, i) => String(i + 1))}
          posicion={total ? hechos / total : null}
          etiquetaCursor={`${hechos} de ${total} pasos resueltos`}
        />
        <p className="t-cifra-min mt-e1 text-tinta-sec">
          {hechos} de {total} pasos resueltos
        </p>
      </div>

      <ol className="mt-e5">
        {tema.pasos.map((paso, i) => (
          <PasoMision key={paso.id} paso={paso} numero={i + 1} onResuelto={marcar} />
        ))}
      </ol>

      <div
        className={`mt-e5 border-t-2 pt-e3 ${completa ? "border-ok" : "border-borde"}`}
        aria-live="polite"
      >
        {completa ? (
          <>
            <h2 className="t-subtitulo text-tinta">Reto resuelto</h2>
            <p className="t-cuerpo medida mt-e1 text-tinta-sec">
              Ahora prueba a responder lo mismo de memoria, o repásalo en una página. Arriba
              tienes las otras formas de estudiar esta lección.
            </p>
          </>
        ) : (
          <p className="t-apoyo text-tinta-sec">
            Al resolver todos los pasos, la lección cuenta como hecha en tu curso.
          </p>
        )}
      </div>
    </>
  );
}
