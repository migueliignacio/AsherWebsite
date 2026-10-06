"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Smartphone, Globe, Scale, CheckCircle2, Megaphone } from "lucide-react";

function TypeTester() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.5 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.span
        className="font-serif text-6xl md:text-8xl text-white font-medium"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Aa
      </motion.span>
    </div>
  );
}

function LayoutAnimation() {
  const [layout, setLayout] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const layouts = ["grid-cols-2", "grid-cols-3", "grid-cols-1"];

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        className={`grid ${layouts[layout]} gap-1.5 w-full max-w-[140px] h-full`}
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-white/20 rounded-md h-5 w-full"
            layout
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * A card's description: the first two lines, plus "Leer más" when there is
 * more, so text is never cut mid-sentence by the card's height.
 */
function CardDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <>
      <p ref={ref} className={`text-[#a9b4d6] text-sm mt-1 ${expanded ? "" : "line-clamp-2"}`}>
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          data-cursor="expand"
          className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-white underline-offset-4 hover:underline"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </>
  );
}

function SpeedIndicator({ value }: { value: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="h-8 w-24 bg-white/10 rounded"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              exit={{ opacity: 0, y: -20, position: "absolute" }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <motion.span
              key="text"
              initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              className="text-3xl md:text-4xl font-sans font-medium text-white"
            >
              {value}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
        />
      </div>
    </div>
  );
}

function SecurityBadge() {
  const [shields, setShields] = useState([
    { id: 1, active: false },
    { id: 2, active: false },
    { id: 3, active: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShields((prev) => {
        const nextIndex = prev.findIndex((s) => !s.active);
        if (nextIndex === -1) {
          return prev.map(() => ({ id: Math.random(), active: false }));
        }
        return prev.map((s, i) => (i === nextIndex ? { ...s, active: true } : s));
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full gap-2">
      {shields.map((shield) => (
        <motion.div
          key={shield.id}
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            shield.active ? "bg-white/20" : "bg-white/5"
          }`}
          animate={{ scale: shield.active ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Lock className={`w-5 h-5 ${shield.active ? "text-white" : "text-[#5b6795]"}`} />
        </motion.div>
      ))}
    </div>
  );
}

function GlobalNetwork() {
  const [pulses] = useState([0, 1, 2, 3, 4]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Globe className="w-16 h-16 text-white/80 z-10" />
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          className="absolute w-16 h-16 border-2 border-white/30 rounded-full"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: pulse * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Scales of justice, gently tipping side to side — for a legal "clear contracts" slot. */
export function LegalBalance() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <Scale className="h-16 w-16 text-white" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}

/** A short checklist ticking itself off, one item at a time, then resetting. */
export function LegalChecklist() {
  const items = ["Constitución", "Contratos", "Marca"];
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecked((prev) => (prev + 1) % (items.length + 1));
    }, 900);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="flex h-full flex-col items-start justify-center gap-3 px-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-2.5">
          <CheckCircle2 className={`h-5 w-5 shrink-0 transition-colors duration-300 ${i < checked ? "text-white" : "text-white/20"}`} />
          <span className={`text-sm transition-colors duration-300 ${i < checked ? "text-white" : "text-[#5b6795]"}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

/** A megaphone with sound-wave rings — for a marketing "messages that stand out" slot. */
export function MarketingMegaphone() {
  const pulses = [0, 1, 2];
  return (
    <div className="relative flex h-full items-center justify-center">
      <Megaphone className="z-10 h-14 w-14 text-white" strokeWidth={1.5} />
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          className="absolute h-14 w-14 rounded-full border-2 border-white/30"
          initial={{ scale: 0.6, opacity: 1 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, delay: pulse * 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export interface BentoCard {
  title: string;
  description: string;
}

export interface BentoGridProps {
  eyebrow?: string;
  /** Exactly 6 cards, mapped positionally to the same layout as the original. */
  cards: [BentoCard, BentoCard, BentoCard, BentoCard, BentoCard, BentoCard];
  speedValue?: string;
  className?: string;
  /** Overrides for the first two slots' decorative visual (defaults: "Aa" type sample, reflowing grid). */
  visual1?: React.ReactNode;
  visual2?: React.ReactNode;
}

export default function BentoGrid({ eyebrow = "Features", cards, speedValue = "100ms", className, visual1, visual2 }: BentoGridProps) {
  const [c1, c2, c3, c4, c5, c6] = cards;

  return (
    <section className={`bg-[#060e2e] px-6 py-24 ${className ?? ""}`}>
      <div className="max-w-7xl w-full mx-auto">
        <motion.p
          className="text-[#a9b4d6] text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {eyebrow}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
          <motion.div
            className="md:col-span-2 md:row-span-2 bg-[#0b1956] border border-[#26346f] rounded-xl p-8 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(31, 47, 115, 1)" }}
          >
            <div className="flex-1">
              {visual1 ?? <TypeTester />}
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-white font-medium">{c1.title}</h3>
              <CardDescription text={c1.description} />
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 bg-[#0b1956] border border-[#26346f] rounded-xl p-8 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              {visual2 ?? <LayoutAnimation />}
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-white font-medium">{c2.title}</h3>
              <CardDescription text={c2.description} />
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 md:row-span-2 bg-[#0b1956] border border-[#26346f] rounded-xl p-6 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <GlobalNetwork />
              </div>
            </div>
            <div className="mt-auto relative z-20 bg-[#0b1956]/50 backdrop-blur-sm rounded-lg p-2">
              <h3 className="font-serif text-xl text-white flex items-center gap-2 font-medium">
                <Globe className="w-5 h-5" />
                {c3.title}
              </h3>
              <CardDescription text={c3.description} />
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 bg-[#0b1956] border border-[#26346f] rounded-xl p-8 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <SpeedIndicator value={speedValue} />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-white font-medium">{c4.title}</h3>
              <CardDescription text={c4.description} />
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-3 bg-[#0b1956] border border-[#26346f] rounded-xl p-8 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <SecurityBadge />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-white flex items-center gap-2 font-medium">
                <Lock className="w-5 h-5" />
                {c5.title}
              </h3>
              <CardDescription text={c5.description} />
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-3 bg-[#0b1956] border border-[#26346f] rounded-xl p-8 flex flex-col hover:border-[#3d4d8f] transition-colors cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1 flex items-center justify-center">
              <Smartphone className="w-16 h-16 text-white" />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-white font-medium">{c6.title}</h3>
              <CardDescription text={c6.description} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
