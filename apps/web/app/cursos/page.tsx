import { killalab } from "@killalab/composicion";
import Catalogo from "@/componentes/panel/Catalogo";

export const dynamic = "force-static";
export const metadata = { title: "Cursos" };

/**
 * El catálogo, agrupado por nivel. Elegir qué estudiar tiene que poderse hacer de
 * un vistazo, así que los niveles se ven todos a la vez y cada curso enseña su
 * avance sin entrar.
 */
export default function Cursos() {
  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">catálogo</p>
        <div>
          <h1 className="t-masthead text-tinta">Cursos</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Cada curso son varias lecciones sobre un mismo objeto: el Sol, la Luna, la Tierra.
            Al terminarlo se emite su certificado con código de verificación público.
          </p>
        </div>
      </section>

      <Catalogo niveles={killalab.nivelesConCursos()} />
    </div>
  );
}
