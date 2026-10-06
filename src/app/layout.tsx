import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollReveal from "@/components/ScrollReveal";
import SmoothScroll from "@/components/SmoothScroll";
import TopNav from "@/components/TopNav";
import ImpactBadge from "@/components/ImpactBadge";
import Footer from "@/components/Footer";
import { LeadModalProvider } from "@/components/LeadModalProvider";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import AshiChat from "@/components/AshiChat";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ASHER — Consultora de Crecimiento de Marca",
  description:
    "Estrategia, marca, digital y legal bajo un mismo techo. Construimos marca sin fricciones, con respaldo legal desde el día uno.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)] cursor-none-desktop">
        <LeadModalProvider>
          <CartProvider>
            <SmoothScroll />
            <CustomCursor />
            <ScrollReveal />
            <TopNav />
            <main>{children}</main>
            <Footer />
            <ImpactBadge />
            <CartDrawer />
            <AshiChat />
          </CartProvider>
        </LeadModalProvider>
      </body>
    </html>
  );
}
