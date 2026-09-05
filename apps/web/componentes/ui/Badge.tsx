/** Ningún estado se comunica solo por color: el badge siempre lleva texto. */
export default function Badge({ children, tono = "neutro" }: { children: React.ReactNode; tono?: "neutro" | "obtenido" | "dato" }) {
  const tonos = {
    neutro: "border-borde text-tinta-sec",
    obtenido: "bg-ambar text-[#14142B] border-transparent",
    dato: "border-turquesa text-turquesa",
  } as const;
  return (
    <span className={`font-dato inline-block rounded-s border px-2 py-1 text-[13px] ${tonos[tono]}`}>
      {children}
    </span>
  );
}
