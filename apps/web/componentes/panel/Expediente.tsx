"use client";
import Link from "next/link";
import type { Curso } from "@killalab/dominio";
import { avanceDeCurso, codigoDeCertificado } from "@killalab/dominio";
import { usarProgreso } from "@/componentes/progreso/almacen";
import Anillo from "./Anillo";

export default function Expediente({ cursos }: { cursos: Curso[] }) {
  const { resueltos, nombre, cargado } = usarProgreso();

  if (!cargado || resueltos === null) {
    return (
      <p className="t-cifra-min mt-e3 text-tinta-sec" aria-live="polite">
        cargando tu avance…
      </p>
    );
  }

  const avances = cursos.map((c) => avanceDeCurso(c, resueltos));
  const terminados = avances.filter((a) => a.completado);
  const hechos = avances.reduce((n, a) => n + a.resueltos, 0);
  const total = avances.reduce((n, a) => n + a.total, 0);
  const global = total === 0 ? 0 : Math.round((hechos / total) * 100);
  const minutos = terminados.reduce((n, a) => n + a.curso.duracionMin, 0);

  return (
    <>
      <div className="mt-e4 flex flex-wrap items-center gap-e4">
        <Anillo porcentaje={global} tamano={88} completado={global === 100} />
        <dl className="grid gap-e3 sm:grid-cols-3">
          <div>
            <dt className="t-anotacion">Retos resueltos</dt>
            <dd className="t-cifra mt-0.5 text-tinta">
              {hechos} de {total}
            </dd>
          </div>
          <div>
            <dt className="t-anotacion">Cursos terminados</dt>
            <dd className="t-cifra mt-0.5 text-tinta">
              {terminados.length} de {avances.length}
            </dd>
          </div>
          <div>
            <dt className="t-anotacion">Tiempo de estudio</dt>
            <dd className="t-cifra mt-0.5 text-tinta">{minutos} min</dd>
          </div>
        </dl>
      </div>

      <h2 className="t-subtitulo mt-e6 text-tinta">Certificados</h2>

      {terminados.length === 0 ? (
        <p className="t-cuerpo medida mt-e2 text-tinta-sec">
          Todavía ninguno. Se emite uno al terminar todos los retos de un curso.
        </p>
      ) : (
        <ul className="mt-e3">
          {terminados.map((a) => {
            const codigo = nombre
              ? codigoDeCertificado(a.curso.slug, nombre, new Date().toISOString())
              : null;
            return (
              <li key={a.curso.slug} className="border-t border-borde py-e3">
                <div className="flex flex-wrap items-baseline justify-between gap-e2">
                  <Link
                    href={`/cursos/${a.curso.slug}`}
                    className="t-subtitulo text-tinta hover:text-indigo"
                  >
                    {a.curso.titulo}
                  </Link>
                  <span className="t-cifra-min text-ok">
                    <span aria-hidden="true">✓ </span>
                    nivel {a.curso.nivel} completo
                  </span>
                </div>
                <p className="t-cifra-min mt-1 text-tinta-sec">
                  {codigo ? `código ${codigo}` : "pon tu nombre en el curso para emitirlo"}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-e6 max-w-[62ch] border-l-2 border-ambar pl-e3">
        <p className="t-apoyo text-tinta">
          Tu avance se guarda <strong>en este navegador</strong>. No hay cuentas todavía, así que
          no viaja a otro dispositivo y se pierde si borras los datos del sitio.
        </p>
        <p className="t-apoyo mt-e2 text-tinta-sec">
          Cuando esté el servicio de cuentas, lo que llevas se sincroniza y los certificados pasan
          a llevar firma del emisor.
        </p>
      </div>
    </>
  );
}
