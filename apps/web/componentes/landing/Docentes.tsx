import Registro from "@/componentes/layout/Registro";
import { BotonEnlace } from "@/componentes/ui/Boton";

export default function Docentes() {
  return (
    <Registro anotacion="para el aula">
      <div className="grid gap-e4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="t-titulo text-tinta">Para docentes y colegios</h2>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">
            Asignas misiones a tu aula, sigues el avance por estudiante y proyectas el dato del día
            al empezar la clase. Los niveles 0 y 1 funcionan aunque el internet del colegio no.
          </p>
          <div className="mt-e4">
            <BotonEnlace href="/docentes" variante="secundario">
              Llevar KillaLab a mi colegio
            </BotonEnlace>
          </div>
        </div>

        <div className="lg:col-span-5">
          <blockquote className="border-l-2 border-ambar pl-e3">
            <p className="t-cuerpo text-tinta">
              KillaLab opera sin fines de lucro. Los ingresos por licencias institucionales se
              reinvierten en producción de contenido, infraestructura y becas. El acceso individual
              para estudiantes es gratuito y permanente.
            </p>
          </blockquote>
        </div>
      </div>
    </Registro>
  );
}
