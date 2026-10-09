import { describe, expect, it } from "vitest";

import { hasCourseAccess } from "./course-access";

const courses = [
  { slug: "armado", title: "Armado", has_access: true },
  { slug: "ataque", title: "Ataque", has_access: false },
];

describe("hasCourseAccess", () => {
  it("es verdadero solo para un curso con acceso", () => {
    expect(hasCourseAccess(courses, "armado")).toBe(true);
    expect(hasCourseAccess(courses, "ataque")).toBe(false);
  });

  it("es falso si el curso no está en la lista o la lista no es válida", () => {
    expect(hasCourseAccess(courses, "no-existe")).toBe(false);
    expect(hasCourseAccess([], "armado")).toBe(false);
    expect(hasCourseAccess(null, "armado")).toBe(false);
    expect(hasCourseAccess(undefined, "armado")).toBe(false);
  });

  it("no confía en valores que no sean exactamente true", () => {
    expect(hasCourseAccess([{ slug: "a", title: "A", has_access: "true" as unknown as boolean }], "a")).toBe(false);
  });
});
