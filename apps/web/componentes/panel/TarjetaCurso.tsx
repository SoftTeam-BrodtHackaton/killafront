import Link from "next/link";
import type { AvanceDeCurso } from "@killalab/dominio";
import Anillo from "./Anillo";
import Marca from "@/componentes/ui/Marca";
import { plural } from "@/lib/formato";

/**
 * Un curso en el catálogo o en el panel.
 *
 * Es la única cosa de todo el sistema con marco además de un instrumento de dato,
 * y la razón es que aquí el marco no decora: delimita un objetivo con estado
 * propio. El filo izquierdo dice en qué punto está —verde terminado, turquesa
 * empezado, gris sin empezar— y nunca solo por color: el texto lo repite.
 */
export default function TarjetaCurso({ avance }: { avance: AvanceDeCurso }) {
  const { curso, porcentaje, completado, empezado, resueltos, total } = avance;

  const filo = completado ? "border-l-ok" : empezado ? "border-l-turquesa" : "border-l-borde";
  const estado = completado ? "terminado" : empezado ? "en curso" : "sin empezar";

  return (
    <Link
      href={`/cursos/${curso.slug}`}
      className={`group flex items-start gap-e3 rounded-m border border-borde border-l-2 p-e3 transition-colors hover:border-indigo ${filo}`}
    >
      <Anillo porcentaje={porcentaje} completado={completado} tamano={56} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-e2 gap-y-1">
          <h3 className="t-subtitulo text-tinta transition-colors group-hover:text-indigo">
            {curso.titulo}
          </h3>
          <span className="t-cifra-min text-tinta-sec">nivel {curso.nivel}</span>
        </div>

        <p className="t-cifra-min mt-1 text-tinta-sec">
          {plural(curso.lecciones, "lección", "lecciones")}, {curso.duracionMin} min
        </p>

        <div className="mt-e2 flex flex-wrap items-center gap-e1">
          <Marca tono={completado ? "accion" : "neutro"}>{estado}</Marca>
          <span className="t-cifra-min text-tinta-sec">
            {resueltos} de {total} retos
          </span>
        </div>
      </div>
    </Link>
  );
}
