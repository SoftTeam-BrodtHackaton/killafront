import { killalab } from "@killalab/composicion";
import { CLASES_SOLARES, letraDeClase, posicionEnEscala, significadoDeClase } from "@killalab/dominio";
import CifraCientifica from "./CifraCientifica";
import EtiquetaFuente from "./EtiquetaFuente";
import AvisoProcedencia from "./AvisoProcedencia";
import Escala from "@/componentes/medida/Escala";
import { fechaCorta, haceCuanto } from "@/lib/formato";

/**
 * El héroe de la portada: la última llamarada solar registrada, puesta sobre la
 * escala A→X con su cursor.
 *
 * La cifra sola ("M1.4") no le dice nada a un escolar. Puesta sobre la escala, y
 * con la letra traducida a lo que significa en la Tierra, sí. Ese salto —de cifra
 * a lectura de instrumento— es todo el producto en un módulo.
 *
 * Server Component: el dato llega ya pintado en el HTML, sin esqueleto ni salto.
 */
export default async function LecturaSolar() {
  const { valor, fuente, capturado, procedencia } = await killalab.ultimaLlamarada();

  const ocurrio = haceCuanto(valor.inicio) ?? fechaCorta(valor.inicio);
  const letra = letraDeClase(valor.claseSolar);
  const significado = significadoDeClase(valor.claseSolar);

  return (
    <section aria-labelledby="lectura-solar" className="instrumento">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="lectura-solar" className="t-subtitulo text-tinta">
          Última llamarada solar registrada
        </h2>
        <span className="t-cifra-min shrink-0 text-tinta-sec">{ocurrio}</span>
      </div>

      <p className="t-lectura mt-e3 text-turquesa-texto">
        {valor.claseSolar ?? "sin clasificar"}
      </p>

      {significado ? (
        <p className="t-apoyo medida-corta mt-e1 text-tinta">
          Clase {letra}: {significado}.
        </p>
      ) : (
        <p className="t-apoyo mt-e1 text-tinta-sec">
          La NASA registró el evento pero aún no le asignó clase.
        </p>
      )}

      <div className="mt-e4">
        <Escala
          marcas={[...CLASES_SOLARES]}
          posicion={posicionEnEscala(valor.claseSolar)}
          etiquetaCursor={
            letra
              ? `Clase ${valor.claseSolar} sobre la escala solar, que va de A a X`
              : "Escala solar de A a X, este evento no está clasificado"
          }
          anima
        />
      </div>

      <dl className="mt-e4 grid grid-cols-2 gap-e3 border-t border-borde pt-e3">
        <div>
          <dt className="t-anotacion">Región activa</dt>
          <dd className="mt-0.5">
            {valor.regionActiva ? (
              <CifraCientifica valor={valor.regionActiva} />
            ) : (
              <span className="t-apoyo text-tinta-sec">no reportada</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="t-anotacion">Pico del evento</dt>
          <dd className="mt-0.5">
            {valor.pico ? (
              <CifraCientifica valor={fechaCorta(valor.pico)} />
            ) : (
              <span className="t-apoyo text-tinta-sec">no reportado</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-e3 flex flex-wrap items-baseline justify-between gap-x-e3 gap-y-e1 border-t border-borde pt-e3">
        <EtiquetaFuente fuente={fuente} />
        <AvisoProcedencia procedencia={procedencia} capturado={capturado} />
      </div>
    </section>
  );
}
