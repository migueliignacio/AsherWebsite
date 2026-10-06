/**
 * ASHER's packaged plans, from the internal price sheets (Oct 2026). Item
 * prices are the in-pack prices (lower than buying each service alone);
 * a plan's price is its official total, and a visitor who removes an item
 * gets that item's price taken off (see CartProvider / PlanCustomizer).
 */

export type PlanArea = "Marketing" | "Legal" | "Branding" | "Marca" | "Web";

export interface PlanItem {
  id: string;
  area: PlanArea;
  title: string;
  /** USD before IVA, in-pack price. 0 = included at no extra cost. */
  price: number;
}

export interface Plan {
  id: string;
  name: string;
  audience: string;
  /** Official total in USD before IVA (= the sum of its items). Undefined = "a cotizar". */
  price?: number;
  featured?: boolean;
  items: PlanItem[];
}

/** Which catalog page holds the services a swap can come from, per plan area. */
export const areaCatalog: Record<PlanArea, { slug: string; section?: string }> = {
  Marketing: { slug: "marketing" },
  Legal: { slug: "legal", section: "derecho-empresas" },
  Branding: { slug: "branding" },
  Marca: { slug: "legal", section: "derecho-de-marcas" },
  Web: { slug: "digital-web" },
};

export const planAreas: PlanArea[] = ["Marketing", "Legal", "Branding", "Marca", "Web"];

/**
 * The price sheets list each Branding service at its list price, but the
 * Branding block of every plan is sold for less as a bundle (e.g. Origin:
 * items add up to $530, Branding is $349). Scale the items so they add up to
 * the bundle total exactly — removing one then takes off its fair share.
 * The last item absorbs the rounding so the sum is exact to the cent.
 */
function fitToTotal(total: number, items: PlanItem[]): PlanItem[] {
  const listSum = items.reduce((sum, i) => sum + i.price, 0);
  let assigned = 0;
  return items.map((item, index) => {
    const price =
      index === items.length - 1
        ? Math.round((total - assigned) * 100) / 100
        : Math.round(((item.price * total) / listSum) * 100) / 100;
    assigned += price;
    return { ...item, price };
  });
}

