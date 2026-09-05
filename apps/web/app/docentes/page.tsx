import { killalab } from "@killalab/composicion";
import Registro from "@/componentes/layout/Registro";
import { BotonEnlace } from "@/componentes/ui/Boton";

export const metadata = { title: "Para docentes" };

const comoFunciona = [
  {
    titulo: "Proyectas el dato del día",
    que: "Abres la portada y ahí está la última llamarada solar registrada, con su clase sobre la escala y su fuente. Cinco minutos de clase que no se repiten nunca porque el Sol no repite.",
  },
  {
    titulo: "Asignas una misión",
    que: "Eliges el nivel según la edad del aula. Los niveles 0 y 1 no tocan ninguna API: abren aunque el internet del colegio se caiga a media clase.",
  },
  {
    titulo: "Sigues el avance",
    que: "Ves qué paso trabó a cada estudiante, no solo la nota final. El paso que traba a media aula es el que hay que explicar otra vez.",
  },
];

export default function PaginaDocentes() {
  const niveles = killalab.niveles();
  const sinConexion = niveles.filter((n) => !n.nivel.requiereApi).flatMap((n) => n.temas).length;

  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">para el aula</p>
        <div>
          <h1 className="t-masthead text-tinta">Para docentes y colegios</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            KillaLab está hecho para funcionar en un aula peruana real: con proyector, con
            internet inestable y con cuarenta estudiantes.
          </p>
          <div className="mt-e4">
            <BotonEnlace href="/misiones" variante="primario">
              Ver las misiones disponibles
            </BotonEnlace>
          </div>
        </div>
      </section>

      <Registro anotacion="cómo se usa">
        <h2 className="t-titulo medida text-tinta">Tres cosas y ya</h2>
        <ol className="mt-e4">
          {comoFunciona.map((c, i) => (
            <li key={c.titulo} className="grid gap-x-e3 gap-y-1 border-t border-borde py-e3 sm:grid-cols-12">
              <span className="t-cifra text-turquesa-texto sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-subtitulo text-indigo sm:col-span-4">{c.titulo}</h3>
              <p className="t-cuerpo text-tinta sm:col-span-7">{c.que}</p>
            </li>
          ))}
        </ol>
      </Registro>

      <Registro anotacion="sin internet">
        <div className="grid gap-e4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-titulo text-tinta">Qué pasa si se cae el internet</h2>
            <p className="t-cuerpo medida mt-e2 text-tinta-sec">
              Nada. Los niveles 0 y 1 son contenido versionado con la aplicación, no consultas a
              un servidor. Y en las pantallas que sí usan datos de la NASA, si la fuente no
              responde se muestra el último dato conocido con su fecha, etiquetado como tal.
              Ninguna pantalla se rompe ni se queda en blanco.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="instrumento">
              <p className="t-anotacion">Misiones que abren sin conexión</p>
              <p className="t-lectura mt-e2 text-turquesa-texto">{sinConexion}</p>
              <p className="t-apoyo mt-e2 text-tinta">
                de las publicadas hoy, en los niveles 0 y 1
              </p>
            </div>
          </div>
        </div>
      </Registro>

      <Registro anotacion="qué cuesta">
        <div className="grid gap-e4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-titulo text-tinta">Modelo</h2>
            <p className="t-cuerpo medida mt-e2 text-tinta-sec">
              El acceso individual para estudiantes es gratuito y permanente. Las licencias son
              institucionales: panel de aula, seguimiento por estudiante y reportes para la
              dirección.
            </p>
          </div>
          <div className="lg:col-span-5">
            <blockquote className="border-l-2 border-ambar pl-e3">
              <p className="t-cuerpo text-tinta">
                KillaLab opera sin fines de lucro. Los ingresos por licencias se reinvierten
                íntegramente en producción de contenido, infraestructura y becas.
              </p>
            </blockquote>
          </div>
        </div>
      </Registro>
    </div>
  );
}
