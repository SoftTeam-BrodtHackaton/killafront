import Registro from "@/componentes/layout/Registro";
import Marca from "@/componentes/ui/Marca";

export default function Credenciales() {
  return (
    <Registro anotacion="queda demostrado">
      <div className="grid gap-e4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="t-titulo text-tinta">Lo que aprendes se puede verificar</h2>
          <p className="t-cuerpo medida mt-e2 text-tinta-sec">
            Open Badges 3.0 emitidos vía Credly: estándar abierto, verificable desde fuera, se
            muestra en LinkedIn y lo reconocen universidades. Sin billeteras y sin costo para el
            estudiante.
          </p>
          <div className="mt-e3 flex flex-wrap gap-e1">
            <Marca tono="accion">Planeta completado</Marca>
            <Marca tono="accion">Racha de constancia</Marca>
            <Marca>Olimpiada</Marca>
            <Marca tono="dato">Certificado de trayectoria</Marca>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border-t-2 border-indigo pt-e2">
            <p className="t-anotacion">Emisor</p>
            <p className="t-cuerpo mt-0.5 text-tinta">KillaLab</p>
          </div>
          <div className="mt-e3 border-t border-borde pt-e2">
            <p className="t-anotacion">Verificación</p>
            <p className="t-apoyo mt-0.5 text-tinta">
              Cada certificado lleva un código público que cualquiera puede comprobar sin pedirnos
              permiso.
            </p>
          </div>
        </div>
      </div>
    </Registro>
  );
}
