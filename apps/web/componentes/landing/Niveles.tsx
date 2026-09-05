import { NIVELES } from "@killalab/content";
import Badge from "@/componentes/ui/Badge";

const descripciones: Record<number, string> = {
  0: "Sistema solar, fases de la Luna, día y noche, estaciones, gravedad y el Sol.",
  1: "Escalas y distancias, órbitas, cómo se mide en el espacio, leer gráficos simples.",
  2: "Clima espacial, defensa planetaria y análisis de variables reales.",
  3: "Consultar la API directo, construir tu propia visualización, retos abiertos.",
};

export default function Niveles() {
  return (
    <section className="seccion border-t border-borde">
      <div className="contenedor">
        <h2 className="t-h2 text-tinta">De lo básico a la NASA</h2>
        <p className="medida mt-3 text-tinta-sec">
          Cuatro niveles. Los dos primeros no dependen de ninguna API: funcionan sin internet
          estable y siguen vivos aunque la NASA falle.
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NIVELES.map((n) => (
            <li key={n.id} className="rounded-l border border-borde p-6">
              <p className="font-dato text-[13px] text-tinta-sec">NIVEL {n.id}</p>
              <h3 className="font-display mt-1 text-xl font-semibold text-indigo">{n.nombre}</h3>
              <p className="mt-2 text-[15px] text-tinta-sec">{n.publico}</p>
              <p className="mt-3 text-[15px] text-tinta">{descripciones[n.id]}</p>
              <div className="mt-4">
                <Badge tono={n.requiereApi ? "dato" : "neutro"}>
                  {n.requiereApi ? "usa datos NASA" : "funciona sin conexión"}
                </Badge>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
