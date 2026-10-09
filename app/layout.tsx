import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Oswald, Source_Serif_4, Geist } from "next/font/google";
import { DemoStateProvider } from "@/context/demo-state";
import { Header } from "@/components/header";
import { DemoBar } from "@/components/demo-bar";
import { Footer } from "@/components/footer";
import "./globals.css";
import { CURRENCY_COOKIE, detectCurrency } from "@/lib/locale";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  description: "Academia asincrónica de voley playa de Juli Azaad.",
};

const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('cdvp-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const currency = detectCurrency({ currencyCookie: cookieStore.get(CURRENCY_COOKIE)?.value });

  return (
    <html
      // Los textos todavía están solo en español: `lang` sigue fijo hasta traducir la interfaz.
      lang="es"
      suppressHydrationWarning
      className={cn("h-full", oswald.variable, sourceSerif.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <DemoStateProvider initialCurrency={currency}>
          <Header />
          <DemoBar />
          <main className="w-full flex-1">{children}</main>
          <Footer />
        </DemoStateProvider>
      </body>
    </html>
  );
}
