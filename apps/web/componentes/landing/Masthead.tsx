import { Suspense } from "react";
import { BotonEnlace } from "@/componentes/ui/Boton";
import LecturaSolar from "@/componentes/dato/LecturaSolar";

/**
 * La cabecera de la hoja. Dos columnas desiguales: el titular ocupa siete
 * doceavos y la lectura del instrumento cinco, a su lado y no debajo.
 *
 * Que el dato esté al lado del titular y no bajo el pliegue es la decisión de
 * composición más importante del sitio: lo primero que se ve no es una promesa
 * de marketing, es una medición de esta semana con su fuente.
 */
export default function Masthead() {
  return (
    <section className="registro">
      <p className="margen">registro del día</p>

      <div className="grid items-start gap-e5 lg:grid-cols-12 lg:gap-e4">
        <div className="lg:col-span-7">
          <h1 className="t-masthead text-tinta">
            El espacio de hoy, no el de un libro de 2009
          </h1>

          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Misiones de ciencia espacial con las cifras que la NASA publicó esta semana. Cada
            número que ves en KillaLab dice de dónde salió y cuándo se leyó.
          </p>

          <div className="mt-e4 flex flex-wrap items-center gap-e3">
            <BotonEnlace href="/misiones" variante="primario">
              Empezar una misión
            </BotonEnlace>
            <BotonEnlace href="/docentes" variante="sobrio">
              Ver cómo funciona en un aula
            </BotonEnlace>
          </div>

          <p className="t-apoyo medida mt-e4 text-tinta-sec">
            Gratis para estudiantes, siempre. Los dos primeros niveles funcionan sin internet.
          </p>
        </div>

        <div className="lg:col-span-5">
          <Suspense
            fallback={
              <div className="instrumento">
                <p className="t-cifra-min text-tinta-sec">consultando DONKI…</p>
              </div>
            }
          >
            <LecturaSolar />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
