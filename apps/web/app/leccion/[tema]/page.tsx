import Link from "next/link";
import { notFound } from "next/navigation";
import { killalab } from "@killalab/composicion";
import Estudiar from "@/componentes/misiones/Estudiar";
import EtiquetaFuente from "@/componentes/dato/EtiquetaFuente";

export function generateStaticParams() {
  return killalab
    .cursos()
    .flatMap((c) => c.temas)
    .filter((t) => t.offline)
    .map((t) => ({ tema: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tema: string }> }) {
  const t = killalab.mision((await params).tema);
  return t ? { title: t.titulo, description: t.resumen } : {};
}

/**
 * Una lección, con todas sus formas de estudiar.
 *
 * El servidor entrega los cuatro derivados y el selector decide cuál se ve. Se
 * cargan todos de golpe porque son JSON pequeños ya incluidos en el build:
 * cambiar de forma de estudiar tiene que ser instantáneo, no una espera.
 */
export default async function PaginaLeccion({ params }: { params: Promise<{ tema: string }> }) {
  const slug = (await params).tema;
  const tema = killalab.mision(slug);
  if (!tema) notFound();

  const curso = killalab.cursoDeTema(slug);
  const fuentes = [...new Set(tema.pasos.map((p) => p.fuente))];

  return (
    <div className="hoja">
      <article className="registro">
        <div className="margen">
          <span>{curso ? curso.titulo : tema.planeta}</span>
        </div>

        <div>
          <p className="t-anotacion">
            <Link
              href={curso ? `/cursos/${curso.slug}` : "/cursos"}
              className="border-b border-borde pb-0.5 hover:border-indigo"
            >
              {curso ? `Volver al curso de ${curso.titulo}` : "Volver a cursos"}
            </Link>
          </p>

          <h1 className="t-titulo medida mt-e2 text-tinta">{tema.titulo}</h1>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">{tema.resumen}</p>

          <Estudiar
            tema={tema}
            ficha={killalab.ficha(slug)}
            quiz={killalab.quiz(slug)}
            flashcards={killalab.flashcards(slug)}
            secuencia={killalab.secuencia(slug)}
            narracion={killalab.narracion(slug)}
          />

          <div className="mt-e6 flex flex-wrap gap-e3 border-t border-borde pt-e2">
            {fuentes.map((f) => (
              <EtiquetaFuente key={f} fuente={f} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
