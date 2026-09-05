import Registro from "@/componentes/layout/Registro";

export default function Aliados() {
  return (
    <Registro anotacion="con quiénes">
      <h2 className="t-titulo medida text-tinta">Comunidades, no logos</h2>
      <p className="t-cuerpo medida mt-e2 text-tinta-sec">
        KillaLab trabaja junto a comunidades estudiantiles de tecnología del Perú, entre ellas
        capítulos y ramas estudiantiles IEEE. Buscamos articulación con instituciones públicas de
        educación y ciencia.
      </p>
      {/* Sin logos de terceros hasta que exista convenio o carta de intención firmada.
          El respaldo institucional se documenta o no existe. */}
      <p className="t-apoyo medida mt-e3 text-tinta-sec">
        Esta página no muestra ningún logo ajeno. Publicamos una marca de terceros solo con
        autorización escrita de uso, y decimos exactamente qué tipo de vínculo existe.
      </p>
    </Registro>
  );
}
