import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TextBlockAnimation from "@/components/ui/text-block-animation";

interface Logo {
  src: string;
  alt: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

interface MarqueeLogoScrollerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Plain-text title, used for the section's accessible name. */
  label: string;
  /** The visible heading; defaults to `label`. */
  title?: React.ReactNode;
  description: string;
  logos: Logo[];
  speed?: "normal" | "slow" | "fast";
  /** How many times the logo list repeats per half of the track, so each half is wider than the screen. */
  repeat?: number;
}

const DURATIONS = {
  normal: "40s",
  slow: "80s",
  fast: "20s",
} as const;

/**
 * A self-contained, infinitely scrolling logo marquee. The track holds two
 * identical halves and scrolls exactly one half (keyframes in globals.css),
 * so the loop has no seam; it pauses on hover.
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ label, title = label, description, logos, speed = "normal", repeat = 4, className, ...props }, ref) => {
    const half = Array.from({ length: repeat }, () => logos).flat();

    return (
      <section
        ref={ref}
        aria-label={label}
        className={cn(
          "w-full overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-ink)]",
          className
        )}
        {...props}
      >
        <div className="px-6 pt-10 md:px-10 md:pt-16 lg:pt-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 border-b border-[var(--color-line)] pb-10 text-center md:gap-5 md:pb-14">
            <TextBlockAnimation blockColor="#0b1956">
              <h2 className="font-display text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                {title}
              </h2>
            </TextBlockAnimation>
            <TextBlockAnimation blockColor="#8fb0e3" duration={0.5} delay={0.15}>
              <p className="max-w-xl text-balance text-base leading-relaxed text-[var(--color-ink-soft)] md:text-lg">
                {description}
              </p>
            </TextBlockAnimation>
          </div>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <ul
            className="flex w-max items-center gap-5 py-6 pr-5 hover:[animation-play-state:paused] md:gap-8 md:py-8 md:pr-8"
            style={{ animation: `marquee-left ${DURATIONS[speed]} linear infinite` }}
          >
            {[0, 1].flatMap((copy) =>
              half.map((logo, index) => (
                <li
                  key={`${copy}-${index}`}
                  aria-hidden={copy === 1 ? true : undefined}
                  className="group relative flex h-40 w-48 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[var(--color-surface)]/70 md:h-56 md:w-72"
                >
                  <div
                    style={
                      {
                        "--from": logo.gradient.from,
                        "--via": logo.gradient.via,
                        "--to": logo.gradient.to,
                      } as React.CSSProperties
                    }
                    className="absolute inset-0 scale-150 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)] opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                  />
                  <div className="relative aspect-square h-[80%] overflow-hidden rounded-full bg-white shadow-md">
                    <Image
                      src={logo.src}
                      alt={copy === 1 ? "" : logo.alt}
                      fill
                      sizes="(min-width: 768px) 180px, 130px"
                      className="object-cover"
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    );
  }
);

MarqueeLogoScroller.displayName = "MarqueeLogoScroller";

export { MarqueeLogoScroller };
