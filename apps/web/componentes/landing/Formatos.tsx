import Tarjeta from "@/componentes/ui/Tarjeta";

const formatos = [
  { nombre: "Misión", que: "El reto interactivo. Es el formato principal.", estado: "en el MVP" },
  { nombre: "Tarjetas", que: "Mazo de repaso que se genera solo al terminar una misión.", estado: "en el MVP" },
  { nombre: "Mapa mental", que: "Los conceptos de un planeta conectados. Puedes expandir ramas y añadir tus notas.", estado: "en el MVP" },
  { nombre: "Notas", que: "Mural de post-its donde guardas hallazgos y los ordenas.", estado: "en el MVP" },
  { nombre: "Podcast", que: "Boletín semanal narrado con los eventos espaciales reales de esos días.", estado: "hoja de ruta" },
  { nombre: "Video corto", que: "Cápsula vertical de 60 a 90 segundos por concepto.", estado: "hoja de ruta" },
];

export default function Formatos() {
  return (
    <section className="seccion border-t border-borde">
      <div className="contenedor">
        <h2 className="t-h2 text-tinta">Un mismo tema, varios formatos</h2>
        <p className="medida mt-3 text-tinta-sec">
          Todo sale del mismo contenido base. Estudias como te sirva.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formatos.map((f) => (
            <Tarjeta key={f.nombre}>
              <h3 className="font-display text-xl font-semibold text-indigo">{f.nombre}</h3>
              <p className="mt-2 text-[15px] text-tinta">{f.que}</p>
              <p className="font-dato mt-4 text-[13px] text-tinta-sec">{f.estado}</p>
            </Tarjeta>
          ))}
        </div>
      </div>
    </section>
  );
}
