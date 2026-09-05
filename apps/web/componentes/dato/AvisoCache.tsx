import type { Procedencia } from "@killalab/api";
import { haceCuanto, fechaCorta } from "@/lib/formato";

/** Cuando la API falla no se oculta el módulo ni se muestra un error: se muestra
 *  el último dato conocido, fechado y etiquetado. Nunca solo por color: lleva texto. */
export default function AvisoCache({ procedencia, capturado }: { procedencia: Procedencia; capturado: string }) {
  if (procedencia === "vivo") {
    return (
      <p className="font-dato text-[13px] text-ok">
        ● en vivo · leído {haceCuanto(capturado) ?? fechaCorta(capturado)}
      </p>
    );
  }
  const etiqueta = procedencia === "cache" ? "último dato conocido" : "dato de respaldo";
  return (
    <p className="font-dato text-[13px] text-warn">
      ⚠ {etiqueta} · {fechaCorta(capturado)} — la fuente no respondió ahora mismo
    </p>
  );
}
