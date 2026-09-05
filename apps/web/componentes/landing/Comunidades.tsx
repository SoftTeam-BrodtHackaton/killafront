import { BotonEnlace } from "@/componentes/ui/Boton";

export default function Comunidades() {
  return (
    <section className="seccion border-t border-borde">
      <div className="contenedor grid gap-12 lg:grid-cols-2">
        {/* Bloque A — grupos dentro de la plataforma */}
        <div>
          <h2 className="t-h2 text-tinta">No se estudia solo</h2>
          <ul className="mt-6 space-y-4">
            <li>
              <h3 className="font-display text-lg font-semibold text-indigo">Tripulaciones</h3>
              <p className="text-[15px] text-tinta-sec">Equipos de 3 a 5 estudiantes que resuelven misiones juntos.</p>
            </li>
            <li>
              <h3 className="font-display text-lg font-semibold text-indigo">Estaciones</h3>
              <p className="text-[15px] text-tinta-sec">La comunidad de tu colegio, con tabla de posiciones entre aulas.</p>
            </li>
            <li>
              <h3 className="font-display text-lg font-semibold text-indigo">Bitácora</h3>
              <p className="text-[15px] text-tinta-sec">Publicas tus hallazgos y comentas los de otros.</p>
            </li>
          </ul>
        </div>

        {/* Bloque B — directorio de grupos reales */}
        <div>
          <h2 className="t-h2 text-tinta">Grupos a los que puedes acercarte</h2>
          <p className="medida mt-3 text-tinta-sec">
            Capítulos y ramas estudiantiles, clubes de astronomía, comunidades de desarrolladores.
            Con su institución, su área y sus próximos eventos abiertos.
          </p>
          <p className="medida mt-3 text-[15px] text-tinta-sec">
            Si tienes 16 años y vives en Carabayllo, probablemente nadie te dijo que estos grupos
            existen. Esa es toda la función de esta sección.
          </p>
          <div className="mt-6">
            <BotonEnlace href="/comunidades" variante="secundario">Ver el directorio</BotonEnlace>
          </div>
        </div>
      </div>
    </section>
  );
}
