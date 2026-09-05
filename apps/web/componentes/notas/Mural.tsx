"use client";
import { useEffect, useState } from "react";
import { Boton } from "@/componentes/ui/Boton";

interface Nota {
  id: string;
  texto: string;
  creada: string;
}

const CLAVE = "killa-notas";

/**
 * El mural de hallazgos.
 *
 * Las notas no son post-its de colores girados unos grados: eso sería decoración,
 * y aquí el color se reserva para la función. Son entradas de bitácora fechadas,
 * cada una con su regla, en la misma retícula que todo lo demás.
 *
 * Se guardan en `localStorage` porque una nota escrita en clase no puede
 * depender de que el backend esté en pie. Cuando exista cuenta, se sincroniza.
 */
export default function Mural() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [borrador, setBorrador] = useState("");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setNotas(JSON.parse(guardado) as Nota[]);
    } catch {
      // Almacenamiento bloqueado o dato corrupto: se empieza con el mural vacío.
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(notas));
    } catch {
      // Sin almacenamiento las notas valen para esta sesión. No se pierde nada más.
    }
  }, [notas, cargado]);

  function anadir(e: React.FormEvent) {
    e.preventDefault();
    const texto = borrador.trim();
    if (!texto) return;
    setNotas((n) => [{ id: crypto.randomUUID(), texto, creada: new Date().toISOString() }, ...n]);
    setBorrador("");
  }

  return (
    <div className="mt-e5 max-w-[62ch]">
      <form onSubmit={anadir}>
        <label htmlFor="nota" className="t-anotacion block">
          Anota un hallazgo
        </label>
        <textarea
          id="nota"
          rows={3}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          placeholder="La Luna tarda 29.5 días en volver a la misma fase"
          className="t-cuerpo mt-1 w-full rounded-m border border-borde bg-transparent p-e2 text-tinta placeholder:text-tinta-sec focus:border-indigo focus:outline-none"
        />
        <Boton type="submit" variante="primario" className="mt-e2" disabled={borrador.trim() === ""}>
          Guardar la nota
        </Boton>
      </form>

      <div className="mt-e5" aria-live="polite">
        {cargado && notas.length === 0 ? (
          <p className="t-cuerpo border-t border-borde pt-e3 text-tinta-sec">
            Tu mural está vacío. La primera nota suele salir a mitad de una misión, cuando algo no
            cuadra.
          </p>
        ) : null}

        <ul>
          {notas.map((n) => (
            <li key={n.id} className="border-t border-borde py-e3">
              <p className="t-cuerpo text-tinta">{n.texto}</p>
              <div className="mt-e1 flex items-baseline justify-between gap-e2">
                <time dateTime={n.creada} className="t-cifra-min text-tinta-sec">
                  {new Date(n.creada).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}
                </time>
                <button
                  type="button"
                  onClick={() => setNotas((xs) => xs.filter((x) => x.id !== n.id))}
                  className="t-anotacion cursor-pointer underline decoration-dotted underline-offset-4 hover:text-error"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
