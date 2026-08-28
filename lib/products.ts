export type Category = "curso" | "descargable" | "combo" | "evento";
export type CategoryRoute = "cursos" | "descargables" | "combos" | "eventos";

export interface Product {
  slug: string;
  category: Category;
  title: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  chips?: string[];
  modules?: number;
  rating?: { value: number; count: number };
  priceArs: number;
  priceUsd: number;
  compareArs?: number;
  compareUsd?: number;
  discountable: boolean;
  includes?: string;
  testimonials?: { quote: string; author: string }[];
}

export const CATEGORY_ROUTES: Record<CategoryRoute, Category> = {
  cursos: "curso",
  descargables: "descargable",
  combos: "combo",
  eventos: "evento",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  curso: "Curso",
  descargable: "Guía y plan",
  combo: "Combo",
  evento: "Evento",
};

export const CATEGORY_ROUTE_LABELS: Record<CategoryRoute, string> = {
  cursos: "Cursos",
  descargables: "Guías y planes",
  combos: "Combos",
  eventos: "Eventos",
};

export const CATEGORY_TO_ROUTE: Record<Category, CategoryRoute> = {
  curso: "cursos",
  descargable: "descargables",
  combo: "combos",
  evento: "eventos",
};

export const products: Product[] = [
  {
    slug: "ataque",
    category: "curso",
    image: "/images/products/ataque.png",
    title: "Ataque",
    shortDescription:
      "Entrada de ataque, brazos, impacto de pelota y los errores que más le cuestan a un atacante amateur.",
    longDescription:
      "Un recorrido completo por el gesto de ataque: entrada, coordinación de brazos, punto de impacto de la pelota y los errores más frecuentes que frenan a un atacante amateur. Incluye tips puntuales para subir de nivel rápido.",
    chips: ["Pies", "Brazos", "Impacto", "Errores frecuentes", "Tips"],
    modules: 5,
    rating: { value: 5.0, count: 9 },
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
    testimonials: [
      {
        quote:
          "Este curso de ataque, al igual que el de recepción y armado, describe los movimientos desde un análisis minucioso y claro.",
        author: "Fernando Ariel Mezzera",
      },
      {
        quote:
          "Muy buen desglose de las formas de ataque, entrada, shot, la carrera de entrada y la forma de golpear el balón.",
        author: "Hugo Morgado",
      },
    ],
  },
  {
    slug: "mentalidad-deportiva",
    category: "curso",
    image: "/images/products/mentalidad-deportiva.png",
    title: "Mentalidad para voley playa",
    shortDescription:
      "Objetivos, mentalidad de entrenamiento y de partido, concentración y disciplina.",
    longDescription:
      "Trabaja la cabeza tanto como el cuerpo: importancia de los objetivos, mentalidad de entrenamientos y partidos, concentración en competencia y la disciplina para sostener el proceso.",
    modules: 1,
    rating: { value: 4.75, count: 4 },
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "planificacion",
    category: "curso",
    image: "/images/products/planificacion.png",
    title: "Planificación para entrenadores/as",
    shortDescription:
      "Planificá aspectos técnicos, físicos y mentales de una sesión de entrenamiento.",
    longDescription:
      "Pensado para entrenadores/as: cómo planificar los aspectos técnicos, físicos y mentales de una sesión, y cómo armar una planificación completa para entrenar y competir mejor.",
    modules: 1,
    rating: { value: 4.67, count: 3 },
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "defensa",
    category: "curso",
    image: "/images/products/defensa.png",
    title: "Defensa",
    shortDescription:
      "Toda la información exclusiva para mejorar tu posicionamiento y lectura en defensa.",
    longDescription:
      "Mejorá tu defensa con toda la información exclusiva del club: posicionamiento, lectura del ataque rival y los ajustes finos que marcan la diferencia en la arena.",
    modules: 1,
    rating: { value: 5.0, count: 7 },
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "bloqueo",
    category: "curso",
    image: "/images/products/bloqueo.png",
    title: "Bloqueo",
    shortDescription: "Técnica de bloqueo individual y lectura del ataque rival.",
    longDescription:
      "Fundamentos del bloqueo individual en voley playa: posicionamiento, timing y lectura del ataque rival para cerrar bien los espacios.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "armado",
    category: "curso",
    image: "/images/products/armado.png",
    title: "Armado",
    shortDescription: "Fundamentos de armado para dominar todos los ritmos de ataque.",
    longDescription:
      "Los fundamentos del armado en la arena: manejo de ritmos, variantes de colocación y cómo darle opciones claras a tu atacante.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "saque",
    category: "curso",
    image: "/images/products/saque.png",
    title: "Saque",
    shortDescription: "Técnica y variantes de saque para presionar la recepción rival.",
    longDescription:
      "Técnica de saque y sus variantes para presionar la recepción rival desde el primer contacto del punto.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "conceptos-generales",
    category: "curso",
    image: "/images/products/conceptos-generales.png",
    title: "Conceptos generales",
    shortDescription: "Las bases del voley playa antes de meterte en la técnica de cada gesto.",
    longDescription:
      "Las bases del voley playa: reglas, dinámica de juego y los conceptos generales que necesitás entender antes de meterte en la técnica de cada gesto.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "recepcion",
    category: "curso",
    image: "/images/products/recepcion.png",
    title: "Recepción",
    shortDescription: "Posicionamiento y lectura de saque para una recepción más consistente.",
    longDescription:
      "Posicionamiento, lectura de saque y ajustes de recepción para llegar más consistente al primer contacto.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "analisis-tecnico-biomecanico",
    category: "descargable",
    title: "Análisis técnico-biomecánico",
    shortDescription: "Informe detallado del gesto técnico, pensado para entrenadores.",
    longDescription:
      "Un informe detallado del gesto técnico desde la biomecánica, pensado para entrenadores que quieren entender el porqué detrás de cada corrección.",
    priceArs: 100000,
    priceUsd: 100,
    discountable: false,
  },
  {
    slug: "plan-de-movilidad-21-dias",
    category: "descargable",
    title: "Plan de movilidad — 21 días",
    shortDescription: "Rutina progresiva de movilidad para sostener el volumen de entrenamiento.",
    longDescription:
      "Una rutina progresiva de 21 días para ganar y sostener la movilidad que exige el volumen de entrenamiento en la arena.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: false,
  },
  {
    slug: "guia-nutricional-para-torneos-y-entrenamientos",
    category: "descargable",
    title: "Guía nutricional para torneos y entrenamientos",
    shortDescription: "Pautas de alimentación para competir y entrenar sin bajar el nivel.",
    longDescription:
      "Pautas prácticas de alimentación para sostener el nivel de entrenamiento y llegar bien a los torneos, sin planes imposibles de seguir.",
    priceArs: 30000,
    priceUsd: 30,
    discountable: false,
  },
  {
    slug: "planificacion-de-entrenamientos-en-cancha",
    category: "descargable",
    title: "Planificación de entrenamientos en cancha",
    shortDescription: "Estructura de sesiones de cancha lista para aplicar con tu grupo.",
    longDescription:
      "Una estructura de sesiones de cancha lista para aplicar con tu grupo, pensada para entrenadores que necesitan organizar su semana.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: false,
  },
  {
    slug: "plan-de-gimnasio-para-mejorar-el-salto",
    category: "descargable",
    title: "Plan de gimnasio PRO",
    shortDescription: "Rutina de gimnasio orientada a potencia de salto y prevención de lesiones.",
    longDescription:
      "Rutina de gimnasio orientada a potencia de salto y prevención de lesiones, para complementar el trabajo de cancha.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: false,
  },
  {
    slug: "plan-aerobico-pro",
    category: "descargable",
    title: "Plan aeróbico PRO",
    shortDescription: "Base aeróbica para sostener el ritmo de partido en la arena.",
    longDescription:
      "Una base aeróbica pensada específicamente para sostener el ritmo de partido que exige jugar sobre arena.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: false,
  },
  {
    slug: "todos-los-cursos",
    category: "combo",
    title: "Todos los cursos",
    shortDescription: "Los 8 cursos técnicos del club en un solo pack, con descuento por volumen.",
    longDescription:
      "Los 8 cursos técnicos del club — ataque, defensa, bloqueo, armado, saque, recepción, conceptos generales y mentalidad — en un solo pack, con descuento por volumen.",
    includes: "8 productos",
    priceArs: 340000,
    priceUsd: 340,
    compareArs: 400000,
    compareUsd: 400,
    discountable: false,
  },
  {
    slug: "copia-de-combo-k1-recepcion-armado-ataque",
    category: "combo",
    title: "Combo K2 — Saque, Defensa, Bloqueo",
    shortDescription: "Los 3 fundamentos defensivos y de saque en un solo pack.",
    longDescription:
      "Saque, defensa y bloqueo — los tres fundamentos que sostienen el punto desde el lado defensivo — combinados en un solo pack.",
    includes: "3 productos",
    priceArs: 135000,
    priceUsd: 135,
    compareArs: 150000,
    compareUsd: 150,
    discountable: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
