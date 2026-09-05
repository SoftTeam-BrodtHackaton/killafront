import Mural from "@/componentes/notas/Mural";

export const metadata = { title: "Notas" };

export default function PaginaNotas() {
  return (
    <div className="hoja">
      <section className="registro">
        <p className="margen">tu bitácora</p>
        <div>
          <h1 className="t-masthead text-tinta">Notas</h1>
          <p className="t-cuerpo medida mt-e3 text-tinta-sec">
            Lo que vas anotando mientras resuelves misiones. Se guarda en este navegador; cuando
            entres con tu cuenta viajará contigo.
          </p>
          <Mural />
        </div>
      </section>
    </div>
  );
}
