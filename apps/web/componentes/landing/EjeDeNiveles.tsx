import Link from "next/link";
import { killalab } from "@killalab/composicion";
import Registro from "@/componentes/layout/Registro";
import Marca from "@/componentes/ui/Marca";

/**
 * Los cuatro niveles no son cuatro tarjetas iguales: son cuatro estaciones sobre
 * un eje. El contenido *es* una progresión —de 9 años a universidad— así que la
 * numeración está justificada y se dibuja como lo que es, una escala graduada.
 *
 * Cada estación cuelga de su marca en la regla índigo, con el rango de edad como
 * cifra y una frase que dice qué se *hace*, no qué se "aprende".
 */
export default function EjeDeNiveles() {
  const niveles = killalab.niveles();

  return (
    <Registro anotacion="de primaria a la API" id="niveles">
      <h2 className="t-titulo medida text-tinta">Cuatro niveles, un solo camino</h2>
      <p className="t-cuerpo medida mt-e2 text-tinta-sec">
        Los dos primeros no tocan ninguna API: abren en un aula sin internet estable y siguen
        vivos aunque la NASA se caiga.
      </p>

      <ol className="mt-e5 grid gap-e4 border-t-2 border-indigo pt-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {niveles.map(({ nivel, temas }) => (
          <li
            key={nivel.id}
            className="relative pt-e3 lg:border-l lg:border-borde lg:pl-e3 lg:first:border-l-0 lg:first:pl-0"
          >
            {/* La marca de esta estación sobre la regla del eje */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-e1 w-0.5 bg-indigo lg:left-0"
            />

            <div className="flex items-baseline gap-e1">
              <span className="t-cifra text-turquesa-texto">{nivel.id}</span>
              <h3 className="t-subtitulo text-indigo">{nivel.nombre}</h3>
            </div>

            <p className="t-cifra-min mt-0.5 text-tinta-sec">{nivel.edades}</p>
            <p className="t-apoyo mt-e2 text-tinta">{nivel.hace}</p>

            <div className="mt-e2 flex flex-wrap items-center gap-e1">
              <Marca tono={nivel.requiereApi ? "dato" : "neutro"}>
                {nivel.requiereApi ? "usa datos de la NASA" : "funciona sin conexión"}
              </Marca>
              {temas.length > 0 ? (
                <span className="t-cifra-min text-tinta-sec">
                  {temas.length} {temas.length === 1 ? "misión" : "misiones"}
                </span>
              ) : (
                <span className="t-apoyo text-tinta-sec">en producción</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-e4">
        <Link
          href="/misiones"
          className="t-apoyo border-b border-borde pb-0.5 font-bold text-tinta transition-colors hover:border-indigo"
        >
          Ver todas las misiones
        </Link>
      </p>
    </Registro>
  );
}