export const plans: Plan[] = [
  {
    id: "origin",
    name: "Asher Origin",
    audience: "Para emprendimientos que nacen: empresa constituida, marca registrada, identidad y presencia digital desde el día uno.",
    price: 2287.25,
    items: [
      { id: "o-mkt-diagnostico", area: "Marketing", title: "Diagnóstico básico 360°", price: 30 },
      { id: "o-mkt-perfil", area: "Marketing", title: "Optimización de perfil", price: 0 },
      { id: "o-mkt-videos", area: "Marketing", title: "Creación de contenido: 4 videos", price: 100 },
      { id: "o-mkt-copy", area: "Marketing", title: "Copywriting comercial", price: 0 },
      { id: "o-mkt-posts", area: "Marketing", title: "6 posts estáticos", price: 35 },
      { id: "o-mkt-historias", area: "Marketing", title: "4 historias semanales (publicadas)", price: 0 },
      { id: "o-mkt-ads", area: "Marketing", title: "Meta Ads básico", price: 50 },

      { id: "o-leg-constitucion", area: "Legal", title: "Constitución Empresarial Express", price: 313 },
      { id: "o-leg-kit", area: "Legal", title: "Kit Legal de Contratos Esenciales", price: 407 },
      { id: "o-leg-permisos", area: "Legal", title: "Gestión de Permisos y Licencias Básicos", price: 367 },

      ...fitToTotal(349, [
        { id: "o-brd-logo", area: "Branding", title: "Logo y 2 variantes", price: 130 },
        { id: "o-brd-paleta", area: "Branding", title: "Paleta y tipografía", price: 130 },
        { id: "o-brd-elementos", area: "Branding", title: "Elementos gráficos básicos", price: 45 },
        { id: "o-brd-esencia", area: "Branding", title: "Esencia y concepto", price: 45 },
        { id: "o-brd-moodboard", area: "Branding", title: "Moodboard y dirección visual", price: 45 },
        { id: "o-brd-guia", area: "Branding", title: "Mini guía de marca", price: 45 },
        { id: "o-brd-diagnostico", area: "Branding", title: "Diagnóstico estratégico", price: 90 },
      ]),

      { id: "o-mar-busqueda", area: "Marca", title: "Búsqueda y Diagnóstico Marcario", price: 169 },
      { id: "o-mar-registro", area: "Marca", title: "Registro de Marca Ecuador", price: 347 },

      { id: "o-web-landing", area: "Web", title: "Landing page básica", price: 80 },
      { id: "o-web-dominio", area: "Web", title: "Dominio .ec (1er año)", price: 40.25 },
      { id: "o-web-dns", area: "Web", title: "Configuración DNS", price: 0 },
      { id: "o-web-ssl", area: "Web", title: "SSL", price: 0 },
      { id: "o-web-seo", area: "Web", title: "SEO inicial", price: 0 },
      { id: "o-web-hosting", area: "Web", title: "Hosting (1er año)", price: 0 },
    ],
  },
  {
    id: "evolution",
    name: "Asher Evolution",
    audience: "Para negocios en marcha que quieren crecer: marketing mensual, blindaje societario y laboral, defensa de marca y web premium.",
    price: 6102,
    featured: true,
    items: [
      { id: "e-mkt-diagnostico", area: "Marketing", title: "Diagnóstico avanzado", price: 50 },
      { id: "e-mkt-investigacion", area: "Marketing", title: "Investigación de mercado básica", price: 25 },
      { id: "e-mkt-videos", area: "Marketing", title: "Creación de contenido: 6 videos (mensual)", price: 115 },
      { id: "e-mkt-posts", area: "Marketing", title: "10 posts estáticos", price: 55 },
      { id: "e-mkt-ads", area: "Marketing", title: "Meta Ads avanzado (mensual)", price: 80 },
      { id: "e-mkt-reporte", area: "Marketing", title: "Reporte Meta Ads (mensual)", price: 0 },

      { id: "e-leg-blindaje", area: "Legal", title: "Blindaje Societario Familiar", price: 840 },
      { id: "e-leg-reforma", area: "Legal", title: "Reforma Estatutaria Inteligente", price: 387 },
      { id: "e-leg-capital", area: "Legal", title: "Aumento de Capital Estratégico", price: 469 },
      { id: "e-leg-parasociales", area: "Legal", title: "Acuerdos Parasociales", price: 863 },
      { id: "e-leg-gobierno", area: "Legal", title: "Protocolo de Gobierno Corporativo", price: 616 },
      { id: "e-leg-laborales", area: "Legal", title: "Blindaje de Contratos Laborales", price: 465 },
      { id: "e-leg-auditoria", area: "Legal", title: "Auditoría Laboral Preventiva", price: 605 },

      ...fitToTotal(599, [
        { id: "e-brd-diagnostico", area: "Branding", title: "Diagnóstico estratégico", price: 90 },
        { id: "e-brd-competencia", area: "Branding", title: "Análisis básico de competencia", price: 45 },
        { id: "e-brd-adn", area: "Branding", title: "ADN, propósito y valores", price: 65 },
        { id: "e-brd-publico", area: "Branding", title: "Definición de público", price: 65 },
        { id: "e-brd-personalidad", area: "Branding", title: "Personalidad de marca", price: 45 },
        { id: "e-brd-posicionamiento", area: "Branding", title: "Posicionamiento", price: 65 },
        { id: "e-brd-tono", area: "Branding", title: "Tono básico", price: 45 },
        { id: "e-brd-concepto", area: "Branding", title: "Concepto estratégico, moodboard y dirección creativa", price: 65 },
        { id: "e-brd-logo", area: "Branding", title: "Logo, variantes e isotipo", price: 130 },
        { id: "e-brd-paleta", area: "Branding", title: "Paleta y tipografía", price: 130 },
        { id: "e-brd-sistema", area: "Branding", title: "Sistema gráfico", price: 90 },
        { id: "e-brd-brandbook", area: "Branding", title: "Brandbook", price: 90 },
        { id: "e-brd-aplicacion", area: "Branding", title: "1 aplicación incluida", price: 35 },
        { id: "e-brd-rondas", area: "Branding", title: "2 rondas de ajustes", price: 90 },
      ]),

      { id: "e-mar-oposicion", area: "Marca", title: "Oposición y Defensa Marcaria", price: 580 },
      { id: "e-mar-vigilancia", area: "Marca", title: "Vigilancia Marcaria Continua", price: 117 },

      { id: "e-web-landing", area: "Web", title: "Landing page premium", price: 194 },
      { id: "e-web-dominio", area: "Web", title: "Dominio .ec (1er año)", price: 42 },
      { id: "e-web-hosting", area: "Web", title: "Hosting (1er año)", price: 0 },
    ],
  },
  {
    id: "prime",
    name: "Asher Prime",
    audience: "Para empresas consolidadas y grupos familiares: gobierno corporativo, holding y compliance, branding integral, protección total de activos intangibles y acompañamiento legal permanente.",
    price: 9436,
    items: [
      { id: "p-mkt-diagnostico", area: "Marketing", title: "Diagnóstico avanzado", price: 50 },
      { id: "p-mkt-investigacion", area: "Marketing", title: "Investigación de mercado básica", price: 25 },
      { id: "p-mkt-videos", area: "Marketing", title: "Creación de contenido: 12 videos (mensual)", price: 180 },
      { id: "p-mkt-posts", area: "Marketing", title: "10 posts estáticos", price: 55 },
      { id: "p-mkt-ads", area: "Marketing", title: "Meta Ads completo (mensual)", price: 95 },
      { id: "p-mkt-reporte", area: "Marketing", title: "Reporte Meta Ads (mensual)", price: 0 },

      { id: "p-leg-secretariado", area: "Legal", title: "Secretariado Societario Mensual", price: 225 },
      { id: "p-leg-manual-holding", area: "Legal", title: "Manual de Gobierno Corporativo para Holding Familiar", price: 1616 },
      { id: "p-leg-diagnostico", area: "Legal", title: "Diagnóstico Societario 360", price: 886 },
      { id: "p-leg-holding", area: "Legal", title: "Holding Patrimonial y de Inversiones", price: 1328 },
      { id: "p-leg-compliance", area: "Legal", title: "Manual de Compliance PYME", price: 766 },
      { id: "p-leg-acompanamiento", area: "Legal", title: "Acompañamiento Legal Permanente", price: 325 },

      ...fitToTotal(949, [
        { id: "p-brd-diagnostico", area: "Branding", title: "Diagnóstico profundizado", price: 130 },
        { id: "p-brd-benchmark", area: "Branding", title: "Benchmark competitivo", price: 90 },
        { id: "p-brd-adn", area: "Branding", title: "ADN, propósito y valores", price: 110 },
        { id: "p-brd-publico", area: "Branding", title: "Definición de público", price: 100 },
        { id: "p-brd-personalidad", area: "Branding", title: "Personalidad y arquetipo", price: 70 },
        { id: "p-brd-posicionamiento", area: "Branding", title: "Posicionamiento, diferenciadores y promesa", price: 110 },
        { id: "p-brd-identidad-verbal", area: "Branding", title: "Identidad verbal y lineamientos", price: 110 },
        { id: "p-brd-concepto", area: "Branding", title: "Concepto estratégico, moodboard y dirección creativa", price: 65 },
        { id: "p-brd-logo", area: "Branding", title: "Logo, variantes e isotipo (si aplica)", price: 195 },
        { id: "p-brd-paleta", area: "Branding", title: "Paleta y tipografía", price: 60 },
        { id: "p-brd-sistema", area: "Branding", title: "Sistema visual integral", price: 130 },
        { id: "p-brd-brandbook", area: "Branding", title: "Brandbook completo", price: 149 },
        { id: "p-brd-packaging", area: "Branding", title: "1 packaging o etiqueta", price: 129 },
        { id: "p-brd-mockups", area: "Branding", title: "Mockups", price: 25 },
        { id: "p-brd-aplicaciones", area: "Branding", title: "2 aplicaciones incluidas", price: 70 },
        { id: "p-brd-plantillas", area: "Branding", title: "3 plantillas editables", price: 75 },
      ]),

      { id: "p-mar-estrategia", area: "Marca", title: "Estrategia Marcaria Integral", price: 653 },
      { id: "p-mar-software", area: "Marca", title: "Protección Legal de Software e IA", price: 810 },
      { id: "p-mar-auditoria", area: "Marca", title: "Auditoría de Activos Intangibles", price: 772 },
      { id: "p-mar-secreto", area: "Marca", title: "Secreto Empresarial y Know-How Shield", price: 701 },

      { id: "p-web-sitio", area: "Web", title: "Sitio web", price: 0 },
    ],
  },
];

export const planById: Record<string, Plan> = Object.fromEntries(plans.map((p) => [p.id, p]));

/** Every plan item by its (globally unique) id, with the plan it belongs to. */
export const planItemById: Record<string, PlanItem & { planId: string }> = Object.fromEntries(
  plans.flatMap((p) => p.items.map((i) => [i.id, { ...i, planId: p.id }]))
);
