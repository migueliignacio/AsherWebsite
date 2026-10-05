export interface ServiceAddon {
  id: string;
  title: string;
  /** Full detail, shown when the visitor opens "Detalles". */
  description: string;
  /** USD, before IVA. */
  price: number;
  /** Billing unit when it isn't a one-off ("mes", "año", "hora", "página"). */
  unit?: string;
  /** True when `price` is a starting price ("desde"). */
  priceFrom?: boolean;
  /** Sub-heading inside a catalog; consecutive items with the same category are grouped. */
  category?: string;
}

/** A distinct area inside a service, with its own copy and catalog (e.g. Legal). */
export interface ServiceSection {
  id: string;
  label: string;
  title: string;
  description: string;
  highlights: string[];
  accent: string;
  onAccent: string;
  items: ServiceAddon[];
  /** Fine print under the catalog. */
  note?: string;
}

export interface ServiceCatalogEntry {
  slug: string;
  label: string;
  /** One-line summary for the /servicios hub. */
  blurb: string;
  accent: string;
  /** Text color that reads on top of `accent`. */
  onAccent: string;
  /** Flat list of every add-on (for a sectioned service, the union of its sections). */
  items: ServiceAddon[];
  sections?: ServiceSection[];
  /** Fine print under the catalog. */
  note?: string;
}

const legalNote =
  "Los precios corresponden a los honorarios profesionales de ASHER. No incluyen tasas, impuestos, derechos, gastos notariales, registrales, administrativos, periciales, publicaciones, traducciones, certificaciones, movilización ni otros valores cobrados por terceros o entidades públicas, que serán asumidos por el cliente cuando corresponda. Algunos servicios pueden requerir costos adicionales según el caso; ASHER los informará previamente.";

