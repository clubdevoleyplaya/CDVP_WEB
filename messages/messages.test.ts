import { describe, expect, it } from "vitest";

import { products } from "../lib/products";

import en from "./en.json";
import es from "./es.json";
import pt from "./pt.json";

function keys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null
      ? keys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe("mensajes", () => {
  const base = keys(es).sort();
  it.each([
    ["en", en],
    ["pt", pt],
  ])("%s tiene exactamente las mismas claves que es", (_name, messages) => {
    expect(keys(messages).sort()).toEqual(base);
  });
  it.each([
    ["es", es],
    ["en", en],
    ["pt", pt],
  ])("%s traduce todos los productos del catálogo", (_name, messages) => {
    const translated = (messages as unknown as { Products: Record<string, Record<string, unknown>> }).Products;
    for (const product of products) {
      const entry = translated[product.slug];
      expect(entry, product.slug).toBeDefined();
      expect(entry.title, product.slug).toBeTruthy();
      expect(entry.shortDescription, product.slug).toBeTruthy();
      expect(entry.longDescription, product.slug).toBeTruthy();
      if (product.includes) expect(entry.includes, product.slug).toBeTruthy();
      if (product.chips) expect(entry.chips, product.slug).toHaveLength(product.chips.length);
    }
  });
  it("el español de Products coincide con lib/products.ts", () => {
    const translated = (es as unknown as { Products: Record<string, { title: string; shortDescription: string; longDescription: string }> }).Products;
    for (const product of products) {
      expect(translated[product.slug].title).toBe(product.title);
      expect(translated[product.slug].shortDescription).toBe(product.shortDescription);
      expect(translated[product.slug].longDescription).toBe(product.longDescription);
    }
  });
  it("ningún texto queda vacío", () => {
    for (const m of [es, en, pt]) {
      expect(keys(m).length).toBeGreaterThan(0);
      expect(JSON.stringify(m)).not.toContain('""');
    }
  });
});
