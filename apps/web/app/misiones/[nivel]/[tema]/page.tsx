import Link from "next/link";
import { notFound } from "next/navigation";
import { killalab } from "@killalab/composicion";
import { nivelPorId } from "@killalab/dominio";
import Mision from "@/componentes/misiones/Mision";
import EtiquetaFuente from "@/componentes/dato/EtiquetaFuente";

/** Solo se prerenderizan las misiones offline: son las que tienen que abrir sin red. */
export function generateStaticParams() {
  return killalab
    .niveles()
    .flatMap(({ temas }) => temas)
    .filter((t) => t.offline)
    .map((t) => ({ nivel: String(t.nivel), tema: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tema: string }> }) {
  const tema = killalab.mision((await params).tema);
  return tema ? { title: tema.titulo, description: tema.resumen } : {};
}

export default async function PaginaMision({ params }: { params: Promise<{ tema: string }> }) {
  const tema = killalab.mision((await params).tema);
  if (!tema) notFound();

  const nivel = nivelPorId(tema.nivel);
  // Todas las fuentes que sostienen esta misión, sin repetir. Ninguna misión se
  // publica sin declarar de dónde salen sus cifras.
  const fuentes = [...new Set(tema.pasos.map((p) => p.fuente))];

  return (
    <div className="hoja">
      <article className="registro">
        <div className="margen">
          <span>
            {nivel ? `${nivel.nombre}, ` : ""}
            {tema.planeta}
          </span>
        </div>

        <div>
          <p className="t-anotacion">
            <Link href="/misiones" className="border-b border-borde pb-0.5 hover:border-indigo">
              Volver a misiones
            </Link>
          </p>

          <h1 className="t-titulo medida mt-e2 text-tinta">{tema.titulo}</h1>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">{tema.resumen}</p>

          <p className="t-cifra-min mt-e2 flex flex-wrap gap-x-e3 gap-y-1 text-tinta-sec">
            <span>{tema.duracionMin} min</span>
            <span>{tema.pasos.length} pasos</span>
            <span>{tema.offline ? "funciona sin conexión" : "usa datos de la NASA"}</span>
          </p>

          <Mision tema={tema} />

          <div className="mt-e5 flex flex-wrap gap-e3 border-t border-borde pt-e2">
            {fuentes.map((f) => (
              <EtiquetaFuente key={f} fuente={f} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
