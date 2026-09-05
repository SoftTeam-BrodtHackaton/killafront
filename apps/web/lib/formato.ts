const rtf = new Intl.RelativeTimeFormat("es-PE", { numeric: "auto" });
const nf = new Intl.NumberFormat("es-PE");

/** "hace 4 horas". Devuelve null si la fecha no es parseable, para que el
 *  componente muestre la fecha absoluta en vez de inventar un relativo. */
export function haceCuanto(iso: string): string | null {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  const seg = (t - Date.now()) / 1000;
  const tramos: [Intl.RelativeTimeFormatUnit, number][] = [
    ["second", 60], ["minute", 60], ["hour", 24], ["day", 30], ["month", 12], ["year", Infinity],
  ];
  let valor = seg;
  for (const [unidad, paso] of tramos) {
    if (Math.abs(valor) < paso) return rtf.format(Math.round(valor), unidad);
    valor /= paso;
  }
  return null;
}

export function fechaCorta(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export const numero = (n: number, decimales = 0) =>
  nf.format(Number(n.toFixed(decimales)));

/** Distancias grandes en km leídas por un escolar: 4 500 000 km → "4.5 millones de km". */
export function distanciaLegible(km: number): string {
  if (km >= 1_000_000) return `${numero(km / 1_000_000, 1)} millones de km`;
  return `${numero(km)} km`;
}

/** "1 lección" / "3 lecciones". Un plural mal puesto delata que nadie miró la pantalla. */
export const plural = (n: number, singular: string, plural: string) =>
  `${n} ${n === 1 ? singular : plural}`;
