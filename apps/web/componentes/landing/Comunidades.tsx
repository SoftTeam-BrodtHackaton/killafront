import Registro from "@/componentes/layout/Registro";
import { BotonEnlace } from "@/componentes/ui/Boton";

/**
 * Dos bloques con ancho distinto a propósito: dentro de la plataforma (una lista
 * corta) y fuera de ella (el directorio de grupos reales, que según el propio
 * planteamiento del producto es la función de más valor social y la más barata).
 */
const dentro = [
  { nombre: "Tripulaciones", que: "Equipos de tres a cinco estudiantes que resuelven misiones juntos." },
  { nombre: "Estaciones", que: "La comunidad de tu colegio, con tabla de posiciones entre aulas." },
  { nombre: "Bitácora", que: "Publicas tus hallazgos y comentas los de otros." },
];

export default function Comunidades() {
  return (
    <Registro anotacion="no se estudia solo">
      <div className="grid gap-e5 lg:grid-cols-12 lg:gap-e4">
        <div className="lg:col-span-5">
          <h2 className="t-titulo text-tinta">Dentro de KillaLab</h2>
          <dl className="mt-e3">
            {dentro.map((d) => (
              <div key={d.nombre} className="border-t border-borde py-e2">
                <dt className="t-subtitulo text-indigo">{d.nombre}</dt>
                <dd className="t-apoyo mt-0.5 text-tinta-sec">{d.que}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7">
          <h2 className="t-titulo text-tinta">Y grupos a los que puedes acercarte</h2>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">
            Capítulos y ramas estudiantiles, clubes de astronomía, comunidades de desarrolladores.
            Cada entrada con su institución, su área y sus próximos eventos abiertos.
          </p>
          <p className="t-cuerpo medida mt-e2 text-tinta">
            Si tienes dieciséis años y vives en Carabayllo, probablemente nadie te dijo que estos
            grupos existen. Esa es toda la función de esta sección.
          </p>
          <div className="mt-e3">
            <BotonEnlace href="/comunidades" variante="secundario">
              Ver el directorio
            </BotonEnlace>
          </div>
        </div>
      </div>
    </Registro>
  );
}