// Single catalog behind the cart: shown on each /servicios/[area] page and,
// all together, in "Arma tu propio pack" on /planes.
const legalSections: ServiceSection[] = [
  {
    id: "derecho-empresas",
    label: "Derecho de empresas",
    title: "Tu empresa, bien constituida y protegida",
    description:
      "Estructura legal, contratos y cumplimiento para que tu negocio opere con orden y crezca sin sobresaltos.",
    highlights: [
      "Constitución y estructura societaria",
      "Contratos, compliance y gobierno corporativo",
      "Acompañamiento legal permanente",
    ],
    accent: "#7d1a1f",
    onAccent: "#ffffff",
    note: legalNote,
    items: [
      { id: "leg-01", category: "Para empezar", title: "Constitución Empresarial Express", price: 391.25, description: "Convertimos tu idea de negocio en una empresa legalmente constituida de forma ágil y correcta. Tú nos cuentas qué quieres hacer y con quién; nosotros nos encargamos de la razón social, el capital, los estatutos, la firma electrónica y el registro ante la Superintendencia de Compañías, así como de los balances iniciales y las declaraciones iniciales ante el SRI, hasta entregarte tu RUC y tu compañía lista para operar." },
      { id: "leg-02", category: "Para empezar", title: "Blindaje Societario Familiar", price: 1050, description: "Formalizamos y ordenamos tu negocio familiar para que la empresa y las relaciones entre sus miembros estén claras desde el inicio. Definimos cómo se toman decisiones, quién puede entrar o salir y qué pasa frente a situaciones como una sucesión o un cambio en la participación de uno de los socios. Además, constituimos la sociedad y dejamos documentadas estas reglas en un protocolo familiar diseñado para tu familia y tu negocio." },
      { id: "leg-03", category: "Para empezar", title: "Constitución para Inversión Extranjera", price: 896.25, description: "¿Quieres invertir o abrir una empresa en Ecuador desde el exterior? Te acompañamos en todo el proceso: definimos la estructura societaria, preparamos los poderes y documentos necesarios, coordinamos apostillas y traducciones cuando correspondan y gestionamos la constitución, el registro de la inversión y la obtención del RUC. Así puedes establecer tu operación en Ecuador con un proceso claro, acompañado y adaptado a tu situación." },
      { id: "leg-13", category: "Para empezar", title: "Diagnóstico Societario 360", price: 1107.5, description: "Hacemos un chequeo médico completo a tu empresa. Revisamos todo lo legal de punta a punta y te entregamos un mapa claro de qué está bien, qué está en riesgo y qué debes corregir, con prioridades y costos estimados, para que tomes decisiones informadas en vez de sorpresas costosas." },
      { id: "leg-17", category: "Para empezar", title: "Kit Legal de Contratos Esenciales", price: 508.75, description: "Te entregamos el set de contratos que tu negocio necesita para operar con respaldo legal real: prestación de servicios, confidencialidad, proveedores y el que tu actividad requiera, redactados a tu medida y listos para usar una y otra vez." },

      { id: "leg-04", category: "Estrategia y crecimiento", title: "Spin-off y Escisión de Unidad de Negocio", price: 1937.5, description: "¿Tu empresa tiene varias líneas de negocio y quieres separarlas? Diseñamos y ejecutamos la estructura legal necesaria para que una unidad pueda operar de forma independiente, con sus propios activos, contratos y organización. Es una alternativa para incorporar nuevos socios en una línea específica, preparar una unidad para su venta, ordenar la sucesión familiar o separar los riesgos entre diferentes actividades del negocio." },
      { id: "leg-06", category: "Estrategia y crecimiento", title: "Aumento de Capital Estratégico", price: 586.25, description: "¿Tu empresa va a recibir una nueva inversión, incorporar un socio o accionista, o capitalizar sus utilidades? Estructuramos el aumento de capital para que la entrada de nuevos recursos y su impacto en la participación de los socios o accionistas queden correctamente definidos y documentados. Preparamos la documentación y gestionamos el trámite hasta su inscripción ante las entidades correspondientes." },
      { id: "leg-07", category: "Estrategia y crecimiento", title: "Fusión y Adquisición", price: 3725, description: "¿Tu empresa está por fusionarse con otra o adquirir un nuevo negocio? Te acompañamos en el proceso, desde la revisión de la empresa involucrada y la identificación de riesgos hasta la negociación, documentación y formalización de la operación. Preparamos y gestionamos la documentación necesaria para llevar la transacción hasta su cierre." },
      { id: "leg-09", category: "Estrategia y crecimiento", title: "Acuerdos Parasociales", price: 1078.75, description: "¿Los socios o accionistas de tu compañía quieren definir desde ahora cómo tomarán decisiones, quién puede salir y qué ocurrirá ante situaciones que puedan afectar al negocio? Elaboramos un acuerdo que establece estas reglas y complementa los estatutos de la empresa, y acompañamos a los socios en su revisión, negociación y firma para darle eficacia legal." },
      { id: "leg-10", category: "Estrategia y crecimiento", title: "Protocolo de Gobierno Corporativo", price: 770, description: "Profesionalizamos la forma en que tu empresa toma decisiones. Diseñamos un sistema simple pero robusto de gobierno corporativo que te abre puertas con bancos, inversionistas y clientes corporativos que exigen estándares profesionales." },
      { id: "leg-12", category: "Estrategia y crecimiento", title: "Manual de Gobierno Corporativo para Holding Familiar", price: 2020, description: "Diseñamos la arquitectura de gobierno de tu grupo empresarial familiar: cómo se coordinan las decisiones entre tus distintas empresas, cómo participa cada generación y cómo se prepara el holding para seguir creciendo unido en lugar de fragmentarse." },
      { id: "leg-15", category: "Estrategia y crecimiento", title: "Holding Patrimonial y de Inversiones", price: 1660, description: "Creamos la estructura que separa tu patrimonio personal de tus negocios. Un holding bien diseñado protege lo que has construido, simplifica la administración de múltiples activos y deja todo listo para que tus herederos reciban un legado ordenado, no un problema legal." },
      { id: "leg-16", category: "Estrategia y crecimiento", title: "Manual de Compliance PYME", price: 957.5, description: "Te ayudamos a cumplir con las reglas que tus clientes más grandes te exigen. Diseñamos un sistema de compliance simple y funcional para el tamaño de tu empresa, que te permite calificar como proveedor confiable sin la complejidad ni el costo de un departamento de compliance corporativo." },

      { id: "leg-05", category: "Trámites y contratos puntuales", title: "Reforma Estatutaria Inteligente", price: 483.75, description: "Tu empresa cambia; sus reglas también deberían hacerlo. Actualizamos tus estatutos para que acompañen la realidad de tu negocio y puedas realizar nuevos cambios, actividades o estructuras administrativas con una base societaria adecuada. Nos encargamos de la documentación y la redacción hasta su inscripción." },
      { id: "leg-08", category: "Trámites y contratos puntuales", title: "Disolución, Liquidación y Cancelación", price: 770, description: "¿Tu empresa ya no está operando y quieres cerrarla formalmente? Revisamos su situación y nos encargamos de preparar y gestionar la documentación necesaria para su disolución, liquidación y cancelación." },
      { id: "leg-14", category: "Trámites y contratos puntuales", title: "Due Diligence", price: 2300, description: "Revisamos a fondo la empresa que estás por comprar para que sepas exactamente qué estás adquiriendo. Identificamos riesgos, pasivos ocultos y banderas rojas antes de que firmes, dándote argumentos sólidos para negociar el precio o las condiciones de cierre." },
      { id: "leg-18", category: "Trámites y contratos puntuales", title: "Contrato SaaS y Tecnológico a Medida", price: 702.5, description: "Redactamos los contratos que protegen tu producto tecnológico y tu negocio: términos de servicio, acuerdos de nivel de servicio y licencias que dejan claro qué vendes, qué no garantizas y cómo proteges tu código y tu marca frente a tus clientes." },
      { id: "leg-19", category: "Trámites y contratos puntuales", title: "Contrato de Franquicia Llave en Mano", price: 490, description: "Convertimos tu negocio exitoso en un modelo de franquicia replicable y legalmente protegido, o te ayudamos a entender y negociar el contrato de franquicia que estás por firmar, para que tomes la decisión con toda la información legal sobre la mesa." },
      { id: "leg-20", category: "Trámites y contratos puntuales", title: "Blindaje de Contratos Laborales", price: 581.25, description: "Actualizamos y blindamos los contratos de tu equipo para que cumplan con la ley ecuatoriana y, además, protejan tu información confidencial y la propiedad intelectual de lo que tu equipo crea para tu negocio. Tranquilidad laboral de verdad." },
      { id: "leg-21", category: "Trámites y contratos puntuales", title: "Gestión Integral de Permisos y Licencias", price: 458.75, description: "Nos encargamos de los permisos que tu negocio necesita para operar sin sobresaltos: patente municipal, permiso de bomberos, permiso sanitario y lo que tu actividad requiera. Tú te enfocas en operar; nosotros, en que tengas todo en regla." },
      { id: "leg-23", category: "Trámites y contratos puntuales", title: "Auditoría Laboral Preventiva", price: 756.25, description: "Revisamos el cumplimiento laboral de tu empresa antes de que el Ministerio del Trabajo o un exempleado lo hagan por ti. Te entregamos un diagnóstico claro de riesgos laborales con un plan de corrección, para que duermas tranquilo sabiendo que tu equipo está en regla." },

      { id: "leg-11", category: "Acompañamiento mensual", title: "Secretariado Societario Mensual", price: 281.25, unit: "mes", description: "Nos convertimos en el secretario societario de tu empresa: documentamos cada decisión relevante, mantenemos tus libros societarios al día y te avisamos antes de cada plazo legal importante, para que te dediques a operar el negocio sin preocuparte del papeleo." },
      { id: "leg-22", category: "Acompañamiento mensual", title: "Acompañamiento Legal Permanente (Membresía ASHER)", price: 406.25, unit: "mes", description: "Te convertimos en cliente preferente de ASHER: tienes a tu abogado de confianza a una llamada o mensaje de distancia, todos los meses, sin sorpresas en la factura. Resolvemos tus dudas legales del día a día y revisamos lo que necesites, para que nunca más tomes una decisión importante sin respaldo legal." },
    ],
  },
  {
    id: "derecho-de-marcas",
    label: "Derecho de marcas",
    title: "Tu marca, registrada y a salvo",
    description:
      "Registro, defensa y gestión de tu propiedad intelectual: que el nombre que construyes sea tuyo de verdad.",
    highlights: [
      "Búsqueda y registro de marca ante el SENADI",
      "Derechos de autor, software e IA",
      "Vigilancia y defensa de tu marca",
    ],
    accent: "#0b1956",
    onAccent: "#ffffff",
    note: legalNote,
    items: [
      { id: "mar-01", category: "Para empezar", title: "Búsqueda y Diagnóstico Marcario", price: 211.25, description: "Antes de enamorarte de un nombre, verificamos si puedes usarlo legalmente. Hacemos la búsqueda completa en el SENADI, te decimos si ya hay marcas similares que puedan bloquearte y te entregamos un dictamen claro sobre si vale la pena seguir adelante con ese nombre o si es mejor buscar una alternativa ahora, cuando el cambio todavía es barato." },
      { id: "mar-02", category: "Para empezar", title: "Registro de Marca Ecuador", price: 433.75, description: "Registramos tu marca ante el SENADI para que sea tuya legalmente. Una vez registrada, tienes el derecho exclusivo de usarla en Ecuador y la herramienta legal para actuar contra quien la copie o use sin tu permiso. Tu marca es uno de tus activos más valiosos: protégela." },
      { id: "mar-06", category: "Para empezar", title: "Registro de Derecho de Autor", price: 291.25, description: "Registramos legalmente las obras que creas: tu libro, tu curso, tu software, tu música o tu contenido digital. El registro te da la prueba oficial de que eres el autor y la herramienta para actuar contra quien lo copie o use sin tu permiso." },

      { id: "mar-03", category: "Defensa y vigilancia", title: "Oposición y Defensa Marcaria", price: 725, description: "Defendemos tu marca cuando alguien intenta registrar algo parecido, o cuando alguien se opone a tu propio registro. Actuamos dentro de los plazos legales con argumentos sólidos para proteger tus derechos marcarios ante el SENADI." },
      { id: "mar-04", category: "Defensa y vigilancia", title: "Vigilancia Marcaria Continua", price: 146.25, unit: "mes", description: "Vigilamos tu marca mientras tú haces tu negocio. Monitoreamos cada publicación del SENADI y te avisamos de inmediato cuando detectamos una solicitud que podría amenazar tu marca, para que puedas actuar a tiempo y dentro del plazo legal." },

      { id: "mar-05", category: "Estrategia y activos intangibles", title: "Estrategia Marcaria Integral", price: 816.25, description: "Diseñamos el mapa completo de protección de todas tus marcas: cuáles registrar, en qué clases, con qué prioridad y en qué países, para que tu portafolio de marcas sea un activo estratégico sólido y no una colección de trámites inconexos." },
      { id: "mar-07", category: "Estrategia y activos intangibles", title: "Contrato de Cesión y Licencia de Derechos de Autor", price: 292.5, description: "Definimos con claridad quién es el dueño de lo que se crea. Si contratas a alguien para que cree una obra, garantizamos que esa creación te pertenezca. Si eres el creador y quieres autorizar el uso de tu obra, el contrato define exactamente cuánto, cómo y por cuánto tiempo." },
      { id: "mar-08", category: "Estrategia y activos intangibles", title: "Protección Legal de Software e IA", price: 1012.5, description: "Protegemos legalmente lo que tu equipo técnico construye: el código, los modelos de IA, las bases de datos y los algoritmos que hacen funcionar tu producto. Desde el registro del software hasta los contratos con tu equipo y la política de uso de IA generativa, te damos el escudo legal que tu tecnología necesita." },
      { id: "mar-09", category: "Estrategia y activos intangibles", title: "Auditoría de Activos Intangibles", price: 965, description: "Hacemos visible lo que tu empresa vale pero no aparece en el balance: tu marca, tu software, tu know-how y tus contratos clave. Inventariamos y valoramos tus activos intangibles para que queden documentados y sean reconocidos por inversionistas, bancos o compradores." },
      { id: "mar-10", category: "Estrategia y activos intangibles", title: "Secreto Empresarial y Know-How Shield", price: 876.25, description: "Protegemos lo que sabes hacer y que nadie más debería poder copiar. Diseñamos el blindaje legal de tu know-how: contratos, políticas internas y cláusulas que convierten tu conocimiento diferenciador en un activo legalmente protegido, imposible de llevarse sin consecuencias." },
    ],
  },
];

