import { BotonEnlace } from "@/componentes/ui/Boton";

export default function Docentes() {
  return (
    <section className="seccion border-t border-borde bg-elevado">
      <div className="contenedor">
        <h2 className="t-h2 text-tinta">Para docentes y colegios</h2>
        <p className="medida mt-3 text-tinta-sec">
          Asigna misiones a tu aula, sigue el avance por estudiante y proyecta el dato del día
          al empezar la clase. Los niveles 0 y 1 funcionan aunque el internet del colegio no.
        </p>
        <p className="medida mt-3 text-[15px] text-tinta-sec">
          KillaLab opera sin fines de lucro: los ingresos por licencias institucionales se
          reinvierten en producción de contenido, infraestructura y becas. El acceso individual
          para estudiantes es gratuito y permanente.
        </p>
        <div className="mt-8">
          <BotonEnlace href="/docentes" variante="primario">Llevar KillaLab a mi colegio</BotonEnlace>
        </div>
      </div>
    </section>
  );
}
