/**
 * Una marca de estado. Nunca comunica por color solo: siempre lleva su texto, y
 * el tono cambia además el peso de la regla que la rodea.
 */
export default function Marca({
  children,
  tono = "neutro",
}: {
  children: React.ReactNode;
  tono?: "neutro" | "accion" | "dato";
}) {
  const tonos = {
    neutro: "border-borde text-tinta-sec",
    accion: "bg-ambar text-[#14142B] border-ambar",
    dato: "border-turquesa text-turquesa-texto",
  } as const;

  return (
    <span className={`t-cifra-min inline-block rounded-s border px-1.5 py-0.5 ${tonos[tono]}`}>
      {children}
    </span>
  );
}
