import type { Procedencia } from "@killalab/dominio";
import { fechaCorta, haceCuanto } from "@/lib/formato";

/**
 * Cuando la fuente falla no se oculta el módulo ni se muestra un error: se enseña
 * el último dato conocido, fechado y etiquetado.
 *
 * Ningún estado se comunica solo por color. Cada caso lleva una marca de forma
 * distinta —disco, anillo, rombo— además del texto, para que se distinga en
 * blanco y negro, en un proyector lavado y con daltonismo.
 */

const MARCAS: Record<Procedencia, string> = {
  vivo: "●",
  cache: "◐",
  respaldo: "○",
  simulado: "◆",
};

export default function AvisoProcedencia({
  procedencia,
  capturado,
}: {
  procedencia: Procedencia;
  capturado: string;
}) {
  const cuando = haceCuanto(capturado) ?? fechaCorta(capturado);

  const texto: Record<Procedencia, string> = {
    vivo: `en vivo, leído ${cuando}`,
    cache: `último dato conocido de ${cuando}: la fuente no respondió ahora mismo`,
    respaldo: `dato de respaldo del ${fechaCorta(capturado)}: la fuente no respondió`,
    simulado: "datos simulados de la fake API de desarrollo, no es un evento real",
  };

  const color = procedencia === "vivo" ? "text-ok" : "text-warn";

  return (
    <p className={`t-cifra-min flex items-baseline gap-1.5 ${color}`}>
      <span aria-hidden="true">{MARCAS[procedencia]}</span>
      <span>{texto[procedencia]}</span>
    </p>
  );
}
