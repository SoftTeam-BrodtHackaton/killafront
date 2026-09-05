"use client";
import { useEffect, useState } from "react";
import { CLAVE_TEMA, type Tema } from "@killalab/tokens";

/**
 * Modo claro por defecto: muchos colegios proyectan en aulas iluminadas y el
 * fondo oscuro se lava. En la primera visita se respeta `prefers-color-scheme`;
 * después manda lo que el usuario eligió.
 *
 * El botón lleva `aria-label` con la acción, no con el estado: lo que se anuncia
 * es lo que va a pasar al pulsarlo.
 */
export default function ConmutadorTema() {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    setTema((document.documentElement.getAttribute("data-tema") as Tema) ?? "claro");
  }, []);

  function alternar() {
    const siguiente: Tema = tema === "claro" ? "oscuro" : "claro";
    document.documentElement.setAttribute("data-tema", siguiente);
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {
      // Navegación privada o almacenamiento bloqueado: el tema vale para esta sesión.
    }
    setTema(siguiente);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={`Cambiar a modo ${tema === "claro" ? "oscuro" : "claro"}`}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-m border border-borde text-tinta-sec transition-colors hover:border-indigo hover:text-tinta"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {tema === "claro" ? (
          <path
            d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ) : (
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="3.2" />
            <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1" />
          </g>
        )}
      </svg>
    </button>
  );
}
