// `/me/courses` y `/me/products` devuelven los productos con `has_access` (compra o, en cursos,
// suscripción activa).
export type CourseAccess = { slug: string; title: string; has_access: boolean };

export function hasCourseAccess(courses: CourseAccess[] | null | undefined, slug: string): boolean {
  return Array.isArray(courses) && courses.some((c) => c.slug === slug && c.has_access === true);
}
