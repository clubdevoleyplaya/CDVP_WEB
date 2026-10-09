import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, detectLocale, isLocale } from "@/lib/locale";

const PREFERENCE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

// Primera visita: se detecta el idioma del navegador y se guarda en una cookie (también en la
// request, para que el layout la lea en esta misma carga). Lo que la persona elija la reemplaza.
// La moneda no se detecta: la elige la persona (cookie `cdvp_currency`, la guarda el selector).
function ensurePreferenceCookies(request: NextRequest): { name: string; value: string }[] {
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(localeCookie)) return [];
  const value = detectLocale({ acceptLanguage: request.headers.get("accept-language") });
  request.cookies.set(LOCALE_COOKIE, value);
  return [{ name: LOCALE_COOKIE, value }];
}

export async function proxy(request: NextRequest) {
  const newPreferenceCookies = ensurePreferenceCookies(request);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          newPreferenceCookies.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value, PREFERENCE_COOKIE_OPTIONS),
          );
        },
      },
    },
  );

  newPreferenceCookies.forEach(({ name, value }) =>
    supabaseResponse.cookies.set(name, value, PREFERENCE_COOKIE_OPTIONS),
  );

  // No usar `getSession()` acá: no valida el token contra el server, solo lee la cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
