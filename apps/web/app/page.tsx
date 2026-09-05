import Masthead from "@/componentes/landing/Masthead";
import EjeDeNiveles from "@/componentes/landing/EjeDeNiveles";
import Formatos from "@/componentes/landing/Formatos";
import Comunidades from "@/componentes/landing/Comunidades";
import Credenciales from "@/componentes/landing/Credenciales";
import Docentes from "@/componentes/landing/Docentes";
import Aliados from "@/componentes/landing/Aliados";

/** La lectura solar se refresca cada quince minutos; el resto de la página es
 *  estático. Así el SEO no depende de la latencia de la NASA. */
export const revalidate = 900;

export default function Portada() {
  return (
    <div className="hoja">
      <Masthead />
      <EjeDeNiveles />
      <Formatos />
      <Comunidades />
      <Credenciales />
      <Docentes />
      <Aliados />
    </div>
  );
}
