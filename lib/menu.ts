// Menú del sitio según el documento de Juli ("Proyecto web CDVP"): categorías y, debajo de cada
// una, las subcategorías, que son los productos (cada uno ya tiene su propia página).
// Un producto puede estar en más de una categoría (p. ej. los cursos técnicos).

export const MENU_ITEMS = [
  { key: "membership", href: "/suscripcion" },
  { key: "courses", href: "/categoria/cursos" },
  { key: "coaches", href: "/categoria/coaches" },
  { key: "events", href: "/categoria/eventos" },
  { key: "custom", href: "/categoria/personalizado" },
  { key: "contact", href: "/contacto" },
] as const;
export type MenuKey = (typeof MENU_ITEMS)[number]["key"];

export const CATEGORY_PAGES = {
  cursos: {
    key: "courses",
    groups: [
      {
        key: "technique",
        products: ["recepcion", "armado", "ataque", "defensa", "bloqueo", "saque"],
      },
      {
        key: "physical",
        products: [
          "plan-de-gimnasio-para-mejorar-el-salto",
          "plan-de-movilidad-21-dias",
          "mentalidad-deportiva",
        ],
      },
      { key: "exercises", products: ["banco-de-120-ejercicios"] },
      { key: "packs", products: ["todos-los-cursos"] },
    ],
  },
  coaches: {
    key: "coaches",
    products: [
      "curso-para-entrenadores",
      "banco-de-120-ejercicios",
      "planificacion",
      "recepcion",
      "armado",
      "ataque",
      "defensa",
      "bloqueo",
      "saque",
    ],
  },
  eventos: { key: "events", products: ["campamento-cerrito"] },
  // Aún no son productos con compra (spec 7): se consultan por Contacto.
  personalizado: { key: "custom", products: [] },
} as const;
export function categoryGroups(
  page: (typeof CATEGORY_PAGES)[keyof typeof CATEGORY_PAGES],
): { key?: string; products: readonly string[] }[] {
  return "groups" in page ? [...page.groups] : [{ products: page.products }];
}

export type CategoryPageSlug = keyof typeof CATEGORY_PAGES;

export function isCategoryPageSlug(value: string): value is CategoryPageSlug {
  return value in CATEGORY_PAGES;
}

// Servicios personalizados del documento de Juli.
export const CUSTOM_SERVICES = ["beachVolleyLab", "personalTraining"] as const;

export const CONTACT = {
  email: "clubdevoleyplaya@gmail.com",
  // El número de WhatsApp lo pasa Juli: mientras no esté, el botón no aparece.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/clubdevoleyplaya/" },
    { name: "TikTok", href: "https://www.tiktok.com/@clubdevoleyplaya" },
    { name: "YouTube", href: "https://www.youtube.com/@Clubdevoleyplaya-JuliAzaad" },
  ],
} as const;
