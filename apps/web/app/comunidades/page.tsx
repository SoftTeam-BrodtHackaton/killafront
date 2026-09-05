import { estadoDeLaPlataforma, killalab } from "@killalab/composicion";
import Registro from "@/componentes/layout/Registro";
import { fechaCorta } from "@/lib/formato";

export const metadata = { title: "Comunidades" };

/**
 * El directorio de grupos estudiantiles reales.
 *
 * Mientras el backend del equipo no esté en pie, esta lista viene vacía y la
 * pantalla lo dice con todas sus letras. Sembrarla con nombres y contactos
 * inventados para que "se vea llena" sería lo contrario exacto de lo que promete
 * el producto: cada entrada tiene que ser un grupo real con contacto verificado.
 */
export default async function PaginaComunidades() {
  const grupos = await killalab.directorio.grupos();
  const { directorioPoblado } = estadoDeLaPlataforma();

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">directorio</p>
        <div>
          <h1 className="t-masthead text-tinta">Comunidades</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Capítulos y ramas estudiantiles, clubes de astronomía y comunidades de desarrolladores
            del Perú. Con su institución, su área, su contacto y sus próximos eventos abiertos.
          </p>
        </div>
      </section>

      <Registro anotacion={directorioPoblado ? `${grupos.length} grupos` : "en formación"}>
        {grupos.length === 0 ? (
          <div className="max-w-[52ch] border-l-2 border-ambar pl-e3">
            <h2 className="t-titulo text-tinta">Todavía no hay ningún grupo publicado</h2>
            <p className="t-cuerpo mt-e2 text-tinta">
              Este directorio se llena con grupos reales y contacto verificado, uno por uno. No
              publicamos entradas de relleno: una lista con datos inventados no le sirve a nadie
              que quiera acercarse de verdad.
            </p>
            <p className="t-cuerpo mt-e2 text-tinta-sec">
              Si perteneces a un capítulo, una rama estudiantil o un club de astronomía y quieres
              aparecer aquí, escríbenos con el nombre del grupo, su institución y un contacto
              directo.
            </p>
          </div>
        ) : (
          <ul>
            {grupos.map((g) => (
              <li key={g.id} className="grid gap-x-e3 gap-y-1 border-t border-borde py-e3 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <h2 className="t-subtitulo text-indigo">{g.nombre}</h2>
                  <p className="t-apoyo text-tinta-sec">
                    {g.institucion}, {g.ciudad}
                  </p>
                </div>
                <p className="t-apoyo text-tinta sm:col-span-3">{g.area}</p>
                <div className="sm:col-span-4 sm:text-right">
                  <p className="t-cifra-min text-tinta-sec">{g.contacto}</p>
                  {g.proximoEvento ? (
                    <p className="t-apoyo mt-0.5 text-tinta">
                      {g.nombreEvento}, {fechaCorta(g.proximoEvento)}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Registro>

      <Registro anotacion="dentro de la plataforma">
        <h2 className="t-titulo medida text-tinta">Y los grupos que se arman aquí</h2>
        <dl className="mt-e3">
          <div className="border-t border-borde py-e2">
            <dt className="t-subtitulo text-indigo">Tripulaciones</dt>
            <dd className="t-apoyo mt-0.5 text-tinta-sec">
              Equipos de tres a cinco estudiantes que resuelven misiones juntos.
            </dd>
          </div>
          <div className="border-t border-borde py-e2">
            <dt className="t-subtitulo text-indigo">Estaciones</dt>
            <dd className="t-apoyo mt-0.5 text-tinta-sec">
              La comunidad de tu colegio, con tabla de posiciones entre aulas.
            </dd>
          </div>
          <div className="border-t border-borde py-e2">
            <dt className="t-subtitulo text-indigo">Bitácora</dt>
            <dd className="t-apoyo mt-0.5 text-tinta-sec">
              Publicas tus hallazgos y comentas los de otros.
            </dd>
          </div>
        </dl>
      </Registro>
    </div>
  );
}
