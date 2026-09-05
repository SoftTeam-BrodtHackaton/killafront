/**
 * Progreso como anillo. Es la única forma redonda del sistema, y está justificada:
 * un porcentaje de avance es una fracción de un todo, y el círculo es la figura
 * que lo dice sin necesidad de leer el número.
 *
 * Se dibuja con `stroke-dasharray` sobre un SVG, no con una librería de gráficos:
 * son doce líneas y no vale la pena arrastrar dependencias por esto.
 *
 * El porcentaje va también en texto dentro del anillo, así que nadie depende de
 * interpretar el arco.
 */
export default function Anillo({
  porcentaje,
  tamano = 72,
  completado = false,
}: {
  porcentaje: number;
  tamano?: number;
  completado?: boolean;
}) {
  const grosor = tamano < 60 ? 4 : 6;
  const radio = (tamano - grosor) / 2;
  const vuelta = 2 * Math.PI * radio;
  const recorrido = (Math.min(Math.max(porcentaje, 0), 100) / 100) * vuelta;

  return (
    <div className="relative shrink-0" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} aria-hidden="true" className="-rotate-90">
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="var(--borde)"
          strokeWidth={grosor}
        />
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke={completado ? "var(--ok)" : "var(--killa-turquesa)"}
          strokeWidth={grosor}
          strokeDasharray={`${recorrido} ${vuelta}`}
          strokeLinecap="butt"
        />
      </svg>

      <span
        className="absolute inset-0 grid place-items-center font-dato tabular-nums text-tinta"
        style={{ fontSize: tamano < 60 ? 11 : 14 }}
      >
        {porcentaje}%
      </span>
    </div>
  );
}
