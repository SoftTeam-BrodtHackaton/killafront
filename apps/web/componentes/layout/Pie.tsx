import Glifo from "@/componentes/marca/Glifo";

/**
 * El pie es lo único centrado de todo el sitio; el resto va alineado a la
 * izquierda. Aquí va la redacción institucional, que se cuida palabra por
 * palabra: se dice "trabaja junto a", nunca "avalado por", y no se publica
 * ningún logo de terceros sin autorización escrita de uso de marca.
 */
export default function Pie() {
  return (
    <footer className="border-t-2 border-indigo">
      <div className="hoja py-e5 text-center">
        <Glifo tamano={24} className="mx-auto text-indigo" />

        <p className="t-apoyo mx-auto mt-e3 max-w-[62ch] text-tinta-sec">
          KillaLab trabaja junto a comunidades estudiantiles de tecnología del Perú, entre ellas
          capítulos y ramas estudiantiles IEEE, para acercar a más estudiantes a la ciencia y la
          ingeniería. No es un proyecto oficial de esas instituciones ni está avalado por ellas.
        </p>

        <p className="t-cifra-min mx-auto mt-e3 max-w-[62ch] text-tinta-sec">
          Datos de NASA DONKI, NeoWs y JPL CAD, usados bajo sus términos de uso públicos.
        </p>
      </div>
    </footer>
  );
}
