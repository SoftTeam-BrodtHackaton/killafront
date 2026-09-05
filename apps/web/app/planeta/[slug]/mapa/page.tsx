import { notFound } from "next/navigation";
import { killalab } from "@killalab/composicion";
import MapaMental from "@/componentes/mapa/MapaMental";

export function generateStaticParams() {
  return killalab.planetas().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const planeta = decodeURIComponent((await params).slug);
  return { title: `Mapa de ${planeta}` };
}

/**
 * El mapa muestra de un vistazo todo lo recorrido en un planeta. Es la pantalla
 * que mejor comunica que esto es una plataforma de aprendizaje y no un juego
 * suelto, y no cuesta producirla: sale de los mismos conceptos de las misiones.
 */
export default async function PaginaMapa({ params }: { params: Promise<{ slug: string }> }) {
  const planeta = decodeURIComponent((await params).slug);
  const nodos = killalab.mapaMental(planeta);
  if (nodos.length === 0) notFound();

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">mapa del planeta</p>
        <div>
          <h1 className="t-masthead text-tinta">{planeta}</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Los conceptos que has recorrido en este planeta y cómo se conectan entre sí. Sale de
            las mismas misiones, sin producir nada aparte.
          </p>
          <p className="t-cifra-min mt-e2 text-tinta-sec">
            {nodos.length} conceptos
          </p>

          <MapaMental nodos={nodos} />
        </div>
      </section>
    </div>
  );
}
