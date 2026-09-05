/** Único lugar del proyecto que aplica la tipografía monoespaciada.
 *  Si un número aparece en pantalla sin pasar por aquí, es un bug de diseño. */
export default function CifraCientifica({
  valor,
  unidad,
  destacada = false,
}: {
  valor: string | number;
  unidad?: string;
  destacada?: boolean;
}) {
  return (
    <span
      className={`font-dato tabular-nums ${destacada ? "text-turquesa text-[22px] font-semibold" : "text-[15px] font-medium"}`}
    >
      {valor}
      {unidad ? <span className="text-tinta-sec"> {unidad}</span> : null}
    </span>
  );
}
