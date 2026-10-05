import type { Metadata } from "next";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import BentoGrid, { LegalBalance, LegalChecklist } from "@/components/ui/bento-grid-01";
import { ServiceCatalog } from "@/components/ui/service-catalog";
import { TextColor } from "@/components/ui/text-color";
import { serviceAddons } from "@/data/service-addons";
import { brand } from "@/data/asher";

export const metadata: Metadata = {
  title: "Legal — ASHER",
  description: "Respaldo legal desde el día uno.",
};

export default function LegalPage() {
  return (
    <>
      <MinimalistHero
        mainText="Respaldo legal desde el día uno: registro de marca, contratos y protección para que tu negocio crezca sin sobresaltos."
        readMoreLink="/contacto"
        title="Legal"
        socialLinks={[
          { icon: "instagram", href: brand.socialLinks.instagram },
          { icon: "facebook", href: brand.socialLinks.facebook },
          { icon: "tiktok", href: brand.socialLinks.tiktok },
          { icon: "whatsapp", href: brand.socialLinks.whatsapp },
        ]}
        locationText="Ecuador"
        circleClassName="bg-[#7d1a1f]"
      />

      <div className="flex h-[220px] items-center justify-center px-5 md:h-[280px]">
        <GooeyText
          texts={["Contratos", "Blindaje", "Respaldo", "Marca"]}
          morphTime={1}
          cooldownTime={0.4}
          className="font-display font-medium"
        />
      </div>

      <BentoGrid
        eyebrow="Legal"
        speedValue="24h"
        visual1={<LegalBalance />}
        visual2={<LegalChecklist />}
        cards={[
          { title: "Contratos claros", description: "Documentos redactados para entenderse, no para confundir." },
          { title: "Estructura a la medida", description: "Organizamos la parte legal de tu negocio según cómo creces." },
          { title: "Cobertura total", description: "Respaldo legal para marca, contratos, datos y operaciones." },
          { title: "Respuesta rápida", description: "Resolvemos tus dudas legales sin semanas de espera." },
          { title: "Blindaje legal", description: "Protección desde el día uno, no como último paso." },
          { title: "Siempre disponible", description: "Acompañamiento legal accesible cuando lo necesitas." },
        ]}
      />

      {serviceAddons.legal.sections!.map((section) => (
        <ServiceCatalog
          key={section.id}
          id={section.id}
          eyebrow={`Legal — ${section.label}`}
          title={section.title}
          description={section.description}
          highlights={section.highlights}
          note={section.note}
          items={section.items}
          accent={section.accent}
          onAccent={section.onAccent}
        />
      ))}

      <TextColor
        className="bg-[var(--color-bg)] px-6 py-20 md:py-28"
        words={[
          { text: "Contratos.", from: "#7d1a1f", to: "#be8d8f" },
          { text: "Marca.", from: "#be8d8f", to: "#7d1a1f" },
          { text: "Blindaje.", from: "#7d1a1f", to: "#be8d8f" },
        ]}
      />
    </>
  );
}
