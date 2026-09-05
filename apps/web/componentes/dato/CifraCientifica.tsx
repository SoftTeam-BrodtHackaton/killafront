/**
 * El único sitio del proyecto que aplica la tipografía monoespaciada.
 * Si un número aparece en pantalla sin pasar por aquí, es un error de diseño.
 *
 * `lectura` es el tamaño de instrumento: se usa una sola vez por pantalla, en la
 * cifra que da sentido a todo lo demás.
 */
export default function CifraCientifica({
  valor,
  unidad,
  tamano = "normal",
  className = "",
}: {
  valor: string | number;
  unidad?: string;
  tamano?: "lectura" | "normal" | "min";
  className?: string;
}) {
  const clase = { lectura: "t-lectura", normal: "t-cifra", min: "t-cifra-min" }[tamano];

  return (
    <span className={`${clase} text-turquesa-texto ${className}`}>
      {valor}
      {unidad ? (
        <span className="t-cifra-min ml-1 text-tinta-sec">{unidad}</span>
      ) : null}
    </span>
  );
}
