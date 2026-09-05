import { Suspense } from "react";
import { BotonEnlace } from "@/componentes/ui/Boton";
import DatoEnVivo from "@/componentes/dato/DatoEnVivo";

export default function Hero() {
  return (
    <section className="seccion">
      <div className="contenedor">
        {/* Todo alineado a la izquierda. Nada centrado salvo el pie. */}
        <h1 className="t-display medida text-tinta">
          El espacio de hoy,
          <br />
          no el de un libro de 2009
        </h1>
        <p className="medida mt-5 text-tinta-sec">
          Misiones de ciencia espacial con datos que la NASA publicó esta semana. Gratis para
          estudiantes, siempre.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <BotonEnlace href="/misiones" variante="primario">Empezar una misión</BotonEnlace>
          <BotonEnlace href="/docentes" variante="secundario">Ver cómo funciona</BotonEnlace>
        </div>

        <div className="mt-12 max-w-3xl">
          <Suspense fallback={<div className="rounded-l border border-borde bg-elevado p-8 text-tinta-sec">Consultando DONKI…</div>}>
            <DatoEnVivo />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
