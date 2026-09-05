import { notFound } from "next/navigation";
import { TEMAS, temaPorSlug } from "@killalab/content";

export function generateStaticParams() {
  return TEMAS.filter((t) => t.offline).map((t) => ({ nivel: String(t.nivel), tema: t.slug }));
}

export default async function Mision({ params }: { params: Promise<{ tema: string }> }) {
  const { tema: slug } = await params;
  const tema = temaPorSlug(slug);
  if (!tema) notFound();

  return (
    <article className="seccion">
      <div className="contenedor">
        <p className="font-dato text-[13px] text-tinta-sec">
          NIVEL {tema.nivel} · {tema.planeta.toUpperCase()}
        </p>
        <h1 className="t-h1 medida mt-2 text-tinta">{tema.titulo}</h1>
        <p className="medida mt-4 text-tinta-sec">{tema.resumen}</p>

        {/* TODO: componentes/misiones/PasoMision.tsx — interacción y evaluación. */}
        <ol className="mt-10 space-y-6">
          {tema.pasos.map((p, i) => (
            <li key={p.id} className="rounded-l border border-borde p-6">
              <p className="font-dato text-[13px] text-tinta-sec">PASO {i + 1}</p>
              <p className="mt-2 text-tinta">{p.enunciado}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
