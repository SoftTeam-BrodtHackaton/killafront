import { killalab } from "@killalab/composicion";
import Panel from "@/componentes/panel/Panel";

export const dynamic = "force-static";

/**
 * El panel. Es la primera pantalla al entrar y responde a una sola pregunta:
 * ¿qué estudio ahora?
 *
 * La portada de marketing ya no vive aquí: está en el repo `killalanding`. Esta
 * aplicación es para estudiar, y empieza donde el estudiante lo dejó.
 */
export default function Inicio() {
  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">tu panel</p>
        {/* El panel va envuelto: `.registro` es una rejilla de dos columnas y sin
            este div cada sección del panel ocuparía una celda propia. */}
        <div>
          <Panel cursos={killalab.cursos()} />
        </div>
      </section>
    </div>
  );
}
