import Link from "next/link";
import { killalab } from "@killalab/composicion";
import Registro from "@/componentes/layout/Registro";
import Marca from "@/componentes/ui/Marca";

/** Estático: los niveles 0 y 1 tienen que abrir sin red. */
export const dynamic = "force-static";

export const metadata = { title: "Misiones" };

export default function Misiones() {
  const niveles = killalab.niveles();
  const total = niveles.reduce((n, x) => n + x.temas.length, 0);

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">catálogo</p>
        <div>
          <h1 className="t-masthead text-tinta">Misiones</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Cada misión es un reto por pasos sobre un tema. Al terminarla se arma sola su mazo de
            tarjetas y sus nodos en el mapa del planeta.
          </p>
          <p className="t-cifra-min mt-e3 text-tinta-sec">
            {total} publicadas de un plan de cuatro niveles
          </p>
        </div>
      </section>

      {niveles.map(({ nivel, temas }) => (
        <Registro key={nivel.id} anotacion={`nivel ${nivel.id}, ${nivel.edades}`}>
          <div className="flex flex-wrap items-baseline gap-e2">
            <h2 className="t-titulo text-indigo">{nivel.nombre}</h2>
            <Marca tono={nivel.requiereApi ? "dato" : "neutro"}>
              {nivel.requiereApi ? "usa datos de la NASA" : "funciona sin conexión"}
            </Marca>
          </div>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">{nivel.hace}</p>

          {temas.length === 0 ? (
            <p className="t-apoyo mt-e3 border-t border-borde pt-e2 text-tinta-sec">
              Este nivel está en producción. Los niveles 0 y 1 se publican primero porque no
              dependen de ninguna API.
            </p>
          ) : (
            <ul className="mt-e3">
              {temas.map((t) => (
                <li key={t.slug} className="border-t border-borde">
                  <Link
                    href={`/misiones/${t.nivel}/${t.slug}`}
                    className="group grid items-baseline gap-x-e3 gap-y-1 py-e3 sm:grid-cols-12"
                  >
                    <h3 className="t-subtitulo text-tinta transition-colors group-hover:text-indigo sm:col-span-4">
                      {t.titulo}
                    </h3>
                    <p className="t-apoyo text-tinta-sec sm:col-span-6">{t.resumen}</p>
                    <p className="t-cifra-min text-tinta-sec sm:col-span-2 sm:text-right">
                      {t.duracionMin} min, {t.pasos.length} pasos
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Registro>
      ))}
    </div>
  );
}
