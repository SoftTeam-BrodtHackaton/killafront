"use client";
import Link from "next/link";
import type { Curso } from "@killalab/dominio";
import { avanceDeCurso } from "@killalab/dominio";
import { usarProgreso } from "@/componentes/progreso/almacen";
import TarjetaCurso from "./TarjetaCurso";
import Anillo from "./Anillo";
import { plural } from "@/lib/formato";

/**
 * El panel: la primera pantalla al entrar.
 *
 * Responde a una sola pregunta —¿qué estudio ahora?— y la responde antes que
 * cualquier otra cosa. Por eso lo primero que se ve es el botón de continuar la
 * lección a medias, no una rejilla de todo el catálogo.
 *
 * Mientras el progreso se lee del navegador se muestra un esqueleto, no un 0 %:
 * pintar cero y saltar a 60 % un instante después se lee como si se hubiera
 * perdido el avance, que es justo el susto que no queremos dar.
 */
export default function Panel({ cursos }: { cursos: Curso[] }) {
  const { resueltos, cargado } = usarProgreso();

  if (!cargado || resueltos === null) {
    return (
      <p className="t-cifra-min text-tinta-sec" aria-live="polite">
        cargando tu avance…
      </p>
    );
  }

  const avances = cursos.map((c) => avanceDeCurso(c, resueltos));
  const enCurso = avances.filter((a) => a.empezado && !a.completado);
  const terminados = avances.filter((a) => a.completado);
  const sinEmpezar = avances.filter((a) => !a.empezado);

  const retosHechos = avances.reduce((n, a) => n + a.resueltos, 0);
  const retosTotal = avances.reduce((n, a) => n + a.total, 0);
  const global = retosTotal === 0 ? 0 : Math.round((retosHechos / retosTotal) * 100);

  const continuar = enCurso[0] ?? sinEmpezar[0] ?? null;
  const empezaste = retosHechos > 0;

  return (
    <>
      {/* Lo primero: dónde retomar. */}
      <div className="grid items-start gap-e4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="t-titulo text-tinta">
            {empezaste ? "Sigue donde lo dejaste" : "Elige por dónde empezar"}
          </h1>

          {continuar?.siguiente ? (
            <>
              <p className="t-cuerpo medida mt-e2 text-tinta-sec">
                {empezaste
                  ? `Te quedaste en ${continuar.curso.titulo}, en la lección "${continuar.siguiente.titulo}".`
                  : `El curso de ${continuar.curso.titulo} es un buen punto de partida: ${plural(continuar.curso.lecciones, "lección", "lecciones")} y ${continuar.curso.duracionMin} minutos.`}
              </p>

              <div className="mt-e4 flex flex-wrap items-center gap-e3">
                <Link
                  href={`/leccion/${continuar.siguiente.slug}`}
                  className="inline-flex items-center justify-center rounded-m border border-ambar bg-ambar px-e3 py-2.5 font-cuerpo text-[0.9375rem] font-bold text-[#14142B] transition-colors hover:bg-ambar-suave"
                >
                  {empezaste ? "Continuar la lección" : "Empezar la primera lección"}
                </Link>
                <Link
                  href="/cursos"
                  className="t-apoyo border-b border-borde pb-1 font-bold text-tinta transition-colors hover:border-indigo"
                >
                  Ver todos los cursos
                </Link>
              </div>
            </>
          ) : (
            <p className="t-cuerpo medida mt-e2 text-tinta-sec">
              Terminaste todos los cursos publicados. Estamos produciendo los del nivel 1.
            </p>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="flex items-center gap-e3 border-t-2 border-indigo pt-e3">
            <Anillo porcentaje={global} tamano={72} completado={global === 100} />
            <div>
              <p className="t-anotacion">Tu avance total</p>
              <p className="t-cifra mt-0.5 text-tinta">
                {retosHechos} de {retosTotal} retos
              </p>
              <p className="t-cifra-min mt-0.5 text-tinta-sec">
                {terminados.length} de {avances.length} cursos terminados
              </p>
            </div>
          </div>
        </div>
      </div>

      {enCurso.length > 0 ? (
        <section className="mt-e6">
          <h2 className="t-subtitulo text-tinta">En curso</h2>
          <div className="mt-e3 grid gap-e2 md:grid-cols-2">
            {enCurso.map((a) => (
              <TarjetaCurso key={a.curso.slug} avance={a} />
            ))}
          </div>
        </section>
      ) : null}

      {sinEmpezar.length > 0 ? (
        <section className="mt-e5">
          <h2 className="t-subtitulo text-tinta">
            {empezaste ? "Para después" : "Cursos disponibles"}
          </h2>
          <div className="mt-e3 grid gap-e2 md:grid-cols-2">
            {sinEmpezar.map((a) => (
              <TarjetaCurso key={a.curso.slug} avance={a} />
            ))}
          </div>
        </section>
      ) : null}

      {terminados.length > 0 ? (
        <section className="mt-e5">
          <h2 className="t-subtitulo text-tinta">Terminados</h2>
          <p className="t-apoyo mt-1 text-tinta-sec">
            Cada uno tiene su certificado con código de verificación público.
          </p>
          <div className="mt-e3 grid gap-e2 md:grid-cols-2">
            {terminados.map((a) => (
              <TarjetaCurso key={a.curso.slug} avance={a} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
