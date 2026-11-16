import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { AppStateProvider } from "@/context/app-state";
import { Header } from "@/components/header";
import { SubscriptionBar } from "@/components/subscription-bar";
import { Footer } from "@/components/footer";
import "./globals.css";
import { CURRENCY_COOKIE, currencyFromCookie } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { getPriceCatalog } from "@/lib/prices-server";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport = { themeColor: "#0b1b33" };

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
  const locale = await getLocale();
  const currency = currencyFromCookie(cookieStore.get(CURRENCY_COOKIE)?.value);
  const priceCatalog = await getPriceCatalog();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("h-full", barlowCondensed.variable, barlow.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <NextIntlClientProvider>
        <AppStateProvider initialCurrency={currency} priceCatalog={priceCatalog}>
          <Header />
          <SubscriptionBar />
          <main className="w-full flex-1">{children}</main>
          <Footer />
        </AppStateProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
