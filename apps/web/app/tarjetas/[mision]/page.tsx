import Link from "next/link";
import { notFound } from "next/navigation";
import { killalab } from "@killalab/composicion";
import MazoTarjetas from "@/componentes/misiones/MazoTarjetas";

export function generateStaticParams() {
  return killalab
    .niveles()
    .flatMap(({ temas }) => temas)
    .filter((t) => t.offline)
    .map((t) => ({ mision: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ mision: string }> }) {
  const mazo = killalab.mazo((await params).mision);
  return mazo ? { title: `Tarjetas de ${mazo.tema.titulo}` } : {};
}

/** El mazo no se produce a mano: sale de los conceptos del mismo tema. */
export default async function PaginaTarjetas({ params }: { params: Promise<{ mision: string }> }) {
  const mazo = killalab.mazo((await params).mision);
  if (!mazo) notFound();

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">mazo de repaso</p>
        <div>
          <p className="t-anotacion">
            <Link
              href={`/misiones/${mazo.tema.nivel}/${mazo.tema.slug}`}
              className="border-b border-borde pb-0.5 hover:border-indigo"
            >
              Volver a la misión
            </Link>
          </p>

          <h1 className="t-titulo medida mt-e2 text-tinta">{mazo.tema.titulo}</h1>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">
            Estas tarjetas se armaron solas con los conceptos de la misión. Nadie las escribió
            aparte.
          </p>

          <MazoTarjetas tarjetas={mazo.tarjetas} />
        </div>
      </section>
    </div>
  );
}
