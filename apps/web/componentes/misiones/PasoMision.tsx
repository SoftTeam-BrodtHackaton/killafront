"use client";
import { useId, useState } from "react";
import type { Paso } from "@killalab/dominio";
import { Boton } from "@/componentes/ui/Boton";
import { esCorrecta } from "./evaluar";

type Estado = "sin-responder" | "correcta" | "incorrecta";

/**
 * Un paso de la misión.
 *
 * Tres decisiones de diseño de interacción:
 *
 * 1. Fallar no cierra el paso. Se puede reintentar tantas veces como haga falta y
 *    la pista aparece justo después del primer error, que es cuando sirve. Esto es
 *    una plataforma escolar, no un examen.
 * 2. Ningún estado se comunica solo por color: cada resultado lleva su marca de
 *    forma y su texto, legibles en un proyector lavado y en blanco y negro.
 * 3. El resultado se anuncia por `aria-live`, así que quien navega con lector de
 *    pantalla se entera sin tener que ir a buscarlo.
 */
export default function PasoMision({
  paso,
  numero,
  onResuelto,
}: {
  paso: Paso;
  numero: number;
  onResuelto: (pasoId: string) => void;
}) {
  const id = useId();
  const [estado, setEstado] = useState<Estado>("sin-responder");
  const [intentos, setIntentos] = useState(0);
  const [eleccion, setEleccion] = useState("");
  const [secuencia, setSecuencia] = useState<string[]>([]);

  const opciones = paso.opciones ?? [];
  const respuesta: string | string[] = paso.tipo === "orden" ? secuencia : eleccion;
  const listaCompleta = paso.tipo === "orden" && secuencia.length === opciones.length;
  const puedeEnviar = estado !== "correcta" && (paso.tipo === "orden" ? listaCompleta : eleccion !== "");

  function comprobar() {
    const acierta = esCorrecta(paso, respuesta);
    setEstado(acierta ? "correcta" : "incorrecta");
    setIntentos((n) => n + 1);
    if (acierta) onResuelto(paso.id);
  }

  function alternarEnSecuencia(opcion: string) {
    if (estado === "correcta") return;
    setSecuencia((s) => (s.includes(opcion) ? s.filter((x) => x !== opcion) : [...s, opcion]));
    setEstado("sin-responder");
  }

  return (
    <li
      className={`grid gap-x-e3 gap-y-e2 border-t py-e4 sm:grid-cols-12 ${
        estado === "correcta" ? "border-ok" : "border-borde"
      }`}
    >
      <div className="flex items-baseline gap-e2 sm:col-span-2 sm:block">
        <span className="t-cifra text-turquesa-texto">{String(numero).padStart(2, "0")}</span>
        <span className="t-anotacion sm:mt-1 sm:block">
          {estado === "correcta" ? "resuelto" : "pendiente"}
        </span>
      </div>

      <div className="sm:col-span-10">
        <p className="t-cuerpo medida text-tinta">{paso.enunciado}</p>

        {paso.tipo === "opcion" ? (
          <fieldset className="mt-e3" disabled={estado === "correcta"}>
            <legend className="sr-only">{paso.enunciado}</legend>
            <div className="flex max-w-[46ch] flex-col gap-e1">
              {opciones.map((o) => (
                <label
                  key={o}
                  className="flex cursor-pointer items-center gap-e2 border border-borde px-e2 py-2 transition-colors hover:border-indigo has-[:checked]:border-indigo has-[:checked]:border-2"
                  style={{ borderRadius: "var(--radio-m)" }}
                >
                  <input
                    type="radio"
                    name={id}
                    value={o}
                    checked={eleccion === o}
                    onChange={(e) => {
                      setEleccion(e.target.value);
                      setEstado("sin-responder");
                    }}
                    className="accent-[var(--killa-indigo)]"
                  />
                  <span className="t-apoyo text-tinta">{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {paso.tipo === "numero" ? (
          <div className="mt-e3">
            <label htmlFor={id} className="t-anotacion block">
              Tu respuesta, en número
            </label>
            <input
              id={id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              disabled={estado === "correcta"}
              value={eleccion}
              onChange={(e) => {
                setEleccion(e.target.value);
                setEstado("sin-responder");
              }}
              className="t-cifra mt-1 w-40 border-b-2 border-borde bg-transparent px-1 py-1 text-tinta focus:border-indigo focus:outline-none"
            />
          </div>
        ) : null}

        {paso.tipo === "orden" ? (
          <div className="mt-e3">
            <p className="t-anotacion">Toca en el orden correcto. Vuelve a tocar para quitar.</p>
            <div className="mt-e2 flex max-w-[52ch] flex-wrap gap-e1">
              {opciones.map((o) => {
                const puesto = secuencia.indexOf(o);
                const elegido = puesto !== -1;
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => alternarEnSecuencia(o)}
                    aria-pressed={elegido}
                    className={`t-apoyo flex cursor-pointer items-center gap-e1 rounded-m border px-e2 py-2 transition-colors ${
                      elegido ? "border-indigo border-2 text-tinta" : "border-borde text-tinta-sec hover:border-indigo"
                    }`}
                  >
                    <span className="t-cifra-min text-turquesa-texto">
                      {elegido ? puesto + 1 : "·"}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {paso.tipo === "observacion" ? (
          <div className="mt-e3">
            <label htmlFor={id} className="t-anotacion block">
              Escribe lo que observaste
            </label>
            <textarea
              id={id}
              rows={3}
              disabled={estado === "correcta"}
              value={eleccion}
              onChange={(e) => setEleccion(e.target.value)}
              className="t-apoyo mt-1 w-full max-w-[46ch] rounded-m border border-borde bg-transparent p-e2 text-tinta focus:border-indigo focus:outline-none"
            />
          </div>
        ) : null}

        <div className="mt-e3 flex flex-wrap items-center gap-e3">
          {estado !== "correcta" ? (
            <Boton type="button" variante="secundario" onClick={comprobar} disabled={!puedeEnviar}>
              Comprobar
            </Boton>
          ) : null}

          <p aria-live="polite" className="t-apoyo">
            {estado === "correcta" ? (
              <span className="text-ok">
                <span aria-hidden="true">✓ </span>
                Correcto
              </span>
            ) : null}
            {estado === "incorrecta" ? (
              <span className="text-warn">
                <span aria-hidden="true">✕ </span>
                Todavía no. Puedes intentarlo de nuevo.
              </span>
            ) : null}
          </p>
        </div>

        {paso.pista && intentos > 0 && estado !== "correcta" ? (
          <p className="t-apoyo medida mt-e2 border-l-2 border-ambar pl-e2 text-tinta">
            Pista: {paso.pista}
          </p>
        ) : null}
      </div>
    </li>
  );
}
