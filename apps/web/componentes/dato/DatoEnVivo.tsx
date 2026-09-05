import { ultimaLlamarada } from "@killalab/api";
import CifraCientifica from "./CifraCientifica";
import EtiquetaFuente from "./EtiquetaFuente";
import AvisoCache from "./AvisoCache";
import { haceCuanto, fechaCorta } from "@/lib/formato";

/** El héroe de la landing. Server Component: el dato llega ya pintado en el HTML,
 *  sin salto ni esqueleto. En un segundo comunica la propuesta entera. */
export default async function DatoEnVivo() {
  const { valor, fuente, capturado, procedencia } = await ultimaLlamarada();
  const cuando = haceCuanto(valor.inicio) ?? fechaCorta(valor.inicio);

  return (
    <section
      aria-label="Último evento solar registrado"
      className="rounded-l border border-borde bg-elevado p-6 sm:p-8"
    >
      <p className="font-dato text-[13px] tracking-wide text-tinta-sec">DATO EN VIVO</p>
      <h2 className="font-display mt-2 text-2xl font-semibold text-tinta">
        Última llamarada solar registrada
      </h2>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-[15px] text-tinta-sec">Ocurrió</dt>
          <dd className="mt-1"><CifraCientifica valor={cuando} destacada /></dd>
        </div>
        <div>
          <dt className="text-[15px] text-tinta-sec">Clase</dt>
          <dd className="mt-1"><CifraCientifica valor={valor.claseSolar ?? "sin clasificar"} destacada /></dd>
        </div>
        <div>
          <dt className="text-[15px] text-tinta-sec">Región activa</dt>
          <dd className="mt-1">
            <CifraCientifica valor={valor.regionActiva ?? "no reportada"} destacada />
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-borde pt-4">
        <EtiquetaFuente fuente={fuente} />
        <AvisoCache procedencia={procedencia} capturado={capturado} />
      </div>
    </section>
  );
}
