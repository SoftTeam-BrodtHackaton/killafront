import Hero from "@/componentes/landing/Hero";
import Niveles from "@/componentes/landing/Niveles";
import Formatos from "@/componentes/landing/Formatos";
import Comunidades from "@/componentes/landing/Comunidades";
import Certificados from "@/componentes/landing/Certificados";
import Docentes from "@/componentes/landing/Docentes";
import Aliados from "@/componentes/landing/Aliados";

/** El dato en vivo se refresca cada 15 minutos; el resto de la página es estático.
 *  Así el SEO no depende de la latencia de la NASA. */
export const revalidate = 900;

export default function Landing() {
  return (
    <>
      <Hero />
      <Niveles />
      <Formatos />
      <Comunidades />
      <Certificados />
      <Docentes />
      <Aliados />
    </>
  );
}
