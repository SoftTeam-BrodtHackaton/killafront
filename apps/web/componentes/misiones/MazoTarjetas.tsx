"use client";
import { useState } from "react";
import type { Tarjeta } from "@killalab/dominio";

/**
 * El mazo. Una tarjeta a la vez, porque repasar es una cosa detrás de otra y no
 * una rejilla que se lee de un vistazo.
 *
 * La tarjeta no se voltea con una animación 3D: se abre en su sitio, con el
 * reverso debajo del anverso y una regla que los separa. Así el repaso funciona
 * igual con `prefers-reduced-motion` y en un proyector lento, y el contenido
 * queda en el DOM para un lector de pantalla.
 */
export default function MazoTarjetas({ tarjetas }: { tarjetas: Tarjeta[] }) {
  const [indice, setIndice] = useState(0);
  const [abierta, setAbierta] = useState(false);

  const tarjeta = tarjetas[indice];
  if (!tarjeta) return null;

  function mover(paso: number) {
    setIndice((i) => (i + paso + tarjetas.length) % tarjetas.length);
    setAbierta(false);
  }

  return (
    <div className="mt-e5 max-w-[52ch]">
      <p className="t-cifra-min text-tinta-sec">
        tarjeta {indice + 1} de {tarjetas.length}
      </p>

      <div className="mt-e2 border-t-2 border-indigo pt-e3">
        <h2 className="t-titulo text-tinta">{tarjeta.anverso}</h2>

        {abierta ? (
          <p className="t-cuerpo mt-e3 border-t border-borde pt-e3 text-tinta">{tarjeta.reverso}</p>
        ) : (
          <button
            type="button"
            onClick={() => setAbierta(true)}
            className="t-apoyo mt-e3 cursor-pointer border-b-2 border-ambar pb-0.5 font-bold text-tinta"
          >
            Mostrar la respuesta
          </button>
        )}
      </div>

      <div className="mt-e4 flex items-center justify-between border-t border-borde pt-e2">
        <button
          type="button"
          onClick={() => mover(-1)}
          className="t-apoyo cursor-pointer text-tinta-sec hover:text-tinta"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          className="t-apoyo cursor-pointer font-bold text-tinta hover:text-indigo"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
