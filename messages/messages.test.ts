import { describe, expect, it } from "vitest";

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
  it("ningún texto queda vacío", () => {
    for (const m of [es, en, pt]) {
      expect(keys(m).length).toBeGreaterThan(0);
      expect(JSON.stringify(m)).not.toContain('""');
    }
  });
});
