import Link from "next/link";
import { notFound } from "next/navigation";
import { killalab } from "@killalab/composicion";
import { nivelPorId } from "@killalab/dominio";
import DetalleCurso from "@/componentes/panel/DetalleCurso";
import Marca from "@/componentes/ui/Marca";

export function generateStaticParams() {
  return killalab.cursos().map((c) => ({ curso: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ curso: string }> }) {
  const c = killalab.curso((await params).curso);
  return c ? { title: `Curso de ${c.titulo}` } : {};
}

export default async function PaginaCurso({ params }: { params: Promise<{ curso: string }> }) {
  const curso = killalab.curso((await params).curso);
  if (!curso) notFound();

  const nivel = nivelPorId(curso.nivel);

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">{nivel ? nivel.nombre : `nivel ${curso.nivel}`}</p>
        <div>
          <p className="t-anotacion">
            <Link href="/cursos" className="border-b border-borde pb-0.5 hover:border-indigo">
              Volver a cursos
            </Link>
          </p>

          <h1 className="t-masthead mt-e2 text-tinta">{curso.titulo}</h1>

          <div className="mt-e3 flex flex-wrap items-center gap-e2">
            <Marca tono={curso.requiereApi ? "dato" : "neutro"}>
              {curso.requiereApi ? "usa datos de la NASA" : "funciona sin conexión"}
            </Marca>
            <span className="t-cifra-min text-tinta-sec">
              {curso.conceptos} conceptos, {curso.pasos} retos
            </span>
          </div>

          <DetalleCurso curso={curso} />
        </div>
      </section>
    </div>
  );
}
