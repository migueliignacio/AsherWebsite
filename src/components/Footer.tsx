"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  WhatsappIcon,
} from "./SocialIcons";
import { brand } from "@/data/asher";
import { useSubscribe } from "@/lib/use-subscribe";

const SOCIAL_LINKS = [
  {
    icon: InstagramIcon,
    href: brand.socialLinks.instagram,
    label: "Instagram",
  },
  { icon: FacebookIcon, href: brand.socialLinks.facebook, label: "Facebook" },
  { icon: TiktokIcon, href: brand.socialLinks.tiktok, label: "TikTok" },
  { icon: WhatsappIcon, href: brand.socialLinks.whatsapp, label: "WhatsApp" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Footer() {
  const subscribe = useSubscribe("Newsletter (pie de página)");

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative overflow-hidden bg-[var(--color-violet)] text-[var(--color-bg)]"
    >
      <motion.div
        className="grid gap-12 px-5 pb-16 pt-20 md:grid-cols-12 md:gap-10 md:px-10 md:pb-20 md:pt-24"
        variants={containerVariants}
      >
        <motion.div
          className="space-y-5 text-sm leading-relaxed text-[var(--color-bg)]/80 md:col-span-4"
          variants={itemVariants}
        >
          <div className="relative h-12 w-12">
            <Image
              src="/asher/logos/logo-beige.webp"
              alt="ASHER"
              fill
              className="object-contain"
            />
          </div>
          <p className="font-medium text-[var(--color-bg)]">{brand.tagline}</p>
          <p>
            Consultora integral de marca, marketing, tecnología y protección
            legal. Construimos, mejoramos, digitalizamos y protegemos marcas —
            todo bajo un mismo techo.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {brand.disciplines.split(" · ").map((d) => (
              <span
                key={d}
                className="rounded-full border border-[var(--color-bg)]/25 px-3 py-1.5 text-xs"
              >
                {d}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="space-y-8 text-sm md:col-span-3 md:col-start-6"
          variants={itemVariants}
        >
          <div>
            <h2 className="mb-2 font-medium">Contacto</h2>
            <p className="leading-relaxed text-[var(--color-bg)]/70">
              <a
                href={`mailto:${brand.email}`}
                data-cursor="expand"
                className="hover:text-[var(--color-bg)]"
              >
                {brand.email}
              </a>
            </p>
            <p className="leading-relaxed text-[var(--color-bg)]/70">
              <a
                href={`numerito:${brand.phone}`}
                data-cursor="expand"
                className="hover:text-[var(--color-bg)]"
              >
                {brand.phone}
              </a>
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-medium">Conecta</h2>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  data-cursor="expand"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-bg)]/40 text-sm transition-colors duration-300 hover:bg-[var(--color-bg)] hover:text-[var(--color-violet)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-2 text-[var(--color-bg)]/70">
            <Link
              href="/privacidad"
              data-cursor="expand"
              className="hover:text-[var(--color-bg)]"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/terminos"
              data-cursor="expand"
              className="hover:text-[var(--color-bg)]"
            >
              Términos de Uso
            </Link>
            <Link
              href="/contacto"
              data-cursor="expand"
              className="hover:text-[var(--color-bg)]"
            >
              Contacto
            </Link>
          </nav>
        </motion.div>

        <motion.div
          className="text-sm md:col-span-4 md:col-start-9"
          variants={itemVariants}
        >
          <h2 className="mb-3">
            <span className="font-medium">Mantente cerca — </span>
            <span className="text-[var(--color-bg)]/70">
              de vez en cuando enviamos notas sobre marca, crecimiento y
              blindaje legal.
            </span>
          </h2>

          <form onSubmit={subscribe.onSubmit} className="mt-5 flex items-center gap-2 rounded-full bg-[var(--color-violet-deep)] p-1.5 pl-5">
            <label htmlFor="footer-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              disabled={subscribe.status === "done" || subscribe.status === "sending"}
              placeholder={subscribe.status === "done" ? "¡Gracias! Ya estás en la lista." : "Correo electrónico"}
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--color-bg)]/45"
            />
            <button
              type="submit"
              disabled={subscribe.status === "done" || subscribe.status === "sending"}
              data-cursor="expand"
              className="shrink-0 rounded-full bg-[var(--color-bg)]/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-300 hover:bg-[var(--color-bg)] hover:text-[var(--color-violet)] disabled:opacity-60"
            >
              {subscribe.status === "sending" ? "Enviando…" : subscribe.status === "done" ? "Listo ✓" : "Unirme"} <span aria-hidden="true">→</span>
            </button>
          </form>
          {subscribe.status === "error" && (
            <p className="mt-2 text-xs text-[var(--color-bg)]/70">No pudimos registrarte. Intenta de nuevo.</p>
          )}
        </motion.div>
      </motion.div>

      <div className="relative z-10 flex flex-col gap-2 px-5 pb-10 text-xs text-[var(--color-bg)]/55 md:flex-row md:items-center md:justify-between md:px-10 md:pb-10">
        <p>{brand.copyright}</p>
        <p>{brand.disciplines}</p>
      </div>
    </motion.footer>
  );
}
