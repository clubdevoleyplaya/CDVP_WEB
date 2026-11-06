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
  testimonials?: Testimonial[];
  // Video de venta (Vimeo) del curso; se muestra solo en su ficha.
  vslVimeoId?: string;
}

// Texto, imagen (captura) o ambos; los videos no van aquí.
export type Testimonial = { quote?: string; author: string; image?: string };

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
    vslVimeoId: "1244394563",
    testimonials: [
      {
        quote:
          "Este curso de ataque, al igual que el de recepción y armado, describe los movimientos desde un análisis minucioso y claro.",
        author: "Fernando Ariel Mezzera",
      },
      {
        quote:
          "Solo decirte gracias Juli por explicar fácil lo que puede ser difícil de entender. Es una gran ayuda de tu parte brindarnos tanta calidad de contenido.",
        author: "Diego Huicy",
      },
      {
        quote:
          "Desde Side Out Volleyball Club en Venezuela recomendamos este curso, muy práctico, dinámico y fluido el facilitador con muchos conocimientos.",
        author: "Lenhil Linares",
      },
      {
        quote:
          "Muy buen desglose de las formas de ataque, entrada, shot, la carrera de entrada y la forma de golpear el balón.",
        author: "Hugo Morgado",
      },
      {
        quote:
          "Muy bueno Juli como siempre. Mucha info que no conocía. Aprendo cada día más con tus cursos.",
        author: "Cecilia Melgarejo",
      },
      {
        quote:
          "Muy buen curso, bastante completo para jugadores amateurs o semi-pro para ir corrigiendo pequeños detalles.",
        author: "Alejandro Dominguez",
      },
    ],
    priceArs: 50000,
    priceUsd: 50,
    discountable: true,
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
    testimonials: [
      {
        quote:
          "Excelente curso, recomendable, muy buena explicación de cada concepto.",
        author: "Sergio Balmaceda",
      },
    ],
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
    testimonials: [
      {
        quote:
          "Muy claros y concretos los conceptos! Excelente propuesta.",
        author: "María Luz Picardo",
      },
    ],
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
    rating: { value: 5.0, count: 8 },
    vslVimeoId: "1244394560",
    testimonials: [
      {
        quote:
          "Destaco que Juli explica muy bien. Que te hace entender fácil lo que podría ser muy complicado. Y esta es una característica de los buenos entrenadores/profesores.",
        author: "Diego Huicy",
      },
      {
        quote:
          "Me sacó muchas dudas acerca de cómo posicionarme en la defensa, ya que juego indoor (armador) y cubro una sola parte de la cancha.",
        author: "Franccesca Bertuzzi Pelizzari",
      },
      {
        quote:
          "Poner en práctica lo aprendido el día de hoy, muy bien explicado.",
        author: "Hugo Morgado",
      },
    ],
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
    rating: { value: 5.0, count: 4 },
    vslVimeoId: "1244394565",
    testimonials: [
      {
        quote:
          "Súper bien explicado, se entiende a la perfección lo que se está enseñando. Muchas gracias por el curso.",
        author: "Hugo Morgado",
      },
    ],
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
    rating: { value: 4.88, count: 8 },
    vslVimeoId: "1244394561",
    testimonials: [
      {
        quote:
          "Realicé el curso de recepción del Club de Voley Playa y continué con el de armado. Lo valoro con 5 estrellas porque enseña fundamentos técnicos detalladamente, analiza situaciones posibles de juego y usa la herramienta de colores para marcar trayectorias de pelota y lugares de la cancha. Lo recomiendo, es muy didáctico.",
        author: "Fernando Ariel Mezzera",
      },
      {
        quote:
          "Muy buen curso, explica sobre todo la toma de decisiones en cuanto al armado según las circunstancias del juego.",
        author: "Iver Leal Miranda",
      },
      {
        quote:
          "Me gustó demasiado, aprendí muchas técnicas que no sabía y mejoré mi nivel de armado en cancha.",
        author: "Leonardo Vasquez",
      },
    ],
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
    rating: { value: 5.0, count: 3 },
    vslVimeoId: "1244394676",
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
    rating: { value: 4.8, count: 10 },
    testimonials: [
      {
        quote:
          "Excelente información, muchas gracias.",
        author: "Andres Moraila Quintero",
      },
      {
        quote:
          "¡Muy completo e interactivo!",
        author: "Leandro Fogel Fogel",
      },
      {
        quote:
          "¡Súper completo!",
        author: "Joaquin Ceballos",
      },
    ],
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
    rating: { value: 4.93, count: 30 },
    vslVimeoId: "1244394665",
    testimonials: [
      {
        quote:
          "El fundamento de la recepción y sus variables con respecto a los saques, el clima y el compañero es muy específico. Analiza cada acción desde un proceso metodológico muy claro. Lo recomiendo para jugadores y entrenadores.",
        author: "Fernando Ariel Mezzera",
      },
      {
        quote:
          "Es un curso bastante completo y con indicaciones muy claras y precisas. Muy recomendable.",
        author: "Miriam Amaya Keller",
      },
      {
        quote:
          "Muy bueno, para jugadores que están arrancando a jugar en arena. ¡Queremos más Juli! Gracias.",
        author: "Claudia Elisabet Ceccani",
      },
      {
        quote:
          "Buen curso, me solucionó bastantes dudas que tenía con respecto a la recepción.",
        author: "Alan José Soltys",
      },
    ],
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
    priceArs: 80000,
    priceUsd: 80,
    compareArs: 120000,
    compareUsd: 120,
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
    priceArs: 350000,
    priceUsd: 350,
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
  {
    slug: "banco-de-120-ejercicios",
    category: "descargable",
    title: "Banco de 120 ejercicios de voley playa",
    shortDescription: "120 ejercicios de voley playa para entrenar por tu cuenta.",
    longDescription:
      "Un banco de 120 ejercicios de voley playa. Descripción provisional: Juli completa el texto final.",
    priceArs: 50000,
    priceUsd: 50,
    discountable: false,
  },
  {
    slug: "curso-para-entrenadores",
    category: "curso",
    title: "Curso online para entrenadores",
    shortDescription: "Curso por cohorte para entrenadores de voley playa.",
    longDescription:
      "Curso online para entrenadores, por cohorte. Descripción provisional: Juli completa el texto final.",
    priceArs: 300000,
    priceUsd: 300,
    discountable: false,
  },
  {
    slug: "campamento-cerrito",
    category: "evento",
    title: "Campamento Cerrito",
    shortDescription: "Campamento presencial anual de voley playa.",
    longDescription:
      "Campamento presencial anual en Cerrito. Descripción provisional: Juli completa fecha y texto final.",
    priceArs: 200000,
    priceUsd: 200,
    discountable: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}
