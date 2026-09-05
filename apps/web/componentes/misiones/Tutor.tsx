"use client";
import { useRef, useState } from "react";
import type { Tema } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";

/**
 * Preguntarle al tutor sobre la lección.
 *
 * Es lo único de la aplicación que necesita un modelo funcionando ahora mismo, y
 * está construido para que eso no importe: si el tutor no responde, la pantalla lo
 * dice y la lección sigue entera con sus otras cuatro formas de estudiar.
 *
 * El tutor solo puede usar esta lección. No es una limitación técnica que haya que
 * disculpar: es lo que hace que sirva. Un tutor escolar que responde de memoria
 * sobre cualquier cosa acaba inventando, y aquí un dato inventado es exactamente lo
 * que el producto promete no hacer.
 */

interface Turno {
  de: "estudiante" | "tutor";
  texto: string;
}

/** Preguntas para arrancar: mirar un cuadro de texto vacío frena a cualquiera. */
function sugerencias(tema: Tema): string[] {
  const conceptos = tema.conceptos.slice(0, 2);
  return [
    `¿Me lo explicas más simple?`,
    ...conceptos.map((c) => `¿Qué es ${c.titulo.toLowerCase()}?`),
    `¿Para qué me sirve saber esto?`,
  ];
}

export default function Tutor({ tema }: { tema: Tema }) {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [pensando, setPensando] = useState(false);
  const [sinTutor, setSinTutor] = useState(false);
  const fin = useRef<HTMLDivElement>(null);

  async function preguntar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || pensando) return;

    setTurnos((t) => [...t, { de: "estudiante", texto: limpio }]);
    setPregunta("");
    setPensando(true);

    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: tema.slug, pregunta: limpio }),
      });
      const datos = (await r.json()) as
        | { estado: "ok"; respuesta: string }
        | { estado: "sin-tutor" }
        | { estado: "peticion-invalida" };

      if (datos.estado === "ok") {
        setTurnos((t) => [...t, { de: "tutor", texto: datos.respuesta }]);
      } else {
        setSinTutor(true);
      }
    } catch {
      setSinTutor(true);
    } finally {
      setPensando(false);
      requestAnimationFrame(() => fin.current?.scrollIntoView({ block: "nearest" }));
    }
  }

  return (
    <div className="max-w-[62ch]">
      <p className="t-apoyo text-tinta-sec">
        Pregunta lo que no entiendas de esta lección. El tutor solo puede usar lo que hay en ella:
        si preguntas otra cosa, te lo dirá en vez de inventar.
      </p>

      {sinTutor ? (
        <div className="mt-e3 border-l-2 border-ambar pl-e3">
          <p className="t-apoyo text-tinta">
            El tutor no está disponible ahora mismo. Es lo único de la lección que necesita un
            servicio funcionando; todo lo demás —el reto, las tarjetas, el quiz, la explicación
            escrita y la de escuchar— sigue funcionando sin él.
          </p>
        </div>
      ) : null}

      {turnos.length === 0 && !sinTutor ? (
        <div className="mt-e3 flex flex-wrap gap-e1">
          {sugerencias(tema).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => preguntar(s)}
              className="t-apoyo cursor-pointer rounded-m border border-borde px-e2 py-1.5 text-tinta-sec transition-colors hover:border-indigo hover:text-tinta"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-e4" aria-live="polite">
        {turnos.map((t, i) => (
          <div
            key={i}
            className={`border-l-2 py-e2 pl-e3 ${
              t.de === "estudiante" ? "border-borde" : "border-turquesa"
            }`}
          >
            <p className="t-anotacion">{t.de === "estudiante" ? "tú" : "tutor"}</p>
            <p className="t-cuerpo mt-0.5 text-tinta">{t.texto}</p>
          </div>
        ))}

        {pensando ? (
          <p className="t-cifra-min border-l-2 border-turquesa py-e2 pl-e3 text-tinta-sec">
            pensando…
          </p>
        ) : null}
        <div ref={fin} />
      </div>

      <form
        className="mt-e3 flex flex-wrap items-end gap-e2"
        onSubmit={(e) => {
          e.preventDefault();
          preguntar(pregunta);
        }}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="pregunta" className="t-anotacion block">
            Tu pregunta
          </label>
          <input
            id="pregunta"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="No entiendo por qué…"
            className="t-cuerpo mt-1 w-full border-b-2 border-borde bg-transparent px-1 py-1 text-tinta placeholder:text-tinta-sec focus:border-indigo focus:outline-none"
          />
        </div>
        <Boton type="submit" variante="primario" disabled={pregunta.trim() === "" || pensando}>
          Preguntar
        </Boton>
      </form>
    </div>
  );
}
