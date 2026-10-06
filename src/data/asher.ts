/** Contenido real de ASHER — consultora de crecimiento de marca. */

export const brand = {
  name: "Asher",
  tagline: "Consultora de Crecimiento de Marca",
  disciplines: "Estrategia · Legal · Marketing · Branding",
  heroHeadline: ["Construimos negocios.", "Potenciamos marcas."],
  /** Line under the big ASHER wordmark. */
  heroSub: "Protegemos tu visión. Potenciamos tu impacto.",
  heroIntro:
    "Integramos estrategia, marca, marketing, tecnología y derecho para convertir ideas y empresas en negocios sólidos, visibles y protegidos.",
  email: "contacto@asherconsulting.ec",
  /** Bandejas que reciben las solicitudes del sitio (ver app/api/notify/route.ts). */
  notifyEmails: ["contacto@asherconsulting.ec", "ventas@asherconsulting.ec"],
  phone: "+593 992198798",
  copyright: "© 2026 ASHER",
  socialLinks: {
    instagram:
      "https://www.instagram.com/asherconsulting?stkn=MTY0NTlpOTM1cHNraA==",
    facebook: "https://www.facebook.com/Asherconsult593",
    tiktok: "https://www.tiktok.com/@asherconsulting?_r=1&_t=ZS-99XgCxyAFW9",
    whatsapp: `https://wa.me/593992198798?text=${encodeURIComponent(
      "Hola, quiero agendar una consultoría con ASHER.",
    )}`,
  },
};

export interface Route {
  index: string;
  title: string;
  description: string;
  accent: string;
  /** Label color while the row is filled with its accent on hover. */
  hoverText: string;
}

/** 02 — Lo que hacemos: "Cinco Rutas Claras". */
export const routes: Route[] = [
  {
    index: "01",
    title: "Crear marca",
    description: "Para emprendedores y negocios que arrancan con todo.",
    accent: "#ff4620",
    hoverText: "#0b1956",
  },
  {
    index: "02",
    title: "Mejorar marca",
    description: "Para marcas que ya existen pero merecen verse mejor.",
    accent: "#8b9fd4",
    hoverText: "#0b1956",
  },
  {
    index: "03",
    title: "Publicidad",
    description: "Para negocios que necesitan más clientes y más ventas.",
    accent: "#cfff5c",
    hoverText: "#0b1956",
  },
  {
    index: "04",
    title: "Digitalización",
    description:
      "Para quienes necesitan presencia digital o herramientas tech.",
    accent: "#3d3bff",
    hoverText: "#ffffff",
  },
  {
    index: "05",
    title: "Blindaje legal",
    description: "Respaldo legal como base de todo lo que construyes.",
    accent: "#0b1956",
    hoverText: "#ffffff",
  },
];

export interface Phase {
  index: string;
  title: string;
  description: string;
}

/** 03 — Cómo trabajamos: "Diagnóstico. Estrategia. Ejecución." */
export const phases: Phase[] = [
  {
    index: "01",
    title: "Diagnóstico",
    description: "Entendemos tu marca, tu mercado y tu punto de partida real.",
  },
  {
    index: "02",
    title: "Estrategia",
    description:
      "Diseñamos un plan de marca, comunicación y crecimiento a la medida.",
  },
  {
    index: "03",
    title: "Ejecución",
    description:
      "Implementamos con rigor: diseño, contenido, campañas y desarrollo.",
  },
  {
    index: "04",
    title: "Blindaje",
    description:
      "Registro de marca, contratos y cumplimiento legal desde el inicio.",
  },
  {
    index: "05",
    title: "Seguimiento",
    description:
      "Medimos los resultados, analizamos y ajustamos mediante estrategias focalizadas.",
  },
  {
    index: "06",
    title: "Crecimiento",
    description:
      "Tu marca evoluciona; nosotros seguimos a tu lado en cada etapa.",
  },
];

export interface Discipline {
  title: string;
  description: string;
  accent: string;
}

/** 05 — Cinco disciplinas centrales. */
export const disciplines: Discipline[] = [
  {
    title: "Estrategia",
    description:
      "Diagnóstico y ruta clara antes de mover un solo elemento de tu marca.",
    accent: "var(--color-accent)",
  },
  {
    title: "Marca",
    description: "Identidad visual y de negocio que se sostiene en el tiempo.",
    accent: "var(--color-lavender)",
  },
  {
    title: "Digital",
    description:
      "Presencia web, automatizaciones y campañas que sí convierten.",
    accent: "var(--color-accent-2)",
  },
  {
    title: "Publicidad",
    description: "Campañas que se miden en clientes, no en likes.",
    accent: "var(--color-accent-3)",
  },
  {
    title: "Legal",
    description:
      "Registro y blindaje para que lo que construyes sea tuyo de verdad.",
    accent: "var(--color-violet)",
  },
];

export interface Stat {
  value: string;
  label: string;
}

/** 04 — Nuestra visión: "Un mañana Mejor, Juntos". */
export const stats: Stat[] = [
  {
    value: "100+",
    label: "Empresas asesoradas en branding, marketing y materia legal.",
  },
  {
    value: "5",
    label: "Disciplinas centrales bajo un mismo techo, un solo equipo.",
  },
  {
    value: "Día 1",
    label: "Respaldo legal desde el inicio, no como paso final.",
  },
];

export interface Tier {
  id: string;
  name: string;
  /** MXN. Undefined until pricing is set; the cart shows "A cotizar". */
  price?: number;
  audience: string;
  includes: string[];
  featured?: boolean;
}

export const tiers: Tier[] = [
  {
    id: "emprende",
    name: "ASHER Emprende",
    audience: "Freelancers, startups y fundaciones.",
    includes: [
      "Naming e identidad de marca",
      "Logo, paleta y manual de uso básico",
      "Presencia digital inicial",
      "Blindaje legal esencial (registro de marca)",
    ],
  },
  {
    id: "pyme",
    name: "ASHER PYME",
    audience: "Empresas formalizadas con menos de 70 colaboradores.",
    featured: true,
    includes: [
      "Todo lo de ASHER Emprende",
      "Estrategia de marketing y publicidad con seguimiento",
      "Herramientas digitales y automatizaciones a medida",
      "Blindaje legal integral (contratos, políticas, cumplimiento)",
      "Retainer mensual con un solo punto de contacto",
    ],
  },
  {
    id: "corporativo",
    name: "ASHER Corporativo",
    audience:
      "Empresas de 70+ colaboradores, sector público y grupos empresariales.",
    includes: [
      "Todo lo de ASHER PYME",
      "Equipo dedicado y tiempos de respuesta prioritarios",
      "Estructura corporativa y operaciones M&A",
      "Cumplimiento regulatorio avanzado",
      "Reportes ejecutivos y KPIs a medida",
    ],
  },
];

/** Propuestas de valor repetidas a lo largo del sitio. */
export const valueProps = [
  "Todo bajo un mismo techo",
  "Construimos para crecer",
  "Con blindaje desde el principio",
  "Estrategia que se ejecuta",
];
