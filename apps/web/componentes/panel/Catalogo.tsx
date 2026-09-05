"use client";
import type { Curso, Nivel } from "@killalab/dominio";
import { avanceDeCurso } from "@killalab/dominio";
import { usarProgreso } from "@/componentes/progreso/almacen";
import TarjetaCurso from "./TarjetaCurso";
import Registro from "@/componentes/layout/Registro";
import Marca from "@/componentes/ui/Marca";

export default function Catalogo({
  niveles,
}: {
  niveles: Array<{ nivel: Nivel; cursos: Curso[] }>;
}) {
  const { resueltos, cargado } = usarProgreso();
  const avance = resueltos ?? {};

  return (
    <>
      {niveles.map(({ nivel, cursos }) => (
        <Registro key={nivel.id} anotacion={`nivel ${nivel.id}, ${nivel.edades}`}>
          <div className="flex flex-wrap items-baseline gap-e2">
            <h2 className="t-titulo text-indigo">{nivel.nombre}</h2>
            <Marca tono={nivel.requiereApi ? "dato" : "neutro"}>
              {nivel.requiereApi ? "usa datos de la NASA" : "funciona sin conexión"}
            </Marca>
          </div>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">{nivel.hace}</p>

          {cursos.length === 0 ? (
            <p className="t-apoyo mt-e3 border-t border-borde pt-e2 text-tinta-sec">
              Este nivel está en producción. Los niveles 0 y 1 se publican primero porque no
              dependen de ninguna API.
            </p>
          ) : (
            <div className="mt-e3 grid gap-e2 md:grid-cols-2">
              {cursos.map((c) => (
                <TarjetaCurso key={c.slug} avance={avanceDeCurso(c, avance)} />
              ))}
            </div>
          )}

          {!cargado && cursos.length > 0 ? (
            <p className="t-anotacion mt-e2">cargando tu avance…</p>
          ) : null}
        </Registro>
      ))}
    </>
  );
}
