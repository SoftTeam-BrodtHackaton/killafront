"use client";
import Link from "next/link";
import type { Curso } from "@killalab/dominio";
import { avanceDeCurso } from "@killalab/dominio";
import { usarProgreso } from "@/componentes/progreso/almacen";
import Anillo from "./Anillo";
import Certificado from "@/componentes/certificado/Certificado";
import { plural } from "@/lib/formato";

/**
 * El temario de un curso: sus lecciones, en orden, con el estado de cada una.
 *
 * El botón grande lleva a la lección que toca, no a la primera: volver a un curso
 * a medias y tener que buscar dónde te quedaste es la fricción que hace que no se
 * vuelva.
 *
 * Al 100 % aparece el certificado. No antes: un certificado que se puede pedir sin
 * terminar no certifica nada.
 */
export default function DetalleCurso({ curso }: { curso: Curso }) {
  const { resueltos, cargado } = usarProgreso();

  if (!cargado || resueltos === null) {
    return (
      <p className="t-cifra-min text-tinta-sec" aria-live="polite">
        cargando tu avance…
      </p>
    );
  }

  const a = avanceDeCurso(curso, resueltos);

  return (
    <>
      <div className="mt-e4 flex flex-wrap items-center gap-e4">
        <Anillo porcentaje={a.porcentaje} tamano={80} completado={a.completado} />
        <div>
          <p className="t-cifra text-tinta">
            {a.resueltos} de {a.total} retos resueltos
          </p>
          <p className="t-cifra-min mt-0.5 text-tinta-sec">
            {plural(curso.lecciones, "lección", "lecciones")}, {curso.duracionMin} min en total
          </p>
        </div>

        {a.siguiente ? (
          <Link
            href={`/leccion/${a.siguiente.slug}`}
            className="inline-flex items-center justify-center rounded-m border border-ambar bg-ambar px-e3 py-2.5 font-cuerpo text-[0.9375rem] font-bold text-[#14142B] transition-colors hover:bg-ambar-suave"
          >
            {a.empezado ? "Continuar el curso" : "Empezar el curso"}
          </Link>
        ) : null}
      </div>

      <ol className="mt-e5">
        {a.temas.map((t, i) => (
          <li key={t.tema.slug} className="border-t border-borde">
            <Link
              href={`/leccion/${t.tema.slug}`}
              className="group grid items-center gap-x-e3 gap-y-1 py-e3 sm:grid-cols-12"
            >
              <span className="t-cifra text-turquesa-texto sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="sm:col-span-7">
                <h3 className="t-subtitulo text-tinta transition-colors group-hover:text-indigo">
                  {t.tema.titulo}
                </h3>
                <p className="t-apoyo mt-0.5 text-tinta-sec">{t.tema.resumen}</p>
              </div>

              <span className="t-cifra-min text-tinta-sec sm:col-span-2">
                {t.tema.duracionMin} min
              </span>

              <span
                className={`t-cifra-min sm:col-span-2 sm:text-right ${
                  t.completado ? "text-ok" : t.empezado ? "text-turquesa-texto" : "text-tinta-sec"
                }`}
              >
                <span aria-hidden="true">{t.completado ? "✓ " : t.empezado ? "◐ " : "○ "}</span>
                {t.completado ? "hecha" : t.empezado ? `${t.porcentaje}%` : "pendiente"}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-e6">
        <Certificado curso={curso} completado={a.completado} porcentaje={a.porcentaje} />
      </div>
    </>
  );
}
