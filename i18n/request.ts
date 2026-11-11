import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/locale";

// Sin prefijo en la URL: el idioma sale de la cookie `cdvp_locale` (la fija `proxy.ts`).
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
