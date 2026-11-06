"use client";

import { useEffect, useState } from "react";
import { useDemoState } from "@/context/demo-state";
import { hasCourseAccess, type CourseAccess } from "@/lib/course-access";

// null = todavía no se sabe (con sesión). Sin sesión no hay nada que consultar: no lo tiene.
// Si la consulta falla se asume que no lo tiene y el checkout avisa igual ("Ya tenés este producto").
export function useOwnedProduct(slug: string): boolean | null {
  const { session } = useDemoState();
  const [owned, setOwned] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me/products`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((courses: CourseAccess[]) => !cancelled && setOwned(hasCourseAccess(courses, slug)))
      .catch(() => !cancelled && setOwned(false));
    return () => {
      cancelled = true;
    };
  }, [session, slug]);

  return session ? owned : false;
}
