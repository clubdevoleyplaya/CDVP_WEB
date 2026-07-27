import type { Metadata } from "next";
import { Oswald, Source_Serif_4 } from "next/font/google";
import { DemoStateProvider } from "@/context/demo-state";
import { Header } from "@/components/header";
import { DemoBar } from "@/components/demo-bar";
import { Footer } from "@/components/footer";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Club de Voley Playa",
  description:
    "Academia asincrónica de voley playa de Juli Azaad — PoC de arquitectura y contenido.",
};

const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('cdvp-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${oswald.variable} ${sourceSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <DemoStateProvider>
          <Header />
          <DemoBar />
          {children}
          <Footer />
        </DemoStateProvider>
      </body>
    </html>
  );
}
