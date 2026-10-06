"use client";

/**
 * InversionCircleScrollAnimation
 *
 * Scroll-driven animation merged from:
 *   +page.svelte                  → hero circle animation
 *   ContentSection.svelte         → scroll-reveal section
 *   Button.svelte                 → CTA button
 *
 * How it works:
 *   Unlike the original standalone version (which used its own nested
 *   overflow-y:scroll wrapper as the scroll container), this build is
 *   adapted to run on the page's own document/window scroll, so it can
 *   sit inline among the rest of ASHER's sections instead of opening a
 *   scrollbox-within-a-page. The 300vh scroll track lives directly in
 *   normal document flow; the hero section is sticky inside that track,
 *   so it stays pinned while the track scrolls past under native scroll
 *   (Lenis-smoothed, same as the rest of the site).
 *
 *   Phase 1 (scroll 0→viewH):
 *     A black circle rises from below the screen to dead-centre.
 *     Easing: Power4 InOut (slow → fast → slow).
 *
 *   Phase 2 (scroll viewH→2×viewH):
 *     The circle expands from 380px diameter until it fills the screen.
 *     Easing: ease-in² (accelerates as it grows).
 *
 *   A CSS clip-path mirrors the circle position exactly, revealing
 *   white text inside the black circle → colour inversion effect.
 *
 *   Below the hero a ContentSection fades in (black→white background)
 *   when 35% of it enters the viewport.
 */

import { useEffect, useRef, useState } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const BALL_SIZE = 380; // px — fixed diameter during Phase 1 travel

// ─── root export ──────────────────────────────────────────────────────────────
export default function InversionCircleScrollAnimation() {
  return (
    <>
      <Styles />
      <div className="icsa-wrap">
        <HeroSection />
      </div>
    </>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(800);
  const [viewW, setViewW] = useState(1200);

  useEffect(() => {
    const measure = () => {
      setViewH(window.innerHeight);
      setViewW(window.innerWidth);
    };
    // Scroll events fire many times per frame on phones; read layout at most
    // once per frame, and clamp past the animation's end (2 × viewport) so
    // scrolling the rest of the page doesn't re-render this section at all.
    let frame = 0;
    const read = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const max = 2 * window.innerHeight + 2;
      setScrollY(Math.round(Math.min(max, Math.max(0, -track.getBoundingClientRect().top))));
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    measure();
    read();

    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // phase progress 0 → 1
  const p1 = clamp(scrollY / viewH);
  const p2 = clamp((scrollY - viewH) / viewH);

  // Power4 InOut
  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  // ease-in²
  const p2e = p2 * p2;

  // geometry
  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <div ref={trackRef} className="icsa-track">
      <section className="icsa-hero">
        {/* expanding black circle — fixed-size box, scaled via transform only
            (never resized via width/height) so the browser never has to
            rasterize/relayout an ever-growing multi-thousand-pixel box. */}
        <div
          className="icsa-ball"
          style={{
            transform: `translate(-50%, calc(-50% + ${yOff}px)) scale(${ballSize / BALL_SIZE})`,
          }}
        />

        {/* black text — always visible */}
        <div className="icsa-layer icsa-dark">
          <h1>Diseño con dirección.</h1>
          <p>Desliza para descubrir más.</p>
        </div>

        {/* white text — clipped to the circle (inversion) */}
        <div
          className="icsa-layer icsa-light"
          style={{ clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)` }}
        >
          <h1>Diseño con dirección.</h1>
          <p>Desliza para descubrir más.</p>
        </div>
      </section>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── styles ───────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      .icsa-wrap *, .icsa-wrap *::before, .icsa-wrap *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      /* participates in normal document scroll — no nested scrollbox */
      .icsa-wrap {
        width: 100%; position: relative;
        font-family: Inter, sans-serif;
        background: #ffffff;
      }

      /* 300 vh scroll room; hero sticks inside */
      .icsa-track { height: 300vh; position: relative; }

      /* pinned hero */
      .icsa-hero {
        position: sticky; top: 0;
        height: 100vh; overflow: hidden;
      }

      /* ball — fixed intrinsic size; grows only via transform: scale() */
      .icsa-ball {
        position: absolute; top: 50%; left: 50%;
        width: 380px; height: 380px;
        border-radius: 50%; background: #0b1956;
        will-change: transform;
      }

      /* text layers */
      .icsa-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        text-align: center; padding: 0 2rem;
        pointer-events: none;
      }
      .icsa-dark  { color: #0b1956; z-index: 2; }
      .icsa-light { color: #ffffff; z-index: 3; will-change: clip-path; }

      .icsa-layer h1 {
        font-size: clamp(2.5rem, 7vw, 6rem);
        font-weight: 900; letter-spacing: -0.03em; line-height: 1.05;
      }
      .icsa-layer p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 400; margin-top: 1.25rem; opacity: .7;
      }
    `}</style>
  );
}
