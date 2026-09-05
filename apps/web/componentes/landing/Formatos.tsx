import Registro from "@/componentes/layout/Registro";

/**
 * Del mismo JSON salen varios formatos sin producir nada a mano. Se cuenta como
 * una lista de definición y no como una rejilla de tarjetas: lo importante es la
 * relación entre el contenido base y lo que se deriva de él, y eso se lee mejor
 * en columnas alineadas que en cajas sueltas.
 */
const formatos = [
  { nombre: "Misión", que: "El reto interactivo, paso a paso. Es el formato principal.", produccion: "el núcleo", listo: true },
  { nombre: "Tarjetas", que: "Un mazo de repaso que se arma solo al terminar la misión.", produccion: "derivado del JSON", listo: true },
  { nombre: "Mapa mental", que: "Los conceptos de un planeta entero, conectados. Expandes ramas y añades tus notas.", produccion: "derivado del JSON", listo: true },
  { nombre: "Notas", que: "Tu mural de hallazgos, para ordenarlos como quieras.", produccion: "solo interfaz", listo: true },
  { nombre: "Podcast", que: "Boletín semanal narrado con los eventos espaciales reales de esos días.", produccion: "guion automático desde DONKI", listo: false },
  { nombre: "Video corto", que: "Cápsula vertical de 60 a 90 segundos por concepto.", produccion: "manual, el más caro", listo: false },
];

export default function Formatos() {
  return (
    <Registro anotacion="un tema, varias salidas">
      <h2 className="t-titulo medida text-tinta">Estudias como te sirva</h2>
      <p className="t-cuerpo medida mt-e2 text-tinta-sec">
        Todo sale del mismo contenido base. Producir un tema produce, sin trabajo extra, su mazo
        de tarjetas y sus nodos del mapa.
      </p>

      <dl className="mt-e5">
        {formatos.map((f) => (
          <div
            key={f.nombre}
            className="grid gap-x-e3 gap-y-1 border-t border-borde py-e3 sm:grid-cols-12"
          >
            <dt className="t-subtitulo text-indigo sm:col-span-3">{f.nombre}</dt>
            <dd className="t-cuerpo text-tinta sm:col-span-6">{f.que}</dd>
            <dd className="t-anotacion sm:col-span-3 sm:text-right">
              {f.listo ? f.produccion : `${f.produccion}, en hoja de ruta`}
            </dd>
          </div>
        ))}
      </dl>
    </Registro>
  );
}
