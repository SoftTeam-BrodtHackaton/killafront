import { killalab } from "@killalab/composicion";
import Expediente from "@/componentes/panel/Expediente";

export const dynamic = "force-static";
export const metadata = { title: "Tu expediente" };

/**
 * Todo lo que llevas: cursos, retos resueltos y certificados emitidos.
 *
 * Se calcula en el navegador a partir del progreso guardado, no de un servidor.
 * Por eso la página dice con claridad dónde vive ese avance y qué implica.
 */
export default function Perfil() {
  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">tu expediente</p>
        <div>
          <h1 className="t-masthead text-tinta">Tu expediente</h1>
          <Expediente cursos={killalab.cursos()} />
        </div>
      </section>
    </div>
  );
}
