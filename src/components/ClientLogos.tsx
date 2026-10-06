import { MarqueeLogoScroller } from "@/components/ui/marquee-logo-scroller";

const marcas = [
  {
    src: "/marcas/spc.webp",
    alt: "Social Padel Club",
    gradient: { from: "#3d4d8f", via: "#0b1956", to: "#060e2e" },
  },
  {
    src: "/marcas/Batidos.webp",
    alt: "Batidoos",
    gradient: { from: "#8a2a2a", via: "#520000", to: "#2e0000" },
  },
  {
    src: "/marcas/velezguev.webp",
    alt: "Vélez Guevara Abogados",
    gradient: { from: "#e3ebf8", via: "#c3d3ef", to: "#9db8e3" },
  },
  {
    src: "/marcas/barak.webp",
    alt: "Barak Maniquíes",
    gradient: { from: "#c3d3ef", via: "#8fb0e3", to: "#5f83c4" },
  },
];

export default function ClientLogos() {
  return (
    <div className="px-5 py-16 md:px-10 md:py-24">
      <MarqueeLogoScroller
        label="Marcas que han confiado en Asher"
        title={
          <>
            {/* The ASHER wordmark's typeface (Inter, uppercase), slightly
                spaced. The left margin stands in for the space, which the
                line-splitting reveal animation drops; the negative right
                margin cancels the trailing letter-spacing so it stays centered. */}
            Marcas que han confiado en
            <span className="ml-[0.28em] mr-[-0.1em] inline-block whitespace-nowrap font-[family-name:var(--font-body)] font-medium uppercase tracking-[0.1em]">
              Asher
            </span>
          </>
        }
        description="Negocios que han confiado en ASHER para mover su marca."
        logos={marcas}
        speed="normal"
      />
    </div>
  );
}
