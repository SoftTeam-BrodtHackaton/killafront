import Badge from "@/componentes/ui/Badge";

export default function Certificados() {
  return (
    <section className="seccion border-t border-borde">
      <div className="contenedor">
        <h2 className="t-h2 text-tinta">Lo que aprendes queda demostrado</h2>
        <p className="medida mt-3 text-tinta-sec">
          Open Badges 3.0 emitidos vía Credly: estándar abierto, verificable, se muestra en
          LinkedIn y lo reconocen universidades. Sin billeteras ni costos.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge tono="obtenido">Planeta completado</Badge>
          <Badge tono="obtenido">Racha de constancia</Badge>
          <Badge tono="neutro">Olimpiada</Badge>
          <Badge tono="dato">Certificado de trayectoria</Badge>
        </div>
        <p className="font-dato medida mt-6 text-[13px] text-tinta-sec">
          Emisor: KillaLab. Cada certificado lleva código de verificación público.
        </p>
      </div>
    </section>
  );
}
