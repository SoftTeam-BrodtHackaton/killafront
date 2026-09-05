/**
 * La marca de KillaLab.
 *
 * "Killa" es luna en quechua. El glifo es la luna en cuarto — un círculo partido
 * por una vertical, con la mitad llena — dentro de un bisel con cuatro marcas,
 * como la corona de un instrumento de medición.
 *
 * Esa es la tesis del producto en un símbolo: el cielo leído como un
 * instrumento, no como una ilustración. Por eso no hay cohete, ni planeta con
 * anillo, ni átomo.
 *
 * Se dibuja en `currentColor` para que herede el índigo de estructura y funcione
 * igual en claro, en oscuro y a 16px en la pestaña del navegador.
 */
export default function Glifo({ tamano = 28, className = "" }: { tamano?: number; className?: string }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Bisel: las cuatro marcas del instrumento */}
      <path d="M16 1v3M31 16h-3M16 31v-3M1 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      {/* El disco */}
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="2" />
      {/* La fase: mitad iluminada */}
      <path d="M16 5.5a10.5 10.5 0 0 1 0 21z" fill="currentColor" />
    </svg>
  );
}
