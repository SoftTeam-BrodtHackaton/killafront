import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/componentes/layout/Nav";
import Pie from "@/componentes/layout/Pie";
import RegistroSW from "@/componentes/layout/RegistroSW";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--fuente-display", weight: ["600", "700", "800"] });
const cuerpo = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--fuente-cuerpo", weight: ["400", "700"] });
const dato = IBM_Plex_Mono({ subsets: ["latin"], variable: "--fuente-dato", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: {
    default: "KillaLab, ciencia espacial con datos reales de la NASA",
    template: "%s — KillaLab",
  },
  description:
    "Plataforma educativa peruana. Cada cifra que ves viene de una API pública y muestra su fuente y su fecha. Gratis para estudiantes.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/marca/glifo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/marca/icono.svg" }],
  },
  openGraph: { locale: "es_PE", type: "website", siteName: "KillaLab" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D1F" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* Corre antes de pintar para que no parpadee el tema: respeta prefers-color-scheme
   en la primera visita y la preferencia guardada de ahí en adelante. */
const guionTema = `(function(){try{var t=localStorage.getItem("killa-tema");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"oscuro":"claro"}document.documentElement.setAttribute("data-tema",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: guionTema }} />
      </head>
      <body className={`${display.variable} ${cuerpo.variable} ${dato.variable} papel`}>
        <a
          href="#contenido"
          className="sr-only rounded-m bg-ambar px-e2 py-1 text-[#14142B] focus:not-sr-only focus:absolute focus:left-e2 focus:top-e2 focus:z-50"
        >
          Saltar al contenido
        </a>
        <Nav />
        <main id="contenido">{children}</main>
        <Pie />
        <RegistroSW />
      </body>
    </html>
  );
}
