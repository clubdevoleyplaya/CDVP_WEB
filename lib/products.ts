export type Category = "curso" | "programa" | "descargable" | "combo";
export type CategoryRoute = "cursos" | "programas" | "descargables" | "combos";

export interface Product {
  slug: string;
  category: Category;
  title: string;
  shortDescription: string;
  longDescription: string;
  chips?: string[];
  modules?: number;
  rating?: { value: number; count: number };
  priceArs: number;
  priceUsd: number;
  compareArs?: number;
  compareUsd?: number;
  discountable: boolean;
  includes?: string;
}

export const CATEGORY_ROUTES: Record<CategoryRoute, Category> = {
  cursos: "curso",
  programas: "programa",
  descargables: "descargable",
  combos: "combo",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  curso: "Curso",
  programa: "Programa",
  descargable: "Guía y plan",
  combo: "Combo",
};

export const CATEGORY_ROUTE_LABELS: Record<CategoryRoute, string> = {
  cursos: "Cursos",
  programas: "Programas",
  descargables: "Guías y planes",
  combos: "Combos",
};

export const CATEGORY_TO_ROUTE: Record<Category, CategoryRoute> = {
  curso: "cursos",
  programa: "programas",
  descargable: "descargables",
  combo: "combos",
};

export const products: Product[] = [
  {
    slug: "ataque",
    category: "curso",
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
  },
  {
    slug: "mentalidad-deportiva",
    category: "curso",
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
    title: "Recepción",
    shortDescription: "Posicionamiento y lectura de saque para una recepción más consistente.",
    longDescription:
      "Posicionamiento, lectura de saque y ajustes de recepción para llegar más consistente al primer contacto.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
  },
  {
    slug: "copia-de-programa-beach-voley-pro",
    category: "programa",
    title: "Beach Voley Pro — Gold",
    shortDescription: "Programa completo de 7 productos para llevar tu juego a nivel competitivo.",
    longDescription:
      "El programa más completo del club: 7 productos combinados para llevar tu nivel de juego hacia lo competitivo, con progresión técnica y física integrada.",
    includes: "7 productos",
    priceArs: 400000,
    priceUsd: 400,
    discountable: false,
  },
  {
    slug: "beachvoleyprosilver",
    category: "programa",
    title: "Beach Voley Pro — Silver",
    shortDescription: "Versión reducida del programa Gold, 6 productos clave para arrancar.",
    longDescription:
      "Una versión más compacta del programa Gold: 6 productos clave para arrancar tu proceso sin necesitar el paquete completo.",
    includes: "6 productos",
    priceArs: 300000,
    priceUsd: 300,
    discountable: false,
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