/** Display order used by the nav, the hub, and "Arma tu propio pack". */
export const serviceOrder = ["branding", "digital-web", "legal", "marketing"] as const;

export const serviceAddons: Record<string, ServiceCatalogEntry> = {
  branding: {
    slug: "branding",
    label: "Branding",
    blurb: "Identidades de marca con carácter: naming, sistemas visuales y guías que se sostienen en el tiempo.",
    accent: "#520000",
    onAccent: "#ffffff",
    items: [
      { id: "branding-brief", category: "Estrategia", title: "Brief y diagnóstico inicial", price: 45, description: "Entrevista y revisión inicial del negocio." },
      { id: "branding-diagnostico", category: "Estrategia", title: "Diagnóstico estratégico", price: 90, description: "Diagnóstico más completo del negocio y la marca. Es una alternativa al brief y diagnóstico inicial." },
      { id: "branding-diagnostico-profundizado", category: "Estrategia", title: "Diagnóstico profundizado", price: 130, description: "El análisis más completo de tu negocio y tu marca. Es una alternativa a los otros diagnósticos." },
      { id: "branding-competencia", category: "Estrategia", title: "Análisis básico de competencia", price: 45, description: "Revisión de hasta 3 competidores." },
      { id: "branding-benchmark", category: "Estrategia", title: "Benchmark competitivo", price: 90, description: "Análisis de hasta 5 competidores. Sustituye al análisis básico de competencia." },
      { id: "branding-esencia", category: "Estrategia", title: "Esencia / concepto de marca", price: 45, description: "Definición central de tu marca." },
      { id: "branding-adn", category: "Estrategia", title: "ADN de marca", price: 65, description: "Atributos y esencia de tu marca. Sustituye a la esencia / concepto de marca." },
      { id: "branding-proposito", category: "Estrategia", title: "Propósito y valores", price: 45, description: "Propósito de la marca y hasta 5 valores." },
      { id: "branding-publico", category: "Estrategia", title: "Público objetivo", price: 45, description: "Hasta 2 perfiles de cliente ideal." },
      { id: "branding-personalidad", category: "Estrategia", title: "Personalidad de marca", price: 45, description: "Rasgos y comportamiento de tu marca." },
      { id: "branding-arquetipo", category: "Estrategia", title: "Arquetipo de marca", price: 25, description: "Arquetipo principal y su aplicación." },
      { id: "branding-posicionamiento", category: "Estrategia", title: "Posicionamiento", price: 65, description: "Declaración de posicionamiento de tu marca." },
      { id: "branding-diferenciadores", category: "Estrategia", title: "Diferenciadores y promesa", price: 45, description: "Propuesta de valor y promesa de marca." },

      { id: "branding-tono", category: "Identidad verbal", title: "Tono básico", price: 45, description: "Orientaciones y ejemplos breves de cómo habla tu marca." },
      { id: "branding-identidad-verbal", category: "Identidad verbal", title: "Identidad verbal y lineamientos", price: 110, description: "Lineamientos completos de cómo se expresa tu marca. Sustituye al tono básico; no incluye naming ni slogan." },

      { id: "branding-concepto", category: "Dirección creativa", title: "Concepto estratégico", price: 65, description: "Idea rectora que conecta la estrategia con el diseño." },
      { id: "branding-moodboard", category: "Dirección creativa", title: "Moodboard / dirección visual", price: 45, description: "1 ruta visual. Elige esta opción o la dirección creativa." },
      { id: "branding-direccion-creativa", category: "Dirección creativa", title: "Moodboard / dirección creativa", price: 65, description: "Ruta visual desarrollada. Sustituye a la dirección visual." },

      { id: "branding-logo", category: "Identidad visual", title: "Logotipo principal", price: 130, description: "1 propuesta de logo; no incluye variantes." },
      { id: "branding-variante-logo", category: "Identidad visual", title: "Variante de logotipo", price: 25, description: "1 adaptación del logo existente." },
      { id: "branding-isotipo", category: "Identidad visual", title: "Isotipo", price: 65, description: "1 símbolo derivado del concepto aprobado." },
      { id: "branding-paleta", category: "Identidad visual", title: "Paleta de colores", price: 25, description: "Selección de colores de marca con sus códigos." },
      { id: "branding-tipografia", category: "Identidad visual", title: "Sistema tipográfico", price: 35, description: "Selección y jerarquía de tipografías; no incluye licencias." },
      { id: "branding-elementos-graficos", category: "Identidad visual", title: "Elementos gráficos básicos", price: 45, description: "Recursos gráficos básicos que complementan tu identidad." },
      { id: "branding-sistema-grafico", category: "Identidad visual", title: "Sistema gráfico", price: 90, description: "Sistema de recursos gráficos. Sustituye a los elementos gráficos básicos." },
      { id: "branding-sistema-visual", category: "Identidad visual", title: "Sistema visual integral", price: 130, description: "Recursos y reglas de uso de tu identidad visual. Sustituye al sistema gráfico." },

      { id: "branding-mini-guia", category: "Documentación", title: "Mini guía de marca", price: 45, description: "Documenta la identidad aprobada en hasta 8 páginas." },
      { id: "branding-brandbook", category: "Documentación", title: "Brandbook", price: 90, description: "Manual de marca de hasta 20 páginas. Sustituye a la mini guía." },
      { id: "branding-brandbook-completo", category: "Documentación", title: "Brandbook completo", price: 150, description: "Manual de marca de hasta 35 páginas. Sustituye a las otras guías." },

      { id: "branding-portada", category: "Aplicaciones", title: "Portada destacada", price: 15, description: "1 portada para redes sociales." },
      { id: "branding-mockup", category: "Aplicaciones", title: "Mockup", price: 25, description: "1 montaje de tu marca sobre un recurso existente." },

      { id: "branding-naming", category: "Adicionales", title: "Naming", price: 149, description: "Creación del nombre de tu marca. 1 unidad; el alcance se define en la cotización." },
      { id: "branding-slogan", category: "Adicionales", title: "Slogan", price: 59, description: "1 slogan; el alcance se define en la cotización." },
      { id: "branding-aplicacion", category: "Adicionales", title: "Aplicación adicional", price: 35, description: "1 aplicación de tu marca; el alcance se define en la cotización." },
      { id: "branding-plantilla", category: "Adicionales", title: "Plantilla adicional", price: 25, description: "1 plantilla; el alcance se define en la cotización." },
      { id: "branding-etiqueta", category: "Adicionales", title: "Etiqueta", price: 69, description: "Diseño de 1 etiqueta; el alcance se define en la cotización." },
      { id: "branding-packaging", category: "Adicionales", title: "Packaging", price: 129, description: "Diseño de 1 empaque; el alcance se define en la cotización." },
      { id: "branding-brandbook-ampliado", category: "Adicionales", title: "Brandbook ampliado", price: 149, description: "Extensión de una guía de marca existente." },
      { id: "branding-kit-redes", category: "Adicionales", title: "Kit visual para redes", price: 99, description: "Kit de piezas para redes acotado a 4 horas de trabajo; las piezas se definen antes de cotizar." },
      { id: "branding-firma-correo", category: "Adicionales", title: "Firma de correo", price: 35, description: "1 firma de correo con tu identidad; el alcance se define en la cotización." },
      { id: "branding-tarjeta", category: "Adicionales", title: "Tarjeta de presentación", price: 39, description: "Diseño de 1 tarjeta; el alcance se define en la cotización." },
      { id: "branding-hoja-membretada", category: "Adicionales", title: "Hoja membretada", price: 35, description: "Diseño de 1 hoja membretada; el alcance se define en la cotización." },
      { id: "branding-ronda-adicional", category: "Adicionales", title: "Ronda adicional de ajustes", price: 45, priceFrom: true, description: "Una ronda extra de cambios, desde $45; el valor final se ajusta según el alcance." },
    ],
  },
  legal: {
    slug: "legal",
    label: "Legal",
    blurb: "Derecho de empresas y derecho de marcas: constitución, contratos, registro y protección para crecer sin sobresaltos.",
    accent: "#7d1a1f",
    onAccent: "#ffffff",
    items: legalSections.flatMap((section) => section.items),
    sections: legalSections,
  },
  "digital-web": {
    slug: "digital-web",
    label: "Digital Web",
    blurb: "Sitios y productos digitales rápidos, claros y listos para convertir visitas en clientes.",
    accent: "#8fb0e3",
    onAccent: "#0b1956",
    items: [
      { id: "web-01", category: "Sitios web", title: "Landing Page Básica", price: 100, description: "Página única de hasta 4 secciones, con botón de WhatsApp, formulario, diseño responsive y SEO inicial." },
      { id: "web-02", category: "Sitios web", title: "Landing Page Premium", price: 300, description: "Hasta 7 secciones con interfaz personalizada, animaciones, analítica y formulario." },
      { id: "web-03", category: "Sitios web", title: "Sitio Corporativo", price: 890, description: "Hasta 8 páginas, con CMS básico, blog, analítica y capacitación para tu equipo." },
      { id: "web-04", category: "Sitios web", title: "E-commerce básico", price: 1200, description: "Tienda en línea de hasta 30 productos con catálogo, carrito y pasarela de pago. Las tarifas de la pasarela se pagan aparte." },
      { id: "web-10", category: "Sitios web", title: "Página interna adicional", price: 65, unit: "página", description: "Página nueva a partir de un diseño existente; el contenido lo aporta el cliente." },
      { id: "web-18", category: "Sitios web", title: "Migración web simple", price: 130, description: "Migración de un sitio estático, configuración de DNS y comprobación." },

      { id: "web-05", category: "Software a medida", title: "SaaS / MVP inicial", price: 5500, description: "Descubrimiento, inicio de sesión, 2 roles de usuario, 3 módulos, base de datos y despliegue." },
      { id: "web-06", category: "Software a medida", title: "Automatización Python simple", price: 250, description: "Un flujo automatizado: script, pruebas y documentación breve." },
      { id: "web-07", category: "Software a medida", title: "API Backend básica", price: 650, description: "Hasta 5 endpoints con autenticación simple, documentación y pruebas." },

      { id: "inf-01", category: "Dominio, hosting e infraestructura", title: "Registro de dominio .ec", price: 42, unit: "año", description: "Registro del dominio a nombre del cliente, con revisión de disponibilidad y renovación." },
      { id: "inf-02", category: "Dominio, hosting e infraestructura", title: "Hosting estático administrado", price: 30, unit: "año", description: "Publicación en Cloudflare Pages, DNS y monitoreo básico; no incluye cambios de contenido." },
      { id: "inf-03", category: "Dominio, hosting e infraestructura", title: "VPS administrado", price: 55, unit: "mes", description: "Configuración, actualizaciones y monitoreo básico. El servidor se cotiza aparte." },
      { id: "inf-04", category: "Dominio, hosting e infraestructura", title: "Cloud AWS administrada", price: 65, unit: "mes", description: "Administración de la cuenta y de un recurso básico. El consumo de AWS se paga aparte." },
      { id: "web-08", category: "Dominio, hosting e infraestructura", title: "Deploy AWS inicial", price: 180, description: "Configuración inicial, despliegue, DNS y guía. El consumo de AWS no está incluido." },
      { id: "inf-05", category: "Dominio, hosting e infraestructura", title: "Configuración de Supabase", price: 140, description: "Proyecto, tablas iniciales, seguridad (RLS), variables y conexión con el frontend." },
      { id: "inf-06", category: "Dominio, hosting e infraestructura", title: "Cloudflare CDN / DNS", price: 40, description: "DNS, CDN y HTTPS cuando aplique. El plan gratuito está sujeto a sus límites." },
      { id: "inf-07", category: "Dominio, hosting e infraestructura", title: "SSL / HTTPS", price: 25, description: "Certificado administrado por el hosting, revisión y forzado de HTTPS." },
      { id: "web-14", category: "Dominio, hosting e infraestructura", title: "Configuración de correo corporativo", price: 35, description: "DNS (MX, SPF y DKIM) y 1 cuenta. La suscripción al proveedor de correo se paga aparte." },

      { id: "web-09", category: "Contenido y soporte", title: "CMS gestionado básico", price: 180, description: "Sanity básico: tipos de contenido, acceso para editores y guía de uso." },
      { id: "web-11", category: "Contenido y soporte", title: "Carga de contenido", price: 18, unit: "hora", description: "Carga y formato de los textos e imágenes que nos proporciones." },
      { id: "web-12", category: "Contenido y soporte", title: "Mantenimiento web básico", price: 25, unit: "mes", description: "Actualización de contenido menor, hasta 1 hora al mes; no incluye desarrollo." },
      { id: "web-13", category: "Contenido y soporte", title: "Bolsa de horas de desarrollo", price: 22, unit: "hora", description: "Cambios y mejoras acordados, cobrados por hora." },

      { id: "web-15", category: "Integraciones y marketing técnico", title: "Formulario avanzado / CRM", price: 120, description: "Campos personalizados, validaciones, avisos y conexión con un CRM existente." },
      { id: "web-16", category: "Integraciones y marketing técnico", title: "SEO técnico ampliado", price: 180, description: "Auditoría técnica, datos estructurados (schema), sitemap, metadatos y rendimiento." },
      { id: "web-17", category: "Integraciones y marketing técnico", title: "Analítica y eventos", price: 90, description: "Google Analytics 4, eventos de conversión básicos y comprobación." },
    ],
  },
  marketing: {
    slug: "marketing",
    label: "Marketing",
    blurb: "Campañas y contenido para que tu marca se mueva: más alcance, más conversaciones, más clientes.",
    accent: "#6f95d6",
    onAccent: "#0b1956",
    items: [
      { id: "mkt-01", category: "Estrategia", title: "Diagnóstico Estratégico 360°", price: 50, priceFrom: true, description: "Auditoría digital, FODA, cliente ideal, competencia, revisión de tu presencia actual, oportunidades y prioridades." },
      { id: "mkt-02", category: "Estrategia", title: "Investigación Digital de Mercado", price: 100, description: "Investigación profunda de mercado: demanda, tendencias, competencia, precios y oportunidades." },
      { id: "mkt-03", category: "Estrategia", title: "Estrategia de Marketing 90 días", price: 119, description: "Objetivos, públicos, propuesta comercial, canales, acciones, contenido, pauta y KPIs para los próximos 3 meses." },
      { id: "mkt-04", category: "Estrategia", title: "Plan Estratégico de Contenidos", price: 69, description: "Pilares, formatos, temas, frecuencia, calendario y objetivos del mes. No incluye la creación de piezas." },
      { id: "mkt-05", category: "Estrategia", title: "Estrategia de Campaña o Lanzamiento", price: 89, description: "Concepto, objetivo, audiencia, mensaje, canales, llamado a la acción y cronograma de una campaña." },

      { id: "mkt-06", category: "Contenido", title: "Copywriting Comercial", price: 30, description: "1 texto para publicación, reel, anuncio o pieza." },
      { id: "mkt-07", category: "Contenido", title: "Contenido Gráfico", price: 15, description: "1 diseño para redes sociales sobre tu identidad ya existente." },
      { id: "mkt-08", category: "Contenido", title: "Carrusel", price: 29, description: "Hasta 5 diapositivas, diseñadas sobre tu identidad existente." },
      { id: "mkt-09", category: "Contenido", title: "Producción de Reels", price: 59, description: "Idea breve, grabación con móvil, estabilizador DJI y micrófono, edición, subtítulos y llamado a la acción." },
      { id: "mkt-10", category: "Contenido", title: "Sesión Fotográfica Comercial Express", price: 69, description: "Sesión de contenido con móvil, más selección y edición de 10 a 15 fotografías." },

      { id: "mkt-11", category: "Gestión y pauta", title: "Gestión de Red Social", price: 100, unit: "mes", description: "Programación, publicación, organización, supervisión y respuesta básica. No incluye la creación de contenido." },
      { id: "mkt-12", category: "Gestión y pauta", title: "Configuración Meta Business", price: 50, description: "Portfolio, activos, permisos, cuenta publicitaria, conexión de páginas y revisión técnica." },
      { id: "mkt-13", category: "Gestión y pauta", title: "Gestión de Meta Ads", price: 100, unit: "mes", description: "Configuración, segmentación, hasta 2 conjuntos de anuncios, monitoreo, optimización y reporte." },
      { id: "mkt-14", category: "Gestión y pauta", title: "Analítica + Reporte de Optimización", price: 50, description: "Resultados, KPIs, interpretación, aprendizajes y acciones para el siguiente período." },
      { id: "mkt-15", category: "Gestión y pauta", title: "Optimización de Perfil", price: 20, description: "Biografía, fotos, publicaciones destacadas y enlace Beacons." },
    ],
  },
};
