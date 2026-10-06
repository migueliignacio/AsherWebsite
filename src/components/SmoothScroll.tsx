"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones and tablets already scroll smoothly (and Lenis never smooths
    // touch anyway); skipping it there saves a per-frame loop that made
    // phones stutter. Anchor links fall back to the browser.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "";
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Landing on a URL with a hash (e.g. a mega menu link followed from
    // another page) fights the same problem, twice over: the browser jumps
    // to the target before this page's JS-sized sections (the
    // inversion-circle scroll track measures its own height in an effect,
    // and pinned sections insert a pin-spacer that grows the page) have
    // settled, so the native jump lands short and then drifts further as
    // more of them finish. Re-land a few times as things stabilize instead
    // of guessing a single "safe" delay.
    const hashTimeouts: number[] = [];
    if (window.location.hash) {
      const hash = window.location.hash;
      [300, 700, 1200].forEach((delay) => {
        hashTimeouts.push(
          window.setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) lenis.scrollTo(target as HTMLElement, { offset: -24, immediate: true });
          }, delay)
        );
      });
    }

    // Let in-page anchors (the sticky pill nav, the mega menu) route through
    // Lenis. Anchors may be plain "#id" or "/#id" (mega menu links work from
    // any route, so they point at "/#id"); only intercept when the hash
    // target actually lives on the page we're already on — otherwise let the
    // browser navigate there first.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const hashIndex = href.indexOf("#");
      const hash = href.slice(hashIndex);
      if (hash === "#") return;
      const path = href.slice(0, hashIndex);
      const onThisPage = path === "" || path === window.location.pathname;
      if (!onThisPage) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      hashTimeouts.forEach((t) => window.clearTimeout(t));
      lenis.destroy();
    };
  }, []);

  return null;
}
