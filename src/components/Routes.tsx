"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { routes, disciplines } from "@/data/asher";
import DiagnosticoQuiz from "./DiagnosticoQuiz";
import { useDiagnosticoRequested } from "@/lib/diagnostico-signal";

// The site's real per-service accent colors (from the /servicios pages).
const disciplineColors: Record<string, string> = {
  Estrategia: "#fb1b7c",
  Marca: "#aa7ef6",
  Digital: "#79b826",
  Publicidad: "#f1562c",
  Legal: "#84172e",
};

export default function Routes() {
  // Opens on its own button, or when anything else (the floating badge, a
  // direct "/#diagnostico" link) asks for it — see diagnostico-signal.ts.
  const [clicked, setClicked] = useState(false);
  const requested = useDiagnosticoRequested();
  const showQuiz = clicked || requested;

  // "Empezar diagnóstico" also takes the visitor down to the quiz it opens.
  const quizRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!clicked) return;
    const frame = requestAnimationFrame(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [clicked]);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Wipes the headline open from the left as the section enters view.
  const clip = useTransform(scrollYProgress, [0.1, 0.85], [100, 0]);
  const clipPath = useTransform(clip, (v) => `inset(0 ${v}% 0 0)`);

  return (
    <section
      ref={ref}
      id="servicios"
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40"
    >

      <p
        data-reveal
        className="relative z-20 mb-10 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-ink-soft)]"
      >
        02 — Lo que hacemos
      </p>

      <div className="relative mx-auto mb-24 max-w-[1400px] md:mb-32">
        {/* Discipline dots scattered behind the headline — plain color, no
            logo mark and no blend-through-the-text effect. */}
        {disciplines.map((d, i) => {
          const color = disciplineColors[d.title];
          return (
            <div
              key={d.title}
              aria-hidden="true"
              className={`absolute z-0 block h-14 w-14 rounded-full transition-transform duration-500 hover:scale-110 sm:h-20 sm:w-20 md:h-32 md:w-32 ${
                // The headline is much shorter on mobile (2 tight lines) than
                // desktop, so reusing the same percentages crammed them on
                // top of each other — mobile gets its own, more spread out
                // positions (allowed to poke slightly outside the text box),
                // desktop keeps the original layout via the md: overrides.
                [
                  "-left-[6%] top-[4%] md:left-[4%] md:top-[18%]",
                  "left-[4%] -bottom-[10%] md:left-[20%] md:bottom-[6%]",
                  "-right-[8%] -bottom-[6%] md:right-[8%] md:bottom-[2%]",
                  "right-[2%] -top-[10%] md:right-[14%] md:top-[10%]",
                  "left-[38%] -top-[18%] md:left-[42%] md:top-[2%]",
                ][i]
              }`}
              style={{
                background: `color-mix(in srgb, ${color} 14%, var(--color-bg))`,
              }}
            />
          );
        })}

        <motion.h2
          style={{ clipPath }}
          className="font-display relative z-10 text-center font-medium uppercase leading-[0.85] tracking-[-0.03em]"
        >
          <span
            className="block"
            style={{ fontSize: "clamp(2.6rem, 12vw, 11rem)" }}
          >
            Cinco rutas
            <br />
            claras
          </span>
        </motion.h2>
      </div>

      <div className="relative z-10 border-t border-[var(--color-line)]">
        {routes.map((route) => (
          <Link
            key={route.index}
            href="/contacto"
            data-reveal
            data-cursor="view"
            className="group relative flex items-center justify-between gap-6 overflow-hidden border-b border-[var(--color-line)] py-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)_auto] md:gap-10 md:py-10"
            style={{ "--hover-text": route.hoverText } as React.CSSProperties}
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0"
              style={{ background: route.accent }}
              aria-hidden="true"
            />

            <span className="relative z-10 flex items-baseline gap-5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4 md:gap-10">
              <span
                className="text-xs font-medium text-[color:var(--route-accent)] transition-colors duration-500 md:font-normal md:text-[var(--color-ink-soft)] group-hover:text-[color:var(--hover-text)] group-hover:opacity-70"
                style={
                  { "--route-accent": route.accent } as React.CSSProperties
                }
              >
                {route.index}
              </span>
              <span className="font-display text-2xl font-medium tracking-tight transition-colors duration-500 group-hover:text-[color:var(--hover-text)] md:text-5xl">
                {route.title}
              </span>
            </span>

            <span className="relative z-10 hidden text-left text-base leading-snug text-[var(--color-ink-soft)] transition-colors duration-500 group-hover:text-[color:var(--hover-text)] md:block">
              {route.description}
            </span>

            <span
              className="relative z-10 text-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--hover-text)]"
              aria-hidden="true"
            >
              ↗
            </span>
          </Link>
        ))}
      </div>

      <div id="diagnostico" data-reveal className="relative z-10 mt-16 scroll-mt-24">
        <div
          className="palette-asher flex flex-col items-center rounded-3xl bg-[var(--color-ink)] px-8 py-12 text-[var(--color-bg)] md:flex-row md:items-center md:gap-8 md:px-12"
        >
          <div className="icsa-inner text-white">
            <span className="icsa-label icsa-reveal">Lo que sigue</span>
            <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Construye con intención.
              <br />
              Crece con confianza.
            </h2>
            <p className="icsa-reveal">
              Toda marca sólida empieza con un diagnóstico claro y una estrategia
              real. Del primer boceto a la ejecución — lo único entre tu marca y
              su siguiente etapa es el trabajo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setClicked(true)}
            data-cursor="expand"
            className="mt-8 inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-bg)] px-17 py-10 text-md font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] transition-transform duration-300 hover:-translate-y-0.5 md:mt-0 md:ml-auto"
          >
            Empezar diagnóstico <span aria-hidden="true">→</span>
          </button>
        </div>

        <AnimatePresence>
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div ref={quizRef} className="scroll-mt-24 pt-16 md:pt-24">
                <DiagnosticoQuiz />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
