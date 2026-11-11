import { describe, expect, it } from "vitest";

import { CATEGORY_PAGES } from "./menu";
import { products } from "./products";

describe("menú por categorías", () => {
  it("todo producto listado existe en el catálogo", () => {
    const slugs = new Set(products.map((p) => p.slug));
    for (const [category, page] of Object.entries(CATEGORY_PAGES)) {
      for (const slug of page.products) {
        expect(slugs.has(slug), `${category}: ${slug}`).toBe(true);
      }
    }
  });

  it("no repite un producto dentro de una categoría", () => {
    for (const page of Object.values(CATEGORY_PAGES)) {
      expect(new Set(page.products).size).toBe(page.products.length);
    }
  });
});
